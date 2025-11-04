# API Documentation

## Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://api.dolesefx.com/api`

## Authentication

Most endpoints require authentication using JWT (JSON Web Token).

### Headers

```
Authorization: Bearer <your_jwt_token>
```

### Obtaining a Token

Register or login to receive a JWT token:

```bash
POST /api/auth/register
POST /api/auth/login
```

## Response Format

All API responses follow this structure:

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

## Rate Limiting

- **General endpoints**: 100 requests per 15 minutes per IP
- **Auth endpoints**: 5 requests per 15 minutes per IP

## Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
```

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "student"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "student"
    }
  }
}
```

#### Login

```http
POST /api/auth/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": 1,
      "email": "john@example.com",
      "role": "student"
    }
  }
}
```

#### Get Current User

```http
GET /api/auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "student",
      "avatar": "avatars/user-1.jpg"
    }
  }
}
```

---

### Courses

#### Get All Courses

```http
GET /api/courses
```

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| category | string | Filter by category |
| level | string | beginner, intermediate, advanced |
| minPrice | number | Minimum price |
| maxPrice | number | Maximum price |
| search | string | Search in title/description |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |

**Example:**

```http
GET /api/courses?category=Trading&level=beginner&page=1&limit=10
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": 1,
        "title": "Forex Trading Basics",
        "slug": "forex-trading-basics",
        "description": "Learn the fundamentals of forex trading",
        "category": "Trading",
        "level": "beginner",
        "price": 99.99,
        "currency": "USD",
        "status": "published",
        "thumbnailUrl": "https://bucket.s3.amazonaws.com/course-1-thumb.jpg",
        "averageRating": 4.7,
        "totalStudents": 250,
        "instructor": {
          "id": 5,
          "firstName": "Jane",
          "lastName": "Smith"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5
    }
  }
}
```

#### Get Course by ID

```http
GET /api/courses/:id
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "course": {
      "id": 1,
      "title": "Forex Trading Basics",
      "description": "Complete course description...",
      "category": "Trading",
      "level": "beginner",
      "price": 99.99,
      "currency": "USD",
      "status": "published",
      "thumbnailUrl": "https://...",
      "trailerUrl": "https://...",
      "instructor": {
        "id": 5,
        "firstName": "Jane",
        "lastName": "Smith",
        "bio": "Expert trader with 10 years experience"
      },
      "reviews": [
        {
          "id": 1,
          "rating": 5,
          "comment": "Excellent course!",
          "user": {
            "firstName": "John",
            "lastName": "Doe"
          }
        }
      ]
    }
  }
}
```

#### Create Course

```http
POST /api/courses
```

**Headers:** `Authorization: Bearer <token>` (Instructor/Admin only)

**Request Body:**

```json
{
  "title": "Advanced Trading Strategies",
  "description": "Master advanced forex trading techniques",
  "category": "Trading",
  "level": "advanced",
  "price": 199.99,
  "currency": "USD"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "course": {
      "id": 2,
      "title": "Advanced Trading Strategies",
      "slug": "advanced-trading-strategies",
      "status": "draft",
      "instructorId": 5
    }
  }
}
```

#### Update Course

```http
PUT /api/courses/:id
```

**Headers:** `Authorization: Bearer <token>` (Course owner only)

**Request Body:**

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "price": 149.99,
  "status": "published"
}
```

**Response:** `200 OK`

#### Delete Course

```http
DELETE /api/courses/:id
```

**Headers:** `Authorization: Bearer <token>` (Course owner/Admin only)

**Response:** `200 OK`

---

### Students

#### Enroll in Course

```http
POST /api/students/enroll
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "courseId": 1,
  "paymentId": 123
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "message": "Enrollment successful",
  "data": {
    "enrollment": {
      "id": 1,
      "userId": 10,
      "courseId": 1,
      "progressPercentage": 0,
      "completed": false,
      "enrolledAt": "2025-11-03T10:00:00.000Z"
    }
  }
}
```

#### Get User Enrollments

```http
GET /api/students/enrollments
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "id": 1,
        "progressPercentage": 65,
        "completed": false,
        "course": {
          "id": 1,
          "title": "Forex Trading Basics",
          "thumbnailUrl": "https://..."
        }
      }
    ]
  }
}
```

#### Update Course Progress

```http
POST /api/students/progress/:enrollmentId
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "progressPercentage": 75
}
```

**Response:** `200 OK`

#### Mark Course Complete

```http
POST /api/students/complete/:enrollmentId
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Course marked as completed",
  "data": {
    "enrollment": {
      "id": 1,
      "completed": true,
      "completedAt": "2025-11-03T15:00:00.000Z",
      "certificateUrl": "https://bucket.s3.amazonaws.com/cert-1.pdf"
    }
  }
}
```

#### Add Course Review

```http
POST /api/students/review
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "courseId": 1,
  "rating": 5,
  "comment": "Excellent course! Highly recommend."
}
```

**Response:** `201 Created`

---

### Payments

#### Create Payment Intent

```http
POST /api/payments/create-intent
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "courseId": 1
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_secret_abc123",
    "payment": {
      "id": 1,
      "amount": 99.99,
      "currency": "USD",
      "status": "pending"
    }
  }
}
```

#### Confirm Payment

```http
POST /api/payments/confirm/:paymentIntentId
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

#### Get User Payments

```http
GET /api/payments
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

#### Process Refund

```http
POST /api/payments/refund/:paymentId
```

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Request Body:**

```json
{
  "reason": "Customer request"
}
```

**Response:** `200 OK`

---

### Content Management

#### Upload Course Thumbnail

```http
POST /api/content/course/:courseId/thumbnail
```

**Headers:**

- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**

- `thumbnail`: Image file (JPEG, PNG, GIF, WebP)

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Thumbnail uploaded successfully",
  "data": {
    "url": "https://bucket.s3.amazonaws.com/course-1-thumb.jpg",
    "key": "courses/course-1/thumbnail-abc123.jpg"
  }
}
```

#### Upload Course Trailer

```http
POST /api/content/course/:courseId/trailer
```

**Form Data:**

- `trailer`: Video file (MP4, MPEG, MOV, AVI, WebM)

#### Upload Course Content

```http
POST /api/content/course/:courseId/content
```

**Form Data:**

- `content`: File (video, document, or image)

#### Upload Multiple Files

```http
POST /api/content/course/:courseId/content/bulk
```

**Form Data:**

- `content`: Multiple files (up to 10)

#### Upload User Avatar

```http
POST /api/content/avatar
```

**Headers:** `Authorization: Bearer <token>`

**Form Data:**

- `avatar`: Image file (max 5MB)

**Response:** `200 OK`

#### Delete File

```http
DELETE /api/content/:key
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

#### Get Presigned URL

```http
GET /api/content/presigned/:key
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**

- `expiresIn`: Number of seconds until expiration (default: 3600)

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "url": "https://bucket.s3.amazonaws.com/file.jpg?signature=..."
  }
}
```

---

### Analytics

#### Get Instructor Dashboard

```http
GET /api/analytics/dashboard
```

**Headers:** `Authorization: Bearer <token>` (Instructor only)

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "totalCourses": 5,
    "totalStudents": 250,
    "totalRevenue": 24997.50,
    "averageRating": 4.7,
    "recentEnrollments": [...]
  }
}
```

#### Get Course Analytics

```http
GET /api/analytics/course/:courseId
```

**Headers:** `Authorization: Bearer <token>` (Course owner only)

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "totalStudents": 50,
    "completionRate": 75,
    "averageRating": 4.8,
    "revenue": 4999.50,
    "enrollmentTrend": [...]
  }
}
```

#### Get Platform Analytics

```http
GET /api/analytics/platform
```

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Response:** `200 OK`

---

### Notifications

#### Send Custom Email

```http
POST /api/notifications/send
```

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Request Body:**

```json
{
  "email": "user@example.com",
  "subject": "Important Announcement",
  "message": "Email content here"
}
```

**Response:** `200 OK`

#### Send Bulk Emails

```http
POST /api/notifications/send-bulk
```

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Request Body:**

```json
{
  "emails": ["user1@example.com", "user2@example.com"],
  "subject": "Newsletter",
  "message": "Content"
}
```

**Response:** `200 OK`

#### Get Notification Preferences

```http
GET /api/notifications/preferences
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`

#### Update Notification Preferences

```http
PUT /api/notifications/preferences
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**

```json
{
  "emailNotifications": true,
  "marketingEmails": false,
  "courseUpdates": true
}
```

**Response:** `200 OK`

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## Postman Collection

Import our Postman collection for easy API testing:

[Download Postman Collection](./postman_collection.json)

## Support

For API support, contact: <support@dolesefx.com>
