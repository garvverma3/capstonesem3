# Quick MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommended - 5 minutes)

### Step 1: Create Free MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for free (no credit card required)
3. Create a free cluster (M0 - Free tier)

### Step 2: Configure Database Access
1. In Atlas Dashboard → **Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Enter username and password (save these!)
5. Set privileges to **Read and write to any database**
6. Click **Add User**

### Step 3: Configure Network Access
1. In Atlas Dashboard → **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (adds `0.0.0.0/0`)
4. Click **Confirm**

### Step 4: Get Connection String
1. In Atlas Dashboard → **Database** → **Connect**
2. Choose **Connect your application**
3. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/pharmacy`)
4. Replace `<password>` with your actual password
5. Add `/pharmacy` at the end (before the `?`)

### Step 5: Update Backend .env File
Update `backend/.env`:
```env
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/pharmacy?retryWrites=true&w=majority
```

### Step 6: Start Backend
```bash
cd backend
npm run dev
```

## Option 2: Local MongoDB (If you prefer)

### Install MongoDB
```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

### Verify MongoDB is Running
```bash
mongosh
# Should connect successfully
```

### Keep .env as is
Your `backend/.env` already has:
```
MONGODB_URI=mongodb://127.0.0.1:27017/pharmacy
```

## Quick Test

After setting up MongoDB (either option), test the backend:

```bash
cd backend
npm run dev
```

You should see:
```
📦 MongoDB connected
🚀 Server ready on http://localhost:5001
```

Then test:
```bash
curl http://localhost:5001/health
```

Should return: `{"status":"ok","timestamp":"..."}`

## Troubleshooting

### "MongoDB connection error"
- **Atlas**: Check connection string, password, and IP whitelist
- **Local**: Make sure MongoDB service is running

### "Authentication failed"
- Check username and password in connection string
- Make sure password doesn't have special characters that need URL encoding

### "Network access denied"
- In Atlas → Network Access, make sure `0.0.0.0/0` is whitelisted

