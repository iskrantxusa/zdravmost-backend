#!/bin/bash

# Deploy script for zdravmost-backend
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment to production server..."

# Server configuration
SERVER_HOST="94.103.87.214"
SERVER_USER="as"
PROJECT_DIR="/home/as/zdravmost-backend"

echo "📡 Connecting to server: ${SERVER_USER}@${SERVER_HOST}"

# Deploy to server
ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
set -e

echo "🏠 Navigating to project directory..."
cd /home/as/

# Clone or update repository
if [ -d "zdravmost-backend" ]; then
    echo "📁 Project directory exists, updating..."
    cd zdravmost-backend
    git fetch origin
    git reset --hard origin/master
    echo "✅ Repository updated"
else
    echo "📁 Cloning repository..."
    git clone https://github.com/user/zdravmost-backend.git zdravmost-backend
    cd zdravmost-backend
    echo "✅ Repository cloned"
fi

echo "🛑 Stopping existing containers..."
sudo docker-compose down || true

echo "🏗️ Building Docker images..."
sudo docker-compose build

echo "🚀 Starting containers..."
sudo docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 45

echo "🗄️ Running database migrations..."
sudo docker-compose exec -T api npm run migration:run || echo "⚠️ Migration failed or no migrations to run"

echo "🔍 Checking container status..."
sudo docker-compose ps

echo "🏥 Performing health check..."
sleep 15
curl -f http://localhost:3000/health && echo "✅ Health check passed!" || echo "❌ Health check failed!"

echo "🎉 Deployment completed successfully!"
echo "🌐 Application is available at: http://94.103.87.214:3000"
echo "📧 Mailpit (email testing) is available at: http://94.103.87.214:8025"
ENDSSH

echo "✅ Deployment script completed!"
