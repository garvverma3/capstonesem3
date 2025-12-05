#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Pharmacy Management Backend Server...${NC}"

# Check if MongoDB is running
if ! pgrep -x mongod > /dev/null; then
    echo -e "${RED}⚠️  MongoDB is not running!${NC}"
    echo -e "${YELLOW}Attempting to start MongoDB...${NC}"
    
    # Try different methods to start MongoDB
    if command -v brew &> /dev/null; then
        brew services start mongodb-community 2>/dev/null || \
        brew services start mongodb-community@7.0 2>/dev/null || \
        echo -e "${RED}Could not start MongoDB via Homebrew.${NC}"
    fi
    
    # Wait a moment for MongoDB to start
    sleep 2
    
    # Check again
    if ! pgrep -x mongod > /dev/null; then
        echo -e "${RED}❌ MongoDB is still not running.${NC}"
        echo -e "${YELLOW}Please start MongoDB manually using one of these methods:${NC}"
        echo "  1. brew services start mongodb-community"
        echo "  2. mongod (if installed via other means)"
        echo "  3. Use MongoDB Atlas (cloud) and update MONGODB_URI in .env"
        echo ""
        echo -e "${YELLOW}Then run this script again.${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ MongoDB is running${NC}"

# Check if port 5001 is already in use
if lsof -ti:5001 > /dev/null; then
    echo -e "${YELLOW}⚠️  Port 5001 is already in use.${NC}"
    echo -e "${YELLOW}Stopping existing process...${NC}"
    lsof -ti:5001 | xargs kill -9 2>/dev/null || true
    sleep 1
fi

# Start the backend server
echo -e "${YELLOW}Starting backend server on port 5001...${NC}"
npm run dev

