# Troubleshooting Guide

## Network Error When Logging In

If you're experiencing a network error when trying to log in, follow these steps:

### Step 1: Check if Backend Server is Running

The backend server should be running on `http://localhost:5001`. To check:

```bash
# Check if port 5001 is in use
lsof -ti:5001
```

If nothing is returned, the backend server is not running.

### Step 2: Check if MongoDB is Running

The backend requires MongoDB to be running. Check with:

```bash
pgrep -x mongod
```

If nothing is returned, MongoDB is not running.

### Step 3: Start MongoDB

**Option A: Using Homebrew (macOS)**
```bash
brew services start mongodb-community
```

**Option B: Manual Start**
```bash
mongod
```

**Option C: Using MongoDB Atlas (Cloud)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and get your connection string
3. Update `MONGODB_URI` in `backend/.env`

### Step 4: Start the Backend Server

**Easy Method (using the startup script):**
```bash
cd backend
./start-server.sh
```

**Manual Method:**
```bash
cd backend
npm run dev
```

You should see:
- `📦 MongoDB connected`
- `🚀 Server ready on http://localhost:5001`

### Step 5: Verify Backend is Running

Test the health endpoint:
```bash
curl http://localhost:5001/health
```

You should get: `{"status":"ok","timestamp":"..."}`

### Step 6: Start the Frontend

In a new terminal:
```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

### Common Issues

#### Issue: "MongoDB connection error"
**Solution:** Make sure MongoDB is running (see Step 3)

#### Issue: "Port 5001 already in use"
**Solution:** 
```bash
# Find and kill the process using port 5001
lsof -ti:5001 | xargs kill -9
```

#### Issue: "Network error" in browser
**Solution:** 
1. Verify backend is running (Step 4)
2. Check browser console for CORS errors
3. Verify `REACT_APP_API_URL` in frontend `.env` matches backend port
4. Check that backend CORS allows `http://localhost:3000`

#### Issue: Backend starts but immediately crashes
**Solution:** Check the error message. Common causes:
- MongoDB not running
- Invalid `.env` configuration
- Missing dependencies (run `npm install` in backend)

### Quick Start Checklist

- [ ] MongoDB is running
- [ ] Backend server is running on port 5001
- [ ] Backend health check returns `{"status":"ok"}`
- [ ] Frontend is running on port 3000
- [ ] No CORS errors in browser console

### Still Having Issues?

1. Check backend terminal for error messages
2. Check browser console (F12) for detailed error messages
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed (`npm install` in both frontend and backend)

