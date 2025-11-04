const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/config/database');
const { User, Course } = require('../src/models');

describe('Courses API', () => {
  let instructorToken;
  let studentToken;
  let courseId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });

    // Create instructor
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

  describe('POST /api/courses', () => {
    it('should create a new course as instructor', async () => {
      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          title: 'Test Trading Course',
          description: 'Learn trading basics',
          category: 'Trading',
          level: 'beginner',
          price: 99.99,
          currency: 'USD'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data.course).toHaveProperty('title', 'Test Trading Course');
      courseId = res.body.data.course.id;
    });

    it('should not create course as student', async () => {
      const res = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Another Course',
          description: 'Test description',
          category: 'Trading',
          price: 50
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/courses', () => {
    it('should get all courses', async () => {
      // First publish the course
      await request(app)
        .put(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({ status: 'published' });

      const res = await request(app)
        .get('/api/courses');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data.courses).toBeInstanceOf(Array);
    });

    it('should filter courses by category', async () => {
      const res = await request(app)
        .get('/api/courses?category=Trading');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.courses.every(c => c.category === 'Trading')).toBe(true);
    });
  });

  describe('GET /api/courses/:id', () => {
    it('should get course by id', async () => {
      const res = await request(app)
        .get(`/api/courses/${courseId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data.course).toHaveProperty('id', courseId);
    });
  });

  describe('PUT /api/courses/:id', () => {
    it('should update course as owner', async () => {
      const res = await request(app)
        .put(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          title: 'Updated Trading Course',
          description: 'Updated description',
          category: 'Trading',
          price: 149.99
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.course).toHaveProperty('title', 'Updated Trading Course');
    });

    it('should not update course as non-owner', async () => {
      const res = await request(app)
        .put(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ title: 'Hacked Title' });

      expect(res.statusCode).toBe(403);
    });
  });
});
