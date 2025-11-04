const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/config/database');
const { User, Course, Enrollment } = require('../src/models');

describe('Students API', () => {
  let instructorToken;
  let studentToken;
  let courseId;
  let enrollmentId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create instructor and course
    const instructorRes = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Instructor',
        lastName: 'User',
        email: 'instructor@example.com',
        password: 'password123',
        role: 'instructor'
      });
    instructorToken = instructorRes.body.token;

    const courseRes = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        title: 'Trading Course',
        description: 'Learn trading',
        category: 'Trading',
        level: 'beginner',
        price: 99.99,
        currency: 'USD',
        status: 'published'
      });
    courseId = courseRes.body.data.course.id;

    // Create student
    const studentRes = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Student',
        lastName: 'User',
        email: 'student@example.com',
        password: 'password123',
        role: 'student'
      });
    studentToken = studentRes.body.token;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/students/enroll', () => {
    it('should enroll student in course', async () => {
      const res = await request(app)
        .post('/api/students/enroll')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          courseId,
          paymentId: 'test_payment_123'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data.enrollment).toHaveProperty('courseId', courseId);
      enrollmentId = res.body.data.enrollment.id;
    });

    it('should not enroll twice in same course', async () => {
      const res = await request(app)
        .post('/api/students/enroll')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          courseId,
          paymentId: 'test_payment_456'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/students/enrollments', () => {
    it('should get student enrollments', async () => {
      const res = await request(app)
        .get('/api/students/enrollments')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.enrollments).toBeInstanceOf(Array);
      expect(res.body.data.enrollments).toHaveLength(1);
    });
  });

  describe('POST /api/students/progress/:enrollmentId', () => {
    it('should update course progress', async () => {
      const res = await request(app)
        .post(`/api/students/progress/${enrollmentId}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          progressPercentage: 50
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.enrollment).toHaveProperty('progressPercentage', 50);
    });

    it('should validate progress percentage', async () => {
      const res = await request(app)
        .post(`/api/students/progress/${enrollmentId}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          progressPercentage: 150
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/students/complete/:enrollmentId', () => {
    it('should mark course as completed', async () => {
      // Update to 100% first
      await request(app)
        .post(`/api/students/progress/${enrollmentId}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ progressPercentage: 100 });

      const res = await request(app)
        .post(`/api/students/complete/${enrollmentId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.enrollment).toHaveProperty('completed', true);
      expect(res.body.data.enrollment).toHaveProperty('completedAt');
    });
  });

  describe('POST /api/students/review', () => {
    it('should add course review', async () => {
      const res = await request(app)
        .post('/api/students/review')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          courseId,
          rating: 5,
          comment: 'Excellent course!'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.review).toHaveProperty('rating', 5);
    });

    it('should validate rating range', async () => {
      const res = await request(app)
        .post('/api/students/review')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          courseId,
          rating: 6,
          comment: 'Test'
        });

      expect(res.statusCode).toBe(400);
    });
  });
});
