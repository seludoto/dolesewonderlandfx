const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  sendEmail,
  sendWelcomeEmail,
  sendEnrollmentConfirmation,
  sendCourseCompletionEmail,
  sendPaymentConfirmation,
  sendNewEnrollmentNotification,
  sendCoursePublishedNotification
} = require('../services/email');
const { User, Course } = require('../models');
const logger = require('../utils/logger');

const router = express.Router();

// @desc    Send custom email (Admin only)
// @route   POST /api/notifications/send
// @access  Private (Admin)
router.post('/send', [
  protect,
  authorize('admin'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required')
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

    const { email, subject, message, html } = req.body;

    await sendEmail({ email, subject, message, html });

    logger.info(`Custom email sent to: ${email} by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Email sent successfully'
    });
  } catch (error) {
    logger.error('Send email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email'
    });
  }
});

// @desc    Send bulk emails (Admin only)
// @route   POST /api/notifications/send-bulk
// @access  Private (Admin)
router.post('/send-bulk', [
  protect,
  authorize('admin'),
  body('recipients').isArray({ min: 1 }).withMessage('At least one recipient is required'),
  body('recipients.*.email').isEmail().withMessage('Valid email is required for all recipients'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required')
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

    const { recipients, subject, message, html } = req.body;

    const sendPromises = recipients.map(recipient =>
      sendEmail({
        email: recipient.email,
        subject,
        message,
        html
      }).catch(error => {
        logger.error(`Failed to send to ${recipient.email}:`, error);
        return { email: recipient.email, error: error.message };
      })
    );

    const results = await Promise.all(sendPromises);
    const failed = results.filter(r => r && r.error);

    logger.info(`Bulk email sent to ${recipients.length} recipients by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: `Emails sent to ${recipients.length - failed.length} recipients`,
      data: {
        total: recipients.length,
        succeeded: recipients.length - failed.length,
        failed: failed.length,
        failures: failed
      }
    });
  } catch (error) {
    logger.error('Send bulk email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send bulk emails'
    });
  }
});

// @desc    Resend welcome email
// @route   POST /api/notifications/welcome/:userId
// @access  Private (Admin)
router.post('/welcome/:userId', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await sendWelcomeEmail(user);

    logger.info(`Welcome email resent to: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Welcome email sent successfully'
    });
  } catch (error) {
    logger.error('Send welcome email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send welcome email'
    });
  }
});

// @desc    Send enrollment confirmation
// @route   POST /api/notifications/enrollment/:enrollmentId
// @access  Private (Admin)
router.post('/enrollment/:enrollmentId', protect, authorize('admin'), async (req, res) => {
  try {
    const { Enrollment } = require('../models');
    const enrollment = await Enrollment.findByPk(req.params.enrollmentId, {
      include: [
        { model: User, as: 'student' },
        { model: Course, as: 'course' }
      ]
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    await sendEnrollmentConfirmation(enrollment.student, enrollment.course);

    logger.info(`Enrollment confirmation sent for enrollment: ${enrollment.id}`);

    res.status(200).json({
      success: true,
      message: 'Enrollment confirmation sent successfully'
    });
  } catch (error) {
    logger.error('Send enrollment confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send enrollment confirmation'
    });
  }
});

// @desc    Send course published notification
// @route   POST /api/notifications/course-published/:courseId
// @access  Private (Instructor/Admin)
router.post('/course-published/:courseId', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.courseId, {
      include: [{ model: User, as: 'instructor' }]
    });

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
        message: 'Not authorized'
      });
    }

    await sendCoursePublishedNotification(course.instructor, course);

    logger.info(`Course published notification sent for: ${course.id}`);

    res.status(200).json({
      success: true,
      message: 'Course published notification sent successfully'
    });
  } catch (error) {
    logger.error('Send course published notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification'
    });
  }
});

// @desc    Get notification preferences
// @route   GET /api/notifications/preferences
// @access  Private
router.get('/preferences', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    const preferences = user.preferences?.notifications || {
      email: true,
      enrollments: true,
      courseUpdates: true,
      payments: true,
      marketing: false
    };

    res.status(200).json({
      success: true,
      data: { preferences }
    });
  } catch (error) {
    logger.error('Get notification preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update notification preferences
// @route   PUT /api/notifications/preferences
// @access  Private
router.put('/preferences', [
  protect,
  body('preferences').isObject().withMessage('Preferences must be an object')
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

    const user = await User.findByPk(req.user.id);

    const currentPreferences = user.preferences || {};
    user.preferences = {
      ...currentPreferences,
      notifications: {
        ...currentPreferences.notifications,
        ...req.body.preferences
      }
    };

    await user.save();

    logger.info(`Notification preferences updated for user: ${user.id}`);

    res.status(200).json({
      success: true,
      data: {
        preferences: user.preferences.notifications
      }
    });
  } catch (error) {
    logger.error('Update notification preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Test email configuration (Admin only)
// @route   POST /api/notifications/test
// @access  Private (Admin)
router.post('/test', [
  protect,
  authorize('admin'),
  body('email').isEmail().withMessage('Valid email is required')
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

    const { email } = req.body;

    await sendEmail({
      email,
      subject: 'Test Email from DoleSe Wonderland FX',
      message: 'This is a test email to verify your email configuration is working correctly.',
      html: '<div style="font-family: Arial, sans-serif;"><h2>Test Email</h2><p>This is a test email to verify your email configuration is working correctly.</p></div>'
    });

    logger.info(`Test email sent to: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Test email sent successfully'
    });
  } catch (error) {
    logger.error('Send test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message
    });
  }
});

module.exports = router;