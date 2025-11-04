# DoleSe Wonderland FX Backend API

A comprehensive backend API for the DoleSe Wonderland FX trading education platform, built with Node.js, Express, and PostgreSQL.

## Features

- **User Management**: Registration, authentication, profile management
- **Course Management**: Full CRUD operations for courses with filtering and search
- **Student Enrollment**: Course enrollment, progress tracking, completion certificates
- **Payment Processing**: Stripe integration for course purchases, refunds, and webhooks
- **Analytics**: Comprehensive reporting for instructors and platform admins with revenue tracking
- **Security**: JWT authentication, role-based access control, input validation, rate limiting
- **Content Management**: AWS S3 integration for course videos, documents, thumbnails, and avatars
- **Email Notifications**: SendGrid integration with automated emails for enrollments, payments, and completions
- **File Upload**: Multer middleware with file type validation and size limits

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens) with bcrypt
- **Payments**: Stripe Payment Intents API
- **File Storage**: AWS S3 with presigned URLs
- **File Upload**: Multer with memory storage
- **Email**: SendGrid Mail API
- **Validation**: express-validator
- **Security**: Helmet, CORS, rate limiting
- **Logging**: Winston with file and console transports
- **Testing**: Jest, Supertest (configured)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   # Environment
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:3000

   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=instructor_portal
   DB_USER=postgres
   DB_PASSWORD=your_password

   # JWT
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30

   # Stripe
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...

   # SendGrid
   SENDGRID_API_KEY=SG....

   # AWS S3 (optional)
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=your_bucket
   ```

4. **Database Setup**
   ```bash
   # Create database
   createdb instructor_portal

   # Run migrations (if using migrations)
   npm run db:migrate

   # Seed database (optional)
   npm run db:seed
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

The API will be available at `http://localhost:5000`

## API Documentation

### Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Endpoints

#### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user
- `PUT /updatedetails` - Update user profile
- `PUT /updatepassword` - Change password
- `GET /logout` - Logout user

#### Users (`/api/users`) - Admin Only
- `GET /` - Get all users (paginated)
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user
- `GET /stats/overview` - User statistics

#### Courses (`/api/courses`)
- `GET /` - Get all published courses (with filtering)
- `GET /:id` - Get course details
- `POST /` - Create course (instructors)
- `PUT /:id` - Update course (instructor/admin)
- `DELETE /:id` - Delete course (instructor/admin)
- `GET /instructor/:id` - Get instructor's courses
- `GET /categories/list` - Get course categories

#### Students (`/api/students`)
- `POST /enroll` - Enroll in course
- `GET /courses` - Get enrolled courses
- `PUT /progress/:enrollmentId` - Update progress
- `PUT /complete/:enrollmentId` - Mark course complete
- `POST /review/:enrollmentId` - Add course review
- `GET /course/:courseId` - Get course enrollments (instructor)

#### Payments (`/api/payments`)
- `POST /create-intent` - Create payment intent
- `POST /confirm/:paymentIntentId` - Confirm payment
- `POST /refund/:paymentId` - Process refund (admin)
- `GET /` - Get user payments
- `GET /:id` - Get payment details
- `GET /course/:courseId` - Get course payments (instructor)

#### Analytics (`/api/analytics`)
- `GET /dashboard` - Instructor dashboard
- `GET /course/:courseId` - Course analytics
- `GET /platform` - Platform analytics (admin)

#### Content (`/api/content`)
- `POST /course/:courseId/thumbnail` - Upload course thumbnail
- `POST /course/:courseId/trailer` - Upload trailer video
- `POST /course/:courseId/content` - Upload course content
- `POST /course/:courseId/content/bulk` - Upload multiple files
- `POST /avatar` - Upload user avatar
- `DELETE /:key` - Delete file from S3
- `GET /presigned/:key` - Get presigned URL
- `POST /presigned-post` - Get presigned POST data

#### Notifications (`/api/notifications`)
- `POST /send` - Send custom email (admin)
- `POST /send-bulk` - Send bulk emails (admin)
- `POST /welcome/:userId` - Resend welcome email
- `POST /enrollment/:enrollmentId` - Send enrollment confirmation
- `POST /course-published/:courseId` - Send published notification
- `GET /preferences` - Get notification preferences
- `PUT /preferences` - Update notification preferences
- `POST /test` - Test email configuration (admin)

### Request/Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [...] // Validation errors
}
```

## Database Schema

### Users
- id (UUID, Primary Key)
- email (String, Unique)
- password (String, Hashed)
- firstName, lastName (String)
- role (ENUM: student, instructor, admin)
- avatar, bio, phone (String)
- isActive, isEmailVerified (Boolean)
- Timestamps and soft deletes

### Courses
- id (UUID, Primary Key)
- title, description, slug (String)
- instructorId (Foreign Key)
- category, level, language (String)
- price, averageRating (Decimal)
- thumbnail, trailerVideo (String)
- status (ENUM: draft, published, archived)
- Various metadata fields
- Timestamps

### Enrollments
- id (UUID, Primary Key)
- studentId, courseId (Foreign Keys)
- status (ENUM: enrolled, completed, dropped, refunded)
- progress (Decimal)
- rating, review (Integer/String)
- Timestamps

### Payments
- id (UUID, Primary Key)
- userId, courseId (Foreign Keys)
- stripePaymentIntentId (String)
- amount, currency (Decimal/String)
- status (ENUM: pending, completed, failed, refunded)
- type (ENUM: course_purchase, subscription, refund)
- Various payment metadata

## Development

### Available Scripts

```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage
npm run lint        # Run ESLint
npm run lint:fix    # Fix ESLint issues
npm run format      # Format code with Prettier
```

### Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/     # Route handlers
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Enrollment.js
│   │   ├── Payment.js
│   │   └── index.js
│   ├── routes/
│   │   ├── index.js
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── courses.js
│   │   ├── students.js
│   │   ├── payments.js
│   │   ├── analytics.js
│   │   └── ...
│   ├── services/        # Business logic
│   ├── utils/
│   │   └── logger.js
│   ├── validators/      # Input validation
│   └── app.js
├── tests/
├── .env.example
├── package.json
└── README.md
```

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- tests/auth.test.js
```

## Deployment

### Environment Variables

Ensure all environment variables are set in production:

- Set `NODE_ENV=production`
- Configure production database
- Set secure JWT secrets
- Configure Stripe live keys
- Set up SendGrid production API key

### Docker Support

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Security

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet security headers
- SQL injection prevention with Sequelize

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Ensure all tests pass
5. Submit a pull request

## License

ISC License

## Support

For support, please contact the development team or create an issue in the repository.