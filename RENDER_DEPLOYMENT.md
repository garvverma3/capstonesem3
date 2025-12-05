# Render Deployment Guide (Backend)

## Prerequisites

### Option 1: Use Neon Database (Recommended - Free & Easy)

Follow the [NEON_DATABASE_SETUP.md](./NEON_DATABASE_SETUP.md) guide to create a free Neon PostgreSQL database. You'll get a connection string to use in both local development and production.

### Option 2: Use Render PostgreSQL

1. In your Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Name it: `capstone-db`
3. Select the **Free** tier
4. Click **"Create Database"**
5. Wait for it to provision
6. Copy the **"Internal Database URL"** (starts with `postgresql://`)

## Configuration Settings

### Basic Settings
- **Name**: `capstone-api` (or any unique name)
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
- **Start Command**: `npm start`

### Environment Variables

Click **"Add Environment Variable"** for each:

| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Sets production mode |
| `DATABASE_URL` | `<paste-connection-string>` | PostgreSQL connection string from Neon or Render database |
| `JWT_SECRET` | `<generate-random-string>` | Secret for access tokens (use a long random string) |
| `JWT_REFRESH_SECRET` | `<generate-random-string>` | Secret for refresh tokens (different from JWT_SECRET) |
| `CLIENT_ORIGIN` | `https://your-frontend.vercel.app` | Your Vercel frontend URL (update after deploying frontend) |
| `PORT` | `5001` | Port number (Render will override this) |

### Important Notes

1. **Database URL**: Use the **Internal Database URL** from your Render PostgreSQL database. This ensures your backend can connect to the database within Render's private network.

2. **Generate Random Secrets**: For `JWT_SECRET` and `JWT_REFRESH_SECRET`, use strong random strings:
   ```bash
   # Generate on your local machine:
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Update CLIENT_ORIGIN**: After deploying your frontend to Vercel, come back and update this value with your actual Vercel URL.

4. **Database Migrations**: The build command includes `npx prisma migrate deploy` which will automatically run all migrations on your PostgreSQL database.

### Deploy

Click **"Create Web Service"** and wait for the build to complete. Once deployed, copy the URL (e.g., `https://capstone-api.onrender.com`) - you'll need this for Vercel configuration.
