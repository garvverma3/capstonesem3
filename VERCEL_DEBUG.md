# Vercel Deployment Debugging Guide

## Quick Diagnostics

If you're experiencing issues with your Vercel deployment at https://capstonesem3-9bha.vercel.app, follow these steps:

### 1. Check API Health Endpoint

Test if the backend API is working:
```
https://capstonesem3-9bha.vercel.app/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

**If this fails:**
- Check Vercel function logs
- Verify environment variables are set
- Check MongoDB connection

### 2. Test Signup API Directly

```bash
curl -X POST https://capstonesem3-9bha.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
  }'
```

### 3. Check Browser Console

Open browser DevTools (F12) and check:
- **Console tab**: Look for JavaScript errors
- **Network tab**: Check API requests and responses
  - Look for failed requests to `/api/auth/register`
  - Check response status codes
  - Check CORS errors

### 4. Verify Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables, ensure:

✅ **Required Variables:**
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_REFRESH_SECRET` - Secret key for refresh tokens
- `NODE_ENV=production`

✅ **Optional but Recommended:**
- `CLIENT_ORIGIN=https://capstonesem3-9bha.vercel.app`
- `REACT_APP_API_URL=/api` (or leave empty for auto-detection)

### 5. Check Vercel Function Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click on "Deployments"
4. Click on the latest deployment
5. Click on "Functions" tab
6. Check logs for errors

**Common Errors:**

#### "MongoDB connection error"
- **Cause**: `MONGODB_URI` not set or incorrect
- **Fix**: Verify MongoDB Atlas connection string
- **Fix**: Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`

#### "JWT_SECRET is required"
- **Cause**: JWT secrets not set
- **Fix**: Add `JWT_SECRET` and `JWT_REFRESH_SECRET` environment variables

#### "CORS error" or "Network error"
- **Cause**: CORS configuration issue
- **Fix**: Ensure `CLIENT_ORIGIN` matches your Vercel URL exactly
- **Fix**: Check that `VERCEL_URL` is available (set automatically by Vercel)

#### "Function timeout"
- **Cause**: Database connection taking too long
- **Fix**: Check MongoDB Atlas connection
- **Fix**: Verify network connectivity

### 6. Common Issues and Solutions

#### Issue: Signup form shows "Network error"

**Possible Causes:**
1. Backend API not responding
2. CORS blocking requests
3. Environment variables not set

**Solutions:**
1. Test `/api/health` endpoint
2. Check browser console for specific error
3. Verify all environment variables are set
4. Check Vercel function logs

#### Issue: "Cannot connect to server" error

**Possible Causes:**
1. API routes not configured correctly
2. Serverless function not deployed
3. `vercel.json` misconfigured

**Solutions:**
1. Verify `vercel.json` exists in project root
2. Check that `api/index.js` exists
3. Redeploy the application

#### Issue: Signup succeeds but login fails

**Possible Causes:**
1. Database connection issue
2. JWT token generation failing
3. User not saved to database

**Solutions:**
1. Check MongoDB Atlas for saved users
2. Verify JWT secrets are set
3. Check function logs for errors

### 7. Testing Checklist

- [ ] `/api/health` returns `{"status":"ok"}`
- [ ] `/api/auth/register` accepts POST requests
- [ ] `/api/auth/login` accepts POST requests
- [ ] MongoDB Atlas connection works
- [ ] All environment variables are set
- [ ] No CORS errors in browser console
- [ ] No JavaScript errors in browser console
- [ ] Vercel function logs show no errors

### 8. Quick Fixes

#### Fix: Add Missing Environment Variables

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add missing variables
3. Redeploy (or wait for automatic redeploy)

#### Fix: Update CORS Configuration

If you see CORS errors, update `CLIENT_ORIGIN`:
```
CLIENT_ORIGIN=https://capstonesem3-9bha.vercel.app
```

#### Fix: Verify MongoDB Connection

1. Go to MongoDB Atlas Dashboard
2. Check "Network Access" - ensure `0.0.0.0/0` is whitelisted
3. Check "Database Access" - verify user has read/write permissions
4. Test connection string format: `mongodb+srv://username:password@cluster.mongodb.net/pharmacy`

### 9. Get Help

If issues persist:

1. **Check Vercel Logs**: Most detailed error information
2. **Check Browser Console**: Client-side errors
3. **Test API Endpoints**: Use curl or Postman
4. **Verify MongoDB**: Check Atlas dashboard

### 10. Redeploy After Changes

After updating environment variables or configuration:
- Vercel will auto-redeploy, OR
- Manually trigger redeploy from Vercel Dashboard

---

## Quick Test Commands

```bash
# Test health endpoint
curl https://capstonesem3-9bha.vercel.app/api/health

# Test signup
curl -X POST https://capstonesem3-9bha.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Test login
curl -X POST https://capstonesem3-9bha.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

