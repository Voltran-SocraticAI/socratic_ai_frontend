#!/bin/bash

# Socratic AI Frontend Deployment Script
# Run this from /home/cihat-socratic/htdocs/socratic.cihat.app

set -e

echo "🚀 Deploying Socratic AI Frontend..."

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t socratic-frontend \
  --build-arg NEXT_PUBLIC_API_URL=https://socratic.cihat.app/api/v1 \
  .

# Stop existing container if running
echo "🛑 Stopping existing container..."
docker stop socratic-frontend 2>/dev/null || true
docker rm socratic-frontend 2>/dev/null || true

# Run the new container
echo "▶️ Starting new container..."
docker run -d \
  --name socratic-frontend \
  --restart unless-stopped \
  -p 3000:3000 \
  --network socratic-network \
  socratic-frontend

echo "✅ Frontend deployed successfully!"
echo "🌐 Running at http://localhost:3000"
