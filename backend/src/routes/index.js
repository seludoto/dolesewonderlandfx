const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const courseRoutes = require('./courses');
const studentRoutes = require('./students');
const analyticsRoutes = require('./analytics');
const paymentRoutes = require('./payments');
const contentRoutes = require('./content');
const notificationRoutes = require('./notifications');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/students', studentRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/payments', paymentRoutes);
router.use('/content', contentRoutes);
router.use('/notifications', notificationRoutes);

// API info route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Instructor Portal API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      courses: '/api/courses',
      students: '/api/students',
      analytics: '/api/analytics',
      payments: '/api/payments',
      content: '/api/content',
      notifications: '/api/notifications'
    }
  });
});

module.exports = router;