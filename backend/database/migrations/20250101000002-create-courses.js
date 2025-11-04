'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Courses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      shortDescription: {
        type: Sequelize.STRING(300),
        allowNull: true
      },
      instructorId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      subcategory: {
        type: Sequelize.STRING,
        allowNull: true
      },
      level: {
        type: Sequelize.ENUM('beginner', 'intermediate', 'advanced'),
        defaultValue: 'beginner'
      },
      language: {
        type: Sequelize.STRING,
        defaultValue: 'English'
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      currency: {
        type: Sequelize.STRING(3),
        defaultValue: 'USD'
      },
      thumbnail: {
        type: Sequelize.STRING,
        allowNull: true
      },
      trailerVideo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('draft', 'published', 'archived'),
        defaultValue: 'draft'
      },
      isFree: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isFeatured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      totalDuration: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      totalLectures: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      totalStudents: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      averageRating: {
        type: Sequelize.DECIMAL(3, 2),
        defaultValue: 0.00
      },
      totalReviews: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      requirements: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      learningOutcomes: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      tags: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    await queryInterface.addIndex('Courses', ['instructorId']);
    await queryInterface.addIndex('Courses', ['slug'], { unique: true });
    await queryInterface.addIndex('Courses', ['status']);
    await queryInterface.addIndex('Courses', ['category']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Courses');
  }
};
