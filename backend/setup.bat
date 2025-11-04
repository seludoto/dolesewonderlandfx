@echo off
REM Backend Installation Script for Windows
REM This script sets up the DoleSe Wonderland FX backend

echo.
echo ========================================
echo DoleSe Wonderland FX Backend Setup
echo ========================================
echo.

REM Check Node.js installation
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo [OK] Node.js detected
node --version

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed.
    exit /b 1
)

echo [OK] npm detected
npm --version
echo.

REM Install dependencies
echo ========================================
echo Installing dependencies...
echo ========================================
call npm install

if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)

echo [OK] Dependencies installed successfully
echo.

REM Create .env file if it doesn't exist
if not exist .env (
    echo ========================================
    echo Creating .env file...
    echo ========================================
    copy .env.example .env
    echo [OK] .env file created
    echo [WARNING] Please update .env with your configuration
    echo.
) else (
    echo [OK] .env file already exists
    echo.
)

REM Create logs directory
if not exist logs (
    mkdir logs
    echo [OK] Logs directory created
    echo.
)

REM Database setup
echo ========================================
set /p DB_SETUP="Do you want to run database migrations now? (Y/N): "
if /i "%DB_SETUP%"=="Y" (
    echo Running database migrations...
    call npm run db:migrate
    
    if errorlevel 1 (
        echo [WARNING] Database migration failed
        echo Please check your database configuration in .env
    ) else (
        echo [OK] Database migrations completed
        echo.
        
        set /p DB_SEED="Do you want to seed the database with demo data? (Y/N): "
        if /i "%DB_SEED%"=="Y" (
            call npm run db:seed
            echo [OK] Database seeded with demo data
            echo.
            echo Demo accounts created:
            echo   Admin:      admin@dolesefx.com / Admin@123
            echo   Instructor: instructor@dolesefx.com / Admin@123
            echo   Student:    student@dolesefx.com / Admin@123
            echo.
        )
    )
)

REM Run tests
echo ========================================
set /p RUN_TESTS="Do you want to run tests? (Y/N): "
if /i "%RUN_TESTS%"=="Y" (
    echo Running tests...
    call npm test
)

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Update .env with your configuration
echo 2. Start development server: npm run dev
echo 3. Start production server: npm start
echo.
echo Useful commands:
echo   npm run dev          - Start development server
echo   npm start            - Start production server
echo   npm test             - Run tests
echo   npm run test:watch   - Run tests in watch mode
echo   npm run lint         - Run linter
echo   npm run format       - Format code
echo   npm run db:migrate   - Run database migrations
echo   npm run db:seed      - Seed database
echo.
echo Documentation:
echo   README.md            - Getting started guide
echo   docs\API_DOCUMENTATION.md  - API endpoints
echo   docs\TESTING.md      - Testing guide
echo   docs\DEPLOYMENT.md   - Deployment guide
echo.
echo Happy coding!
echo.
pause
