const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/config/database');

describe('Integration Tests - Complete User Journey', () => {
  let studentToken;
  let instructorToken;
  let courseId;
  let enrollmentId;

  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Complete User Flow', () => {
    it('should complete instructor journey: register -> create course -> publish', async () => {
      // 1. Register instructor
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Instructor',
          lastName: 'Smith',
          email: 'instructor@test.com',
          password: 'password123',
          role: 'instructor'
        });

      expect(registerRes.statusCode).toBe(201);
      instructorToken = registerRes.body.token;

      // 2. Create course
      const createCourseRes = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({
          title: 'Forex Trading Masterclass',
          description: 'Complete forex trading course',
          category: 'Trading',
          level: 'intermediate',
          price: 199.99,
          currency: 'USD'
        });

      expect(createCourseRes.statusCode).toBe(201);
      courseId = createCourseRes.body.data.course.id;

      // 3. Publish course
      const publishRes = await request(app)
        .put(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({ status: 'published' });

      expect(publishRes.statusCode).toBe(200);
      expect(publishRes.body.data.course.status).toBe('published');
    });

    it('should complete student journey: register -> browse -> enroll -> progress -> complete -> review', async () => {
      // 1. Register student
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({
          firstName: 'Student',
          lastName: 'Jones',
          email: 'student@test.com',
          password: 'password123',
          role: 'student'
        });

      expect(registerRes.statusCode).toBe(201);
      studentToken = registerRes.body.token;

      // 2. Browse courses
      const browseCourses = await request(app)
        .get('/api/courses')
        .query({ category: 'Trading', level: 'intermediate' });

      expect(browseCourses.statusCode).toBe(200);
      expect(browseCourses.body.data.courses.length).toBeGreaterThan(0);

      // 3. Get specific course details
      const courseDetails = await request(app)
        .get(`/api/courses/${courseId}`);

      expect(courseDetails.statusCode).toBe(200);
      expect(courseDetails.body.data.course.title).toBe('Forex Trading Masterclass');

      // 4. Enroll in course
      const enrollRes = await request(app)
        .post('/api/students/enroll')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          courseId,
          paymentId: 'test_payment_integration'
        });

      expect(enrollRes.statusCode).toBe(201);
      enrollmentId = enrollRes.body.data.enrollment.id;

      // 5. Update progress
      const progressRes = await request(app)
        .post(`/api/students/progress/${enrollmentId}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ progressPercentage: 75 });

      expect(progressRes.statusCode).toBe(200);
      expect(progressRes.body.data.enrollment.progressPercentage).toBe(75);

      // 6. Complete course
      await request(app)
        .post(`/api/students/progress/${enrollmentId}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ progressPercentage: 100 });

      const completeRes = await request(app)
        .post(`/api/students/complete/${enrollmentId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(completeRes.statusCode).toBe(200);
      expect(completeRes.body.data.enrollment.completed).toBe(true);

      // 7. Add review
      const reviewRes = await request(app)
        .post('/api/students/review')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          courseId,
          rating: 5,
          comment: 'Amazing course! Learned so much about forex trading.'
        });

      expect(reviewRes.statusCode).toBe(201);
      expect(reviewRes.body.data.review.rating).toBe(5);

      // 8. Check instructor dashboard
      const dashboardRes = await request(app)
        .get('/api/analytics/dashboard')
        .set('Authorization', `Bearer ${instructorToken}`);

      expect(dashboardRes.statusCode).toBe(200);
      expect(dashboardRes.body.data.totalRevenue).toBeGreaterThan(0);
    });

    it('should verify course analytics after enrollment', async () => {
      const analyticsRes = await request(app)
        .get(`/api/analytics/course/${courseId}`)
        .set('Authorization', `Bearer ${instructorToken}`);

      expect(analyticsRes.statusCode).toBe(200);
      expect(analyticsRes.body.data.totalStudents).toBe(1);
      expect(analyticsRes.body.data.completionRate).toBe(100);
      expect(analyticsRes.body.data.averageRating).toBe(5);
    });
  });

  describe('Error Handling', () => {
    it('should handle duplicate enrollments', async () => {
      const res = await request(app)
        .post('/api/students/enroll')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ courseId, paymentId: 'test' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should prevent unauthorized course updates', async () => {
      const res = await request(app)
        .put(`/api/courses/${courseId}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ title: 'Hacked Title' });

      expect(res.statusCode).toBe(403);
    });

    it('should handle non-existent resources', async () => {
      const res = await request(app)
        .get('/api/courses/99999');

      expect(res.statusCode).toBe(404);
    });
  });
});
