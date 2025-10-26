# Admin Panel - DoleSe Wonderland FX

A comprehensive admin panel for managing the DoleSe Wonderland FX trading platform.

## Features

- **Dashboard**: System overview with key metrics and service status
- **User Management**: View, edit, and delete user accounts
- **Analytics**: Platform performance and usage statistics
- **Settings**: Configure platform settings and preferences
- **Role-based Access**: Admin-only access with JWT authentication

## Getting Started

### Prerequisites

- Node.js 14+
- Running backend services (API Gateway, Auth Service)

### Installation

1. Navigate to the admin panel directory:
   ```bash
   cd apps/admin-panel
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

### Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

## API Endpoints

The admin panel communicates with the following backend services:

- **Auth Service** (Port 8002):
  - `POST /api/v1/auth/login` - Admin authentication
  - `GET /api/v1/auth/users` - Get all users
  - `PUT /api/v1/auth/users/{id}` - Update user
  - `DELETE /api/v1/auth/users/{id}` - Delete user

- **API Gateway** (Port 8000):
  - `GET /health` - Service health check

## Project Structure

```
apps/admin-panel/
├── components/
│   └── AdminLayout.js          # Main admin layout with navigation
├── pages/
│   ├── _app.js                 # Next.js app wrapper
│   ├── index.js                # Admin login page
│   ├── dashboard.js            # Main dashboard
│   ├── users.js                # User management
│   ├── analytics.js            # Analytics and reporting
│   └── settings.js             # Platform settings
├── styles/
│   └── globals.css             # Global styles with Tailwind
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── package.json                # Dependencies and scripts
```

## Features Overview

### Dashboard
- Real-time system metrics
- Service health monitoring
- Recent activity feed
- Key performance indicators

### User Management
- Complete user CRUD operations
- Role-based permissions
- User search and filtering
- Account status management

### Analytics
- Revenue and user growth charts
- Trading volume analysis
- Top performing assets
- Platform usage statistics

### Settings
- General platform configuration
- Security settings (rate limits, JWT expiry)
- Email configuration (SMTP settings)
- System configuration (database, Redis)

## Security

- JWT-based authentication
- Role-based access control
- Admin-only access restrictions
- Secure API communication

## Development

### Adding New Admin Features

1. Create new page in `pages/` directory
2. Add navigation item to `AdminLayout.js`
3. Implement backend API endpoints if needed
4. Update role-based permissions as required

### Styling

The admin panel uses Tailwind CSS with custom utility classes defined in `globals.css`. Follow the existing design patterns for consistency.

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start production server:
   ```bash
   npm start
   ```

The admin panel will be available on port 3001 by default.