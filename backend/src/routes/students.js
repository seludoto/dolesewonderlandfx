const express = require('express');
const { body, validationResult } = require('express-validator');
const { Enrollment, Course, User } = require('../models');
const { protect, authorize } = require('../middleware/auth');
const { sendEnrollmentConfirmation, sendNewEnrollmentNotification } = require('../services/email');
const logger = require('../utils/logger');

const router = express.Router();

// @desc    Enroll in a course
// @route   POST /api/students/enroll
// @access  Private (Students)
router.post('/enroll', [
  protect,
  body('courseId').isUUID().withMessage('Valid course ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { courseId } = req.body;
    const studentId = req.user.id;

    // Check if course exists and is published
    const course = await Course.findByPk(courseId);
    if (!course || course.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      where: { studentId, courseId }
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      studentId,
      courseId,
      totalLectures: course.totalLectures || 0
    });

    logger.info(`Student ${req.user.email} enrolled in course: ${course.title}`);

    // Send enrollment confirmation email
    sendEnrollmentConfirmation(req.user, course).catch(error => {
      logger.error('Failed to send enrollment confirmation:', error);
    });

    // Notify instructor
    const instructor = await User.findByPk(course.instructorId);
    if (instructor) {
      sendNewEnrollmentNotification(instructor, req.user, course).catch(error => {
        logger.error('Failed to send instructor notification:', error);
      });
    }

    res.status(201).json({
      success: true,
      data: {
        enrollment: {
          id: enrollment.id,
          courseId: enrollment.courseId,
          status: enrollment.status,
          progress: enrollment.progress,
          enrolledAt: enrollment.createdAt
        }
      }
    });
  } catch (error) {
    logger.error('Enroll course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get student's enrolled courses
// @route   GET /api/students/courses
// @access  Private (Students)
router.get('/courses', protect, async (req, res) => {
  try {
    const { page = 1, limit = 12, status } = req.query;
    const offset = (page - 1) * limit;

    const where = { studentId: req.user.id };
    if (status) where.status = status;

    const { count, rows: enrollments } = await Enrollment.findAndCountAll({
      where,
      include: [{
        model: Course,
        as: 'course',
        include: [{
          model: User,
          as: 'instructor',
          attributes: ['id', 'firstName', 'lastName', 'avatar']
        }]
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        enrollments: enrollments.map(enrollment => ({
          id: enrollment.id,
          course: enrollment.course.getPublicData(),
          status: enrollment.status,
          progress: enrollment.progress,
          completedLectures: enrollment.completedLectures,
          totalLectures: enrollment.totalLectures,
          lastAccessedAt: enrollment.lastAccessedAt,
          completedAt: enrollment.completedAt,
          enrolledAt: enrollment.createdAt
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get student courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update course progress
// @route   PUT /api/students/progress/:enrollmentId
// @access  Private (Students)
router.put('/progress/:enrollmentId', [
  protect,
  body('progress').isFloat({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100'),
  body('completedLectures').optional().isInt({ min: 0 }).withMessage('Completed lectures must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { enrollmentId } = req.params;
    const { progress, completedLectures } = req.body;

    const enrollment = await Enrollment.findByPk(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check ownership
    if (enrollment.studentId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this enrollment'
      });
    }

    await enrollment.updateProgress(progress, completedLectures);

    logger.info(`Student ${req.user.email} updated progress in course ${enrollment.courseId}: ${progress}%`);

    res.status(200).json({
      success: true,
      data: {
        enrollment: {
          id: enrollment.id,
          progress: enrollment.progress,
          completedLectures: enrollment.completedLectures,
          status: enrollment.status,
          lastAccessedAt: enrollment.lastAccessedAt,
          completedAt: enrollment.completedAt
        }
      }
    });
  } catch (error) {
    logger.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Mark course as completed
// @route   PUT /api/students/complete/:enrollmentId
// @access  Private (Students)
router.put('/complete/:enrollmentId', protect, async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findByPk(enrollmentId);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check ownership
    if (enrollment.studentId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to complete this enrollment'
      });
    }

    if (enrollment.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Course already completed'
      });
    }

    await enrollment.markAsCompleted();

    logger.info(`Student ${req.user.email} completed course ${enrollment.courseId}`);

    // Send course completion email
    const { sendCourseCompletionEmail } = require('../services/email');
    const course = await Course.findByPk(enrollment.courseId);
    if (course) {
      sendCourseCompletionEmail(req.user, course, enrollment.certificateUrl).catch(error => {
        logger.error('Failed to send completion email:', error);
      });
    }

    res.status(200).json({
      success: true,
      data: {
        enrollment: {
          id: enrollment.id,
          status: enrollment.status,
          progress: enrollment.progress,
          completedAt: enrollment.completedAt
        }
      }
    });
  } catch (error) {
    logger.error('Complete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add course review
// @route   POST /api/students/review/:enrollmentId
// @access  Private (Students)
router.post('/review/:enrollmentId', [
  protect,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().isLength({ max: 1000 }).withMessage('Review must be less than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { enrollmentId } = req.params;
    const { rating, review } = req.body;

    const enrollment = await Enrollment.findByPk(enrollmentId, {
      include: [{ model: Course, as: 'course' }]
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Check ownership and completion
    if (enrollment.studentId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this course'
      });
    }

    if (enrollment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed courses'
      });
    }

    await enrollment.addReview(rating, review);

    logger.info(`Student ${req.user.email} reviewed course ${enrollment.course.title}: ${rating} stars`);

    res.status(200).json({
      success: true,
      data: {
        review: {
          rating: enrollment.rating,
          review: enrollment.review,
          createdAt: enrollment.reviewCreatedAt
        }
      }
    });
  } catch (error) {
    logger.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get course enrollments (for instructors)
// @route   GET /api/students/course/:courseId
// @access  Private (Instructors/Admins)
router.get('/course/:courseId', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // Check if user owns the course or is admin
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view enrollments for this course'
      });
    }

    const { count, rows: enrollments } = await Enrollment.findAndCountAll({
      where: { courseId },
      include: [{
        model: User,
        as: 'student',
        attributes: ['id', 'firstName', 'lastName', 'email', 'avatar']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        enrollments: enrollments.map(enrollment => ({
          id: enrollment.id,
          student: enrollment.student,
          status: enrollment.status,
          progress: enrollment.progress,
          completedLectures: enrollment.completedLectures,
          totalLectures: enrollment.totalLectures,
          lastAccessedAt: enrollment.lastAccessedAt,
          completedAt: enrollment.completedAt,
          enrolledAt: enrollment.createdAt,
          rating: enrollment.rating,
          review: enrollment.review
        })),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get course enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;