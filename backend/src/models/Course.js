const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 200]
    }
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  shortDescription: {
    type: DataTypes.STRING(300),
    allowNull: true
  },
  instructorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subcategory: {
    type: DataTypes.STRING,
    allowNull: true
  },
  level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'beginner'
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'English'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  trailerVideo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft'
  },
  isFree: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  totalDuration: {
    type: DataTypes.INTEGER, // in minutes
    defaultValue: 0
  },
  totalLectures: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalStudents: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  averageRating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  prerequisites: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  learningObjectives: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  requirements: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  targetAudience: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  metaTitle: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  metaDescription: {
    type: DataTypes.STRING(160),
    allowNull: true
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  lastUpdated: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  indexes: [
    { fields: ['instructorId'] },
    { fields: ['status'] },
    { fields: ['category'] },
    { fields: ['isFeatured'] },
    { fields: ['slug'] },
    { fields: ['price'] }
  ]
});

// Hooks
Course.beforeCreate((course) => {
  if (!course.slug) {
    course.slug = course.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }
});

Course.beforeUpdate((course) => {
  if (course.changed('title') && !course.slug) {
    course.slug = course.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  }
});

// Instance methods
Course.prototype.getPublicData = function() {
  const data = this.toJSON();
  return {
    ...data,
    instructor: data.instructor ? {
      id: data.instructor.id,
      firstName: data.instructor.firstName,
      lastName: data.instructor.lastName,
      avatar: data.instructor.avatar,
      bio: data.instructor.bio
    } : null
  };
};

Course.prototype.updateStats = async function() {
  // This will be implemented when we have enrollment and review models
  // For now, just update the lastUpdated timestamp
  this.lastUpdated = new Date();
  await this.save();
};

module.exports = Course;