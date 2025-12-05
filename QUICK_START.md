# Quick Start - Run Locally

## Current Status
- ✅ Frontend is running on http://localhost:3000
- ❌ Backend needs MongoDB to start

## Fastest Solution: Use MongoDB Atlas (5 minutes)

### 1. Get MongoDB Atlas Connection String
1. Go to https://www.mongodb.com/cloud/atlas (sign up free)
2. Create a cluster → Get connection string
3. It looks like: `mongodb+srv://username:password@cluster.mongodb.net/pharmacy`

### 2. Update backend/.env
```bash
cd backend
# Edit .env file and update MONGODB_URI with your Atlas connection string
```

### 3. Start Backend
```bash
cd backend
npm run dev
```

You should see:
```
📦 MongoDB connected
🚀 Server ready on http://localhost:5001
```

### 4. Test Signup
- Go to http://localhost:3000/signup
- It should work now!

## Alternative: Install Local MongoDB

If you prefer local MongoDB:
```bash
# Install
brew tap mongodb/brew
brew install mongodb-community

# Start
brew services start mongodb-community

# Then start backend
cd backend
npm run dev
```

## What You Need

**Two terminal windows:**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Then open http://localhost:3000

## Need Help?

See `SETUP_MONGODB.md` for detailed MongoDB Atlas setup instructions.

