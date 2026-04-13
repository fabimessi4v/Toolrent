#!/bin/bash

# Test script for Toolrent Docker Compose deployment
# This script validates the deployment configuration and provides guidance

set -e

echo "=== Toolrent Deployment Test Script ==="
echo "This script validates your deployment configuration."
echo ""

# Check prerequisites
echo "1. Checking prerequisites..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi
echo "✅ Docker is installed: $(docker --version)"

if ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose."
    exit 1
fi
echo "✅ Docker Compose is installed: $(docker compose version)"

# Check deploy folder structure
echo ""
echo "2. Checking deployment folder structure..."
REQUIRED_FILES=(
    "docker-compose.yml"
    ".env.example"
    "nginx/conf/default.conf"
    "nginx/conf/http.conf"
    "nginx/certs/192.168.122.17.pem"
    "nginx/certs/192.168.122.17-key.pem"
    "keycloak/realm-export.json"
    "bd/respaldo_toolrent_2026-02-19.sql"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ] || [ -d "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file is missing"
    fi
done

# Check environment file
echo ""
echo "3. Checking environment configuration..."
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    
    # Check required variables
    REQUIRED_VARS=("DOCKER_USERNAME" "DB_USER" "DB_PASSWORD" "DB_DRIVER" "SPRING_APPLICATION_NAME")
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^$var=" .env; then
            value=$(grep "^$var=" .env | cut -d'=' -f2-)
            if [ -n "$value" ] && [ "$value" != "yourdockerhubusername" ] && [ "$value" != "your_secure_password_here" ]; then
                echo "✅ $var is set"
            else
                echo "⚠️  $var has default value - please update in .env file"
            fi
        else
            echo "❌ $var is not defined in .env"
        fi
    done
else
    echo "⚠️  .env file not found. Create it from .env.example:"
    echo "   cp .env.example .env"
    echo "   nano .env  # Edit with your values"
fi

# Validate docker-compose configuration
echo ""
echo "4. Validating Docker Compose configuration..."
if docker compose config > /dev/null 2>&1; then
    echo "✅ docker-compose.yml is valid"
else
    echo "❌ docker-compose.yml has errors:"
    docker compose config
fi

# Check port availability
echo ""
echo "5. Checking port availability..."
PORTS=("80" "443" "8081")
for port in "${PORTS[@]}"; do
    if ss -tulpn | grep -q ":$port "; then
        echo "⚠️  Port $port is already in use"
    else
        echo "✅ Port $port is available"
    fi
done

# Provide next steps
echo ""
echo "=== Next Steps ==="
echo ""
if [ -f ".env" ]; then
    echo "To start the application:"
    echo "  docker compose up -d"
    echo ""
    echo "To check service status:"
    echo "  docker compose ps"
    echo ""
    echo "To view logs:"
    echo "  docker compose logs -f"
else
    echo "1. Create .env file:"
    echo "   cp .env.example .env"
    echo "   nano .env"
    echo ""
    echo "2. Update .env with your values:"
    echo "   - DOCKER_USERNAME: Your Docker Hub username"
    echo "   - DB_PASSWORD: Secure database password"
    echo "   - Other variables as needed"
    echo ""
    echo "3. Start the application:"
    echo "   docker compose up -d"
fi

echo ""
echo "=== Access URLs ==="
echo "Application: https://192.168.122.17"
echo "Backend API: https://192.168.122.17/api/"
echo "Keycloak Admin: https://192.168.122.17/admin/"
echo ""
echo "Default credentials:"
echo "  Keycloak: admin / admin"
echo "  Application Admin: admin@toolrent.com / admin123"
echo "  Application Employee: employee@toolrent.com / employee123"