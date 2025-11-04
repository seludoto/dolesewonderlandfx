const User = require('./User');
const Course = require('./Course');
const Enrollment = require('./Enrollment');
const Payment = require('./Payment');

// Define associations
// User associations
User.hasMany(Course, {
  foreignKey: 'instructorId',
  as: 'courses'
});

User.hasMany(Enrollment, {
  foreignKey: 'studentId',
  as: 'enrollments'
});

User.hasMany(Payment, {
  foreignKey: 'userId',
  as: 'payments'
});

// Course associations
Course.belongsTo(User, {
  foreignKey: 'instructorId',
  as: 'instructor'
});

Course.hasMany(Enrollment, {
  foreignKey: 'courseId',
  as: 'enrollments'
});

Course.hasMany(Payment, {
  foreignKey: 'courseId',
  as: 'payments'
});

// Enrollment associations
Enrollment.belongsTo(User, {
  foreignKey: 'studentId',
  as: 'student'
});

Enrollment.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
});

// Payment associations
Payment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Payment.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
});

module.exports = {
  User,
  Course,
  Enrollment,
  Payment
};