const express = require('express');
const { Op } = require('sequelize');
const { Course, Enrollment, Payment, User } = require('../models');
const { protect, authorize } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// @desc    Get dashboard analytics (for instructors)
// @route   GET /api/analytics/dashboard
// @access  Private (Instructors/Admins)
router.get('/dashboard', protect, authorize('instructor', 'admin'), async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Base where clause for user's courses
    const courseWhere = isAdmin ? {} : { instructorId: userId };

    // Get course statistics
    const courses = await Course.findAll({
      where: courseWhere,
      attributes: [
        'id',
        'title',
        'totalStudents',
        'averageRating',
        'totalReviews',
        'price',
        'status'
      ]
    });

    // Get enrollment statistics
    const enrollments = await Enrollment.findAll({
      include: [{
        model: Course,
        as: 'course',
        where: courseWhere,
        attributes: []
      }],
      attributes: [
        'status',
        [Enrollment.sequelize.fn('COUNT', Enrollment.sequelize.col('Enrollment.id')), 'count']
      ],
      group: ['status']
    });

    // Get payment statistics
    const payments = await Payment.findAll({
      include: [{
        model: Course,
        as: 'course',
        where: courseWhere,
        attributes: []
      }],
      where: { status: 'completed' },
      attributes: [
        [Payment.sequelize.fn('SUM', Payment.sequelize.col('amount')), 'totalRevenue'],
        [Payment.sequelize.fn('SUM', Payment.sequelize.col('fees')), 'totalFees'],
        [Payment.sequelize.fn('COUNT', Payment.sequelize.col('Payment.id')), 'transactionCount']
      ]
    });

    // Calculate metrics
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(c => c.status === 'published').length;
    const totalStudents = courses.reduce((sum, course) => sum + course.totalStudents, 0);
    const totalRevenue = payments[0]?.dataValues?.totalRevenue || 0;
    const totalFees = payments[0]?.dataValues?.totalFees || 0;
    const transactionCount = payments[0]?.dataValues?.transactionCount || 0;

    // Enrollment status breakdown
    const enrollmentStats = {};
    enrollments.forEach(stat => {
      enrollmentStats[stat.status] = parseInt(stat.dataValues.count);
    });

    // Recent enrollments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentEnrollments = await Enrollment.count({
      include: [{
        model: Course,
        as: 'course',
        where: courseWhere,
        attributes: []
      }],
      where: {
        createdAt: { [Op.gte]: thirtyDaysAgo }
      }
    });

    // Top performing courses
    const topCourses = courses
      .filter(c => c.status === 'published')
      .sort((a, b) => b.totalStudents - a.totalStudents)
      .slice(0, 5)
      .map(course => ({
        id: course.id,
        title: course.title,
        students: course.totalStudents,
        rating: course.averageRating,
        revenue: course.totalStudents * course.price
      }));

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalCourses,
          publishedCourses,
          totalStudents,
          totalRevenue: parseFloat(totalRevenue),
          netRevenue: parseFloat(totalRevenue) - parseFloat(totalFees),
          transactionCount: parseInt(transactionCount)
        },
        enrollments: {
          total: enrollmentStats.enrolled || 0,
          completed: enrollmentStats.completed || 0,
          inProgress: (enrollmentStats.enrolled || 0) - (enrollmentStats.completed || 0),
          recent: recentEnrollments
        },
        topCourses,
        period: 'all-time'
      }
    });
  } catch (error) {
    logger.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get course-specific analytics
// @route   GET /api/analytics/course/:courseId
// @access  Private (Course Instructor/Admin)
router.get('/course/:courseId', protect, async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findByPk(courseId, {
      include: [{
        model: User,
        as: 'instructor',
        attributes: ['id', 'firstName', 'lastName']
      }]
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
        message: 'Not authorized to view analytics for this course'
      });
    }

    // Get enrollment statistics
    const enrollments = await Enrollment.findAll({
      where: { courseId },
      attributes: [
        'status',
        'progress',
        'rating',
        [Enrollment.sequelize.fn('COUNT', Enrollment.sequelize.col('Enrollment.id')), 'count']
      ],
      group: ['status']
    });

    // Get enrollment trends (last 12 months)
    const enrollmentTrends = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const count = await Enrollment.count({
        where: {
          courseId,
          createdAt: { [Op.between]: [startOfMonth, endOfMonth] }
        }
      });

      enrollmentTrends.push({
        month: startOfMonth.toISOString().slice(0, 7),
        enrollments: count
      });
    }

    // Get payment statistics
    const payments = await Payment.findAll({
      where: { courseId, status: 'completed' },
      attributes: [
        [Payment.sequelize.fn('SUM', Payment.sequelize.col('amount')), 'totalRevenue'],
        [Payment.sequelize.fn('SUM', Payment.sequelize.col('fees')), 'totalFees'],
        [Payment.sequelize.fn('COUNT', Payment.sequelize.col('Payment.id')), 'transactionCount']
      ]
    });

    // Get average rating and completion rate
    const enrollmentData = await Enrollment.findAll({
      where: { courseId },
      attributes: ['status', 'rating', 'progress']
    });

    const ratings = enrollmentData.filter(e => e.rating).map(e => e.rating);
    const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

    const completedEnrollments = enrollmentData.filter(e => e.status === 'completed').length;
    const completionRate = enrollmentData.length > 0 ? (completedEnrollments / enrollmentData.length) * 100 : 0;

    // Enrollment status breakdown
    const statusBreakdown = {};
    enrollments.forEach(stat => {
      statusBreakdown[stat.status] = parseInt(stat.dataValues.count);
    });

    res.status(200).json({
      success: true,
      data: {
        course: {
          id: course.id,
          title: course.title,
          instructor: course.instructor,
          totalStudents: course.totalStudents,
          averageRating: course.averageRating,
          totalReviews: course.totalReviews
        },
        metrics: {
          totalRevenue: parseFloat(payments[0]?.dataValues?.totalRevenue || 0),
          totalFees: parseFloat(payments[0]?.dataValues?.totalFees || 0),
          transactionCount: parseInt(payments[0]?.dataValues?.transactionCount || 0),
          averageRating,
          completionRate,
          enrollmentTrends
        },
        enrollmentStatus: statusBreakdown
      }
    });
  } catch (error) {
    logger.error('Get course analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get platform analytics (Admin only)
// @route   GET /api/analytics/platform
// @access  Private (Admins)
router.get('/platform', protect, authorize('admin'), async (req, res) => {
  try {
    // Overall platform statistics
    const totalUsers = await User.count();
    const totalCourses = await Course.count({ where: { status: 'published' } });
    const totalEnrollments = await Enrollment.count();
    const totalRevenue = await Payment.sum('amount', { where: { status: 'completed' } }) || 0;
    const totalFees = await Payment.sum('fees', { where: { status: 'completed' } }) || 0;

    // User growth (last 12 months)
    const userGrowth = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const count = await User.count({
        where: {
          createdAt: { [Op.between]: [startOfMonth, endOfMonth] }
        }
      });

      userGrowth.push({
        month: startOfMonth.toISOString().slice(0, 7),
        users: count
      });
    }

    // Revenue growth (last 12 months)
    const revenueGrowth = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const revenue = await Payment.sum('amount', {
        where: {
          status: 'completed',
          createdAt: { [Op.between]: [startOfMonth, endOfMonth] }
        }
      }) || 0;

      revenueGrowth.push({
        month: startOfMonth.toISOString().slice(0, 7),
        revenue: parseFloat(revenue)
      });
    }

    // Top courses by enrollment
    const topCourses = await Course.findAll({
      where: { status: 'published' },
      attributes: ['id', 'title', 'totalStudents', 'averageRating'],
      order: [['totalStudents', 'DESC']],
      limit: 10,
      include: [{
        model: User,
        as: 'instructor',
        attributes: ['firstName', 'lastName']
      }]
    });

    // User role distribution
    const userRoles = await User.findAll({
      attributes: [
        'role',
        [User.sequelize.fn('COUNT', User.sequelize.col('role')), 'count']
      ],
      group: ['role']
    });

    const roleDistribution = {};
    userRoles.forEach(role => {
      roleDistribution[role.role] = parseInt(role.dataValues.count);
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalCourses,
          totalEnrollments,
          totalRevenue: parseFloat(totalRevenue),
          netRevenue: parseFloat(totalRevenue) - parseFloat(totalFees)
        },
        growth: {
          userGrowth,
          revenueGrowth
        },
        topCourses: topCourses.map(course => ({
          id: course.id,
          title: course.title,
          instructor: `${course.instructor.firstName} ${course.instructor.lastName}`,
          students: course.totalStudents,
          rating: course.averageRating
        })),
        userDistribution: roleDistribution
      }
    });
  } catch (error) {
    logger.error('Get platform analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;