# Vercel Deployment Guide (Frontend)

## Configuration Settings

### Project Settings

1. **Root Directory**: 
   - Click **Edit** next to "Root Directory"
   - Enter: `frontend`
   - ✅ This tells Vercel where your React app is located

2. **Framework Preset**: 
   - Should auto-detect as **Create React App**
   - If not, select it manually from the dropdown

3. **Build Settings** (auto-configured):
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

### Environment Variables

Click **"Add Environment Variable"** and add:

| Key | Value | Environment |
|-----|-------|-------------|
| `REACT_APP_API_URL` | `https://your-render-backend.onrender.com/api` | Production, Preview, Development |

**Important**: 
- Replace `your-render-backend.onrender.com` with your actual Render backend URL
- **Must include `/api` at the end** - this is critical!
- Example: `https://capstone-api.onrender.com/api` ✅
- Wrong: `https://capstone-api.onrender.com` ❌

### Deploy

1. Click **"Deploy"**
2. Wait for the build to complete
3. Copy your Vercel URL (e.g., `https://capstonesem3.vercel.app`)

### Final Step: Update Render CORS

After deploying to Vercel:

1. Go back to your **Render Dashboard**
2. Navigate to your backend service
3. Go to **Environment** tab
4. Update `CLIENT_ORIGIN` to your Vercel URL: `https://capstonesem3.vercel.app`
5. Click **"Save Changes"**
6. Render will automatically redeploy

This allows your frontend and backend to communicate without CORS errors.

## Testing

After both deployments are complete:

1. Visit your Vercel URL
2. Try to sign up with a new account
3. Try to log in
4. The network error should be gone! ✅
