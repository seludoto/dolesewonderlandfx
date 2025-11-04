const express = require('express');
const { body, validationResult, query } = require('express-validator');
const { Op } = require('sequelize');
const { Course, User, Enrollment } = require('../models');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { sendCoursePublishedNotification } = require('../services/email');
const logger = require('../utils/logger');

const router = express.Router();

// Validation rules
const courseValidation = [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title must be less than 200 characters'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('level').optional().isIn(['beginner', 'intermediate', 'advanced']).withMessage('Invalid level')
];

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
router.get('/', optionalAuth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isString(),
  query('level').optional().isIn(['beginner', 'intermediate', 'advanced']),
  query('price_min').optional().isFloat({ min: 0 }),
  query('price_max').optional().isFloat({ min: 0 }),
  query('search').optional().isString(),
  query('instructor').optional().isUUID(),
  query('sort').optional().isIn(['title', 'price', 'rating', 'students', 'createdAt']),
  query('order').optional().isIn(['asc', 'desc'])
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

    const {
      page = 1,
      limit = 12,
      category,
      level,
      price_min,
      price_max,
      search,
      instructor,
      sort = 'createdAt',
      order = 'desc'
    } = req.query;

    const offset = (page - 1) * limit;

    // Build where clause
    const where = { status: 'published' };

    if (category) where.category = category;
    if (level) where.level = level;
    if (instructor) where.instructorId = instructor;

    if (price_min !== undefined || price_max !== undefined) {
      where.price = {};
      if (price_min !== undefined) where.price[Op.gte] = price_min;
      if (price_max !== undefined) where.price[Op.lte] = price_max;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { tags: { [Op.contains]: [search] } }
      ];
    }

    // Build order clause
    const orderClause = [[sort, order.toUpperCase()]];

    const { count, rows: courses } = await Course.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'instructor',
        attributes: ['id', 'firstName', 'lastName', 'avatar', 'bio']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: orderClause
    });

    // Add enrollment status for authenticated users
    if (req.user) {
      for (const course of courses) {
        const enrollment = await Enrollment.findOne({
          where: {
            studentId: req.user.id,
            courseId: course.id
          }
        });
        course.dataValues.isEnrolled = !!enrollment;
        course.dataValues.enrollmentStatus = enrollment?.status || null;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        courses: courses.map(course => course.getPublicData()),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'instructor',
        attributes: ['id', 'firstName', 'lastName', 'avatar', 'bio']
      }]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user can view this course
    if (course.status !== 'published' && (!req.user || req.user.id !== course.instructorId) && req.user?.role !== 'admin') {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Add enrollment status for authenticated users
    if (req.user) {
      const enrollment = await Enrollment.findOne({
        where: {
          studentId: req.user.id,
          courseId: course.id
        }
      });
      course.dataValues.isEnrolled = !!enrollment;
      course.dataValues.enrollmentStatus = enrollment?.status || null;
    }

    res.status(200).json({
      success: true,
      data: {
        course: course.getPublicData()
      }
    });
  } catch (error) {
    logger.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create course
// @route   POST /api/courses
// @access  Private (Instructor/Admin)
router.post('/', protect, authorize('instructor', 'admin'), courseValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const courseData = {
      ...req.body,
      instructorId: req.user.id,
      status: req.body.status || 'draft'
    };

    const course = await Course.create(courseData);

    logger.info(`Course created: ${course.title} by ${req.user.email}`);

    res.status(201).json({
      success: true,
      data: {
        course: course.getPublicData()
      }
    });
  } catch (error) {
    logger.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Course Instructor/Admin)
router.put('/:id', protect, courseValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    const updatedCourse = await course.update(req.body);

    // Update published timestamp if status changed to published
    if (req.body.status === 'published' && course.status !== 'published') {
      updatedCourse.publishedAt = new Date();
      await updatedCourse.save();

      // Send course published notification to instructor
      const instructor = await User.findByPk(updatedCourse.instructorId);
      if (instructor) {
        sendCoursePublishedNotification(instructor, updatedCourse).catch(error => {
          logger.error('Failed to send course published notification:', error);
        });
      }
    }

    logger.info(`Course updated: ${course.title} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      data: {
        course: updatedCourse.getPublicData()
      }
    });
  } catch (error) {
    logger.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Course Instructor/Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    await course.destroy();

    logger.info(`Course deleted: ${course.title} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    logger.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get instructor's courses
// @route   GET /api/courses/instructor/:instructorId
// @access  Public
router.get('/instructor/:instructorId', optionalAuth, async (req, res) => {
  try {
    const { instructorId } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const offset = (page - 1) * limit;

    const where = { instructorId };

    // Only show published courses unless it's the instructor themselves or admin
    if (!req.user || (req.user.id !== instructorId && req.user.role !== 'admin')) {
      where.status = 'published';
    }

    const { count, rows: courses } = await Course.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'instructor',
        attributes: ['id', 'firstName', 'lastName', 'avatar', 'bio']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        courses: courses.map(course => course.getPublicData()),
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get instructor courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get course categories
// @route   GET /api/courses/categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Course.findAll({
      attributes: [
        'category',
        [Course.sequelize.fn('COUNT', Course.sequelize.col('category')), 'count']
      ],
      where: { status: 'published' },
      group: ['category'],
      order: [[Course.sequelize.fn('COUNT', Course.sequelize.col('category')), 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        categories: categories.map(cat => ({
          name: cat.category,
          count: parseInt(cat.dataValues.count)
        }))
      }
    });
  } catch (error) {
    logger.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;