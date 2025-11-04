#!/bin/bash
# Alternative deployment without Docker build
# Runs backend directly with Node.js

cd /opt/dolesewonderlandfx/backend

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    cp .env.production.example .env
    sed -i 's/your_secure_postgres_password_here/DoleSeFx_Postgres_2024_Secure!/g' .env
    sed -i 's/your_secure_redis_password_here/DoleSeFx_Redis_2024_Secure!/g' .env
    sed -i 's/your_jwt_secret_minimum_32_characters_long/DoleSeFx_JWT_Secret_2024_Production_Key_Very_Secure_123456/g' .env
    sed -i 's/your_refresh_secret_minimum_32_characters_long/DoleSeFx_Refresh_Secret_2024_Production_Key_Very_Secure_123456/g' .env
fi

# Start only PostgreSQL and Redis with Docker
docker compose -f docker-compose.all-in-one.yml up -d postgres redis

echo "Waiting for database and Redis..."
sleep 15

# Install Node.js if needed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt-get install -y nodejs
fi

# Install dependencies locally
echo "Installing backend dependencies..."
npm install --omit=dev --legacy-peer-deps

# Start backend with PM2
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

# Stop existing backend
pm2 delete dolesefx-backend 2>/dev/null || true

# Start backend
pm2 start src/app.js --name dolesefx-backend

# Save PM2 process list
pm2 save
pm2 startup

echo ""
echo "✅ Backend deployed!"
echo "Check status: pm2 status"
echo "View logs: pm2 logs dolesefx-backend"
echo "Test: curl http://localhost:5000/health"
