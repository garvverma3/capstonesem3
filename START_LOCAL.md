# Running the Application Locally

## Quick Start

### Step 1: Start MongoDB

**Option A: Using Homebrew (macOS)**
```bash
brew services start mongodb-community
```

**Option B: Using MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `backend/.env` with:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pharmacy
   ```

### Step 2: Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5001`

### Step 3: Start Frontend (in a new terminal)

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## Verify Everything is Working

1. **Backend Health Check**:
   ```bash
   curl http://localhost:5001/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Open Frontend**:
   - Go to http://localhost:3000
   - Try signing up or logging in

## Troubleshooting

### MongoDB Connection Error

If you see "MongoDB connection error":
- **Local MongoDB**: Make sure MongoDB is running (`brew services start mongodb-community`)
- **MongoDB Atlas**: 
  - Check connection string in `backend/.env`
  - Ensure IP whitelist includes `0.0.0.0/0` in Atlas dashboard
  - Verify database user has read/write permissions

### Port Already in Use

If port 5001 is in use:
```bash
# Find and kill the process
lsof -ti:5001 | xargs kill -9
```

If port 3000 is in use:
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9
```

### Backend Not Starting

1. Check `backend/.env` file exists and has correct values
2. Check MongoDB is running/accessible
3. Check backend terminal for error messages

## Environment Variables Needed

Create `backend/.env`:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/pharmacy
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pharmacy
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
CLIENT_ORIGIN=http://localhost:3000
NODE_ENV=development
```

## Running Both Servers

You need **two terminal windows**:

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

Then open http://localhost:3000 in your browser!

