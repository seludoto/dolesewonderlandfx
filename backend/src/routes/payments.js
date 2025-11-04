const express = require('express');
const { body, validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Payment, Course, User, Enrollment } = require('../models');
const { protect, authorize } = require('../middleware/auth');
const { sendPaymentConfirmation, sendRefundConfirmation } = require('../services/email');
const logger = require('../utils/logger');

const router = express.Router();

// @desc    Create payment intent for course purchase
// @route   POST /api/payments/create-intent
// @access  Private
router.post('/create-intent', [
  protect,
  body('courseId').isUUID().withMessage('Valid course ID is required'),
  body('paymentMethodId').notEmpty().withMessage('Payment method ID is required')
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

    const { courseId, paymentMethodId } = req.body;
    const userId = req.user.id;

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
      where: { studentId: userId, courseId }
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Check if course is free
    if (course.isFree || course.price === 0) {
      // Create enrollment directly for free courses
      await Enrollment.create({
        studentId: userId,
        courseId,
        totalLectures: course.totalLectures || 0
      });

      return res.status(200).json({
        success: true,
        message: 'Successfully enrolled in free course',
        data: {
          type: 'free',
          enrolled: true
        }
      });
    }

    // Calculate amount in cents
    const amount = Math.round(course.price * 100);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: course.currency.toLowerCase(),
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      customer: req.user.stripeCustomerId,
      metadata: {
        courseId,
        userId,
        courseTitle: course.title
      }
    });

    // Create payment record
    const payment = await Payment.create({
      userId,
      courseId,
      stripePaymentIntentId: paymentIntent.id,
      amount: course.price,
      currency: course.currency,
      status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending',
      paymentMethod: 'card',
      type: 'course_purchase',
      description: `Purchase of course: ${course.title}`
    });

    // If payment succeeded, create enrollment
    if (paymentIntent.status === 'succeeded') {
      await Enrollment.create({
        studentId: userId,
        courseId,
        totalLectures: course.totalLectures || 0
      });

      payment.processedAt = new Date();
      await payment.save();

      // Send payment confirmation email
      sendPaymentConfirmation(req.user, course, payment).catch(error => {
        logger.error('Failed to send payment confirmation:', error);
      });
    }

    logger.info(`Payment intent created for user ${req.user.email}: ${paymentIntent.id}`);

    res.status(200).json({
      success: true,
      data: {
        paymentIntent: {
          id: paymentIntent.id,
          client_secret: paymentIntent.client_secret,
          status: paymentIntent.status
        },
        payment: {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status
        }
      }
    });
  } catch (error) {
    logger.error('Create payment intent error:', error);

    // Handle Stripe errors
    if (error.type) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Confirm payment
// @route   POST /api/payments/confirm/:paymentIntentId
// @access  Private
router.post('/confirm/:paymentIntentId', protect, async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Find payment record
    const payment = await Payment.findOne({
      where: { stripePaymentIntentId: paymentIntentId, userId: req.user.id }
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Update payment status
    if (paymentIntent.status === 'succeeded' && payment.status !== 'completed') {
      payment.status = 'completed';
      payment.processedAt = new Date();

      // Create enrollment if not exists
      const existingEnrollment = await Enrollment.findOne({
        where: { studentId: req.user.id, courseId: payment.courseId }
      });

      if (!existingEnrollment) {
        await Enrollment.create({
          studentId: req.user.id,
          courseId: payment.courseId,
          totalLectures: 0 // Will be updated when course content is available
        });
      }

      await payment.save();

      logger.info(`Payment confirmed for user ${req.user.email}: ${paymentIntentId}`);
    }

    res.status(200).json({
      success: true,
      data: {
        payment: payment.getTransactionSummary(),
        status: paymentIntent.status
      }
    });
  } catch (error) {
    logger.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Process refund
// @route   POST /api/payments/refund/:paymentId
// @access  Private (Admins only for now)
router.post('/refund/:paymentId', [
  protect,
  authorize('admin'),
  body('amount').optional().isFloat({ min: 0 }).withMessage('Refund amount must be positive'),
  body('reason').notEmpty().withMessage('Refund reason is required')
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

    const { paymentId } = req.params;
    const { amount, reason } = req.body;

    const payment = await Payment.findByPk(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only refund completed payments'
      });
    }

    // Process refund via Stripe
    const refundAmount = amount ? Math.round(amount * 100) : undefined;

    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      amount: refundAmount,
      reason: 'requested_by_customer',
      metadata: {
        reason,
        refundedBy: req.user.id
      }
    });

    // Update payment record
    await payment.processRefund(amount || payment.amount, reason);

    // Send refund confirmation email
    const user = await User.findByPk(payment.userId);
    const course = await Course.findByPk(payment.courseId);
    if (user && course) {
      sendRefundConfirmation(user, course, payment).catch(error => {
        logger.error('Failed to send refund confirmation:', error);
      });
    }

    logger.info(`Refund processed for payment ${paymentId}: ${amount || payment.amount}`);

    res.status(200).json({
      success: true,
      data: {
        refund: {
          id: refund.id,
          amount: refund.amount / 100,
          status: refund.status
        },
        payment: payment.getTransactionSummary()
      }
    });
  } catch (error) {
    logger.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user payments
// @route   GET /api/payments
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;
    const offset = (page - 1) * limit;

    const where = { userId: req.user.id };
    if (status) where.status = status;
    if (type) where.type = type;

    const { count, rows: payments } = await Payment.findAndCountAll({
      where,
      include: [{
        model: Course,
        as: 'course',
        attributes: ['id', 'title', 'thumbnail']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: {
        payments: payments.map(payment => ({
          ...payment.getTransactionSummary(),
          course: payment.course,
          createdAt: payment.createdAt
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
    logger.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: [{
        model: Course,
        as: 'course',
        attributes: ['id', 'title', 'thumbnail', 'instructorId']
      }]
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        payment: {
          ...payment.getTransactionSummary(),
          course: payment.course,
          description: payment.description,
          createdAt: payment.createdAt,
          processedAt: payment.processedAt,
          refundedAt: payment.refundedAt,
          refundAmount: payment.refundAmount,
          refundReason: payment.refundReason
        }
      }
    });
  } catch (error) {
    logger.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get course payments (for instructors)
// @route   GET /api/payments/course/:courseId
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
        message: 'Not authorized to view payments for this course'
      });
    }

    const { count, rows: payments } = await Payment.findAndCountAll({
      where: { courseId, status: 'completed' },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['processedAt', 'DESC']]
    });

    // Calculate totals
    const totalRevenue = payments.reduce((sum, payment) => sum + parseFloat(payment.netAmount || payment.amount), 0);
    const totalFees = payments.reduce((sum, payment) => sum + parseFloat(payment.fees), 0);

    res.status(200).json({
      success: true,
      data: {
        payments: payments.map(payment => ({
          ...payment.getTransactionSummary(),
          user: payment.user,
          processedAt: payment.processedAt
        })),
        summary: {
          totalRevenue,
          totalFees,
          netRevenue: totalRevenue - totalFees,
          transactionCount: count
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    logger.error('Get course payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;