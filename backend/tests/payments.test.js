const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/config/database');
const stripe = require('stripe');

// Mock Stripe
jest.mock('stripe');

describe('Payments API', () => {
  let studentToken;
  let instructorToken;
  let courseId;

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

    // Mock Stripe methods
    stripe.mockReturnValue({
      paymentIntents: {
        create: jest.fn().mockResolvedValue({
          id: 'pi_test_123',
          client_secret: 'test_secret_123',
          amount: 9999,
          currency: 'usd',
          status: 'requires_payment_method'
        }),
        retrieve: jest.fn().mockResolvedValue({
          id: 'pi_test_123',
          status: 'succeeded'
        })
      },
      refunds: {
        create: jest.fn().mockResolvedValue({
          id: 'ref_test_123',
          status: 'succeeded'
        })
      }
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/payments/create-intent', () => {
    it('should create payment intent', async () => {
      const res = await request(app)
        .post('/api/payments/create-intent')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ courseId });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('clientSecret');
      expect(res.body.data.payment).toHaveProperty('status', 'pending');
    });

    it('should not create intent for already enrolled course', async () => {
      // Enroll first
      await request(app)
        .post('/api/students/enroll')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ courseId });

      const res = await request(app)
        .post('/api/payments/create-intent')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ courseId });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/payments', () => {
    it('should get user payments', async () => {
      const res = await request(app)
        .get('/api/payments')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.payments).toBeInstanceOf(Array);
    });
  });
});
