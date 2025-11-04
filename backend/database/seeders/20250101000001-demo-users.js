'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    await queryInterface.bulkInsert('Users', [
      {
        id: uuidv4(),
        email: 'admin@dolesefx.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        email: 'instructor@dolesefx.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Instructor',
        role: 'instructor',
        bio: 'Experienced forex trader with 10+ years in the market',
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        email: 'student@dolesefx.com',
        password: hashedPassword,
        firstName: 'Jane',
        lastName: 'Student',
        role: 'student',
        isActive: true,
        isEmailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      email: {
        [Sequelize.Op.in]: ['admin@dolesefx.com', 'instructor@dolesefx.com', 'student@dolesefx.com']
      }
    }, {});
  }
};
