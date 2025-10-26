# Auth Service

Authentication and authorization service for the DoleSe Wonderland FX platform.

## Features

- User registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Token refresh functionality

## API Endpoints

### Authentication

#### POST `/api/v1/auth/login`

Login with username and password.

**Request:**

```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "eyJ0eXAi...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### POST `/api/v1/auth/register`

Register a new user account.

**Request:**

```json
{
  "username": "new_user",
  "email": "user@example.com",
  "password": "secure_password"
}
```

#### GET `/api/v1/auth/me`

Get current user information (requires authentication).

**Response:**

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "user"
}
```

#### POST `/api/v1/auth/refresh`

Refresh access token (requires authentication).

### Health Check

#### GET `/health`

Service health check.

## Configuration

Environment variables:

- `SECRET_KEY`: JWT secret key (default: "your-secret-key-here")

## Security Features

- Password hashing using bcrypt
- JWT tokens with expiration
- CORS protection
- Input validation

## Development

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Run the service:

```bash
python main.py
```

3. The service will be available at `http://localhost:8002`

## Docker

Build and run with Docker:

```bash
docker build -t dolesewonderlandfx/auth .
docker run -p 8002:8002 dolesewonderlandfx/auth
```

## Database

The service uses SQLite database shared with other services. The expected schema includes:

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Integration

This service integrates with:

- API Gateway for request routing
- Database service for user data
- Other microservices for authentication checks

## Testing

Run tests:

```bash
pytest
```

## Deployment

The service is containerized and can be deployed using:

- Docker Compose (development)
- Kubernetes (production)
- AWS ECS/Fargate (cloud)

## Security Considerations

- Use strong SECRET_KEY in production
- Implement rate limiting
- Add comprehensive logging
- Use HTTPS in production
- Regular security audits
