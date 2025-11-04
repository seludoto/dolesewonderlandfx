cd /opt/dolesewonderlandfx/backend
cp .env.production.example .env
sed -i 's/your_secure_postgres_password_here/DoleSeFx_Postgres_2024_Secure!/g' .env
sed -i 's/your_secure_redis_password_here/DoleSeFx_Redis_2024_Secure!/g' .env
sed -i 's/your_jwt_secret_minimum_32_characters_long/DoleSeFx_JWT_Secret_2024_Production_Key_Very_Secure_123456/g' .env
sed -i 's/your_refresh_secret_minimum_32_characters_long/DoleSeFx_Refresh_Secret_2024_Production_Key_Very_Secure_123456/g' .env
docker compose -f docker-compose.all-in-one.yml up -d
echo "Waiting 30 seconds for services..."
sleep 30
docker compose -f docker-compose.all-in-one.yml ps
curl http://localhost:5000/health
echo ""
echo "✅ Done! Test: curl http://134.209.15.243:5000/health"
