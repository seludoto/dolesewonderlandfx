const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Courses',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('enrolled', 'completed', 'dropped', 'refunded'),
    defaultValue: 'enrolled'
  },
  progress: {
    type: DataTypes.DECIMAL(5, 2), // percentage 0.00 to 100.00
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 100
    }
  },
  completedLectures: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalLectures: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastAccessedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  certificateUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  reviewCreatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  indexes: [
    { fields: ['studentId'] },
    { fields: ['courseId'] },
    { fields: ['status'] },
    { fields: ['studentId', 'courseId'], unique: true } // Prevent duplicate enrollments
  ]
});

// Hooks
Enrollment.afterCreate(async (enrollment) => {
  // Update course stats
  const course = await enrollment.getCourse();
  if (course) {
    course.totalStudents += 1;
    await course.save();
  }
});

Enrollment.afterUpdate(async (enrollment) => {
  // Update course stats when enrollment status changes
  const course = await enrollment.getCourse();
  if (course && enrollment.changed('status')) {
    if (enrollment.status === 'completed') {
      enrollment.completedAt = new Date();
    }
    await course.updateStats();
  }
});

Enrollment.afterDestroy(async (enrollment) => {
  // Update course stats when enrollment is removed
  const course = await enrollment.getCourse();
  if (course && course.totalStudents > 0) {
    course.totalStudents -= 1;
    await course.save();
  }
});

// Instance methods
Enrollment.prototype.markAsCompleted = async function() {
  this.status = 'completed';
  this.progress = 100.00;
  this.completedAt = new Date();
  await this.save();
};

Enrollment.prototype.updateProgress = async function(newProgress, completedLectures = null) {
  this.progress = Math.min(100, Math.max(0, newProgress));
  if (completedLectures !== null) {
    this.completedLectures = completedLectures;
  }
  this.lastAccessedAt = new Date();

  // Auto-complete if progress reaches 100%
  if (this.progress >= 100 && this.status === 'enrolled') {
    await this.markAsCompleted();
  } else {
    await this.save();
  }
};

Enrollment.prototype.addReview = async function(rating, review) {
  this.rating = rating;
  this.review = review;
  this.reviewCreatedAt = new Date();
  await this.save();

  // Update course average rating
  const course = await this.getCourse();
  if (course) {
    await course.updateStats();
  }
};

module.exports = Enrollment;