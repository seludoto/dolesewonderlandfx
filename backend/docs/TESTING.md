# Testing Guide

## Overview

This document provides comprehensive information about testing the DoleSe Wonderland FX Backend API.

## Test Structure

```
tests/
├── auth.test.js           # Authentication tests
├── courses.test.js        # Course management tests
├── students.test.js       # Student enrollment tests
├── payments.test.js       # Payment processing tests
├── s3.test.js            # S3 service tests
├── email.test.js         # Email service tests
├── middleware.test.js    # Middleware tests
└── integration.test.js   # End-to-end integration tests
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npm test -- auth.test.js
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

## Test Categories

### Unit Tests

Unit tests focus on individual functions and services in isolation using mocks.

**Examples:**
- `s3.test.js` - Tests S3 service methods with mocked AWS SDK
- `email.test.js` - Tests email service with mocked SendGrid
- `middleware.test.js` - Tests authentication middleware

**Running:**
```bash
npm test -- tests/s3.test.js tests/email.test.js
```

### Integration Tests

Integration tests verify complete workflows across multiple components.

**Example:**
- `integration.test.js` - Complete user journeys from registration to course completion

**Running:**
```bash
npm test -- tests/integration.test.js
```

### API Tests

API tests verify endpoint functionality with database interactions.

**Examples:**
- `auth.test.js` - Registration, login, authentication
- `courses.test.js` - Course CRUD operations
- `students.test.js` - Enrollment and progress tracking
- `payments.test.js` - Payment processing workflows

## Test Environment Setup

### Environment Variables

Create a `.env.test` file for test-specific configuration:

```env
NODE_ENV=test
PORT=5001

# Test Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dolesefx_test
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=test_secret_key_for_testing_only

# AWS S3 (Mock or Test Bucket)
AWS_ACCESS_KEY_ID=test_access_key
AWS_SECRET_ACCESS_KEY=test_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=test-bucket

# SendGrid (Mock)
SENDGRID_API_KEY=test_sendgrid_key
FROM_EMAIL=test@dolesefx.com
FROM_NAME=Test DoleSe FX

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_test_key
```

### Database Setup

Tests use a separate test database that is reset before each test run:

```javascript
beforeAll(async () => {
  await sequelize.sync({ force: true }); // Recreate tables
});

afterAll(async () => {
  await sequelize.close(); // Close connections
});
```

## Writing Tests

### Test Structure Template

```javascript
const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/config/database');

describe('Feature Name', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    // Setup test data
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/endpoint', () => {
    it('should perform expected action', async () => {
      const res = await request(app)
        .post('/api/endpoint')
        .send({ data: 'value' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
    });

    it('should handle validation errors', async () => {
      const res = await request(app)
        .post('/api/endpoint')
        .send({});

      expect(res.statusCode).toBe(400);
    });
  });
});
```

### Mocking External Services

#### Mock AWS S3

```javascript
jest.mock('aws-sdk', () => {
  const mockS3Instance = {
    upload: jest.fn().mockReturnThis(),
    promise: jest.fn().mockResolvedValue({ Location: 'test-url' })
  };
  return { S3: jest.fn(() => mockS3Instance) };
});
```

#### Mock SendGrid

```javascript
jest.mock('@sendgrid/mail');
const sgMail = require('@sendgrid/mail');

sgMail.send.mockResolvedValue([{ statusCode: 202 }]);
```

#### Mock Stripe

```javascript
jest.mock('stripe');
const stripe = require('stripe');

stripe.mockReturnValue({
  paymentIntents: {
    create: jest.fn().mockResolvedValue({
      id: 'pi_test',
      client_secret: 'secret'
    })
  }
});
```

## Test Coverage

### Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### View Coverage Report

After running `npm run test:coverage`, open `coverage/lcov-report/index.html` in your browser.

### Coverage by Component

| Component | Target Coverage |
|-----------|----------------|
| Controllers | 85% |
| Services | 90% |
| Middleware | 90% |
| Routes | 80% |
| Models | 75% |

## Common Test Patterns

### Authentication Pattern

```javascript
let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'test@example.com', password: 'password' });
  token = res.body.token;
});

it('should access protected route', async () => {
  const res = await request(app)
    .get('/api/protected')
    .set('Authorization', `Bearer ${token}`);
  
  expect(res.statusCode).toBe(200);
});
```

### Data Setup Pattern

```javascript
let userId, courseId;

beforeAll(async () => {
  const user = await User.create({ /* data */ });
  userId = user.id;
  
  const course = await Course.create({ /* data */ });
  courseId = course.id;
});
```

### Error Testing Pattern

```javascript
it('should handle errors gracefully', async () => {
  const res = await request(app)
    .post('/api/endpoint')
    .send({ invalid: 'data' });

  expect(res.statusCode).toBe(400);
  expect(res.body).toHaveProperty('success', false);
  expect(res.body).toHaveProperty('errors');
});
```

## Continuous Integration

Tests run automatically on:
- Pull requests
- Pushes to main branch
- Manual workflow triggers

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
```

## Debugging Tests

### Run Single Test

```bash
npm test -- -t "should register new user"
```

### Enable Verbose Output

```bash
npm test -- --verbose
```

### Debug with Node Inspector

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then open `chrome://inspect` in Chrome.

## Best Practices

1. **Isolate Tests**: Each test should be independent
2. **Clean State**: Reset database between test suites
3. **Mock External Services**: Don't make real API calls
4. **Descriptive Names**: Use clear, descriptive test names
5. **Test Edge Cases**: Include error scenarios
6. **Fast Execution**: Keep tests fast (<5 seconds per suite)
7. **Consistent Data**: Use factories or fixtures for test data

## Troubleshooting

### Database Connection Issues

```bash
# Ensure PostgreSQL is running
pg_isready

# Create test database
createdb dolesefx_test
```

### Port Conflicts

If port 5001 is in use, change PORT in `.env.test`

### Timeout Issues

Increase Jest timeout in `jest.config.js`:

```javascript
module.exports = {
  testTimeout: 30000 // 30 seconds
};
```

### Mock Not Working

Ensure mocks are declared before imports:

```javascript
jest.mock('module-name');
const module = require('module-name');
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://testingjavascript.com/)
