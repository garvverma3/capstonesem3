# Neon Database Setup Guide

## Create Neon Database (Free)

1. Go to [Neon Console](https://console.neon.tech/)
2. Sign up or log in with GitHub
3. Click **"Create a project"**
4. Project settings:
   - **Name**: `pharmacy-db` (or any name)
   - **Region**: Choose closest to you
   - **PostgreSQL version**: 16 (latest)
5. Click **"Create project"**

## Get Connection String

1. After project creation, you'll see the **Connection Details**
2. Copy the **Connection string** (it looks like):
   ```
   postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

## Update Local Environment

Update your `.env` file (line 2):

```env
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

## Run Migrations

```bash
npx prisma migrate dev --name init
```

This will:
- Create all tables in your Neon database
- Generate Prisma Client

## For Render Deployment

Use the **same connection string** in Render's environment variables:
- `DATABASE_URL` = (paste your Neon connection string)

This way, both local development and production use the same Neon database!

## Benefits of Neon

✅ Free tier with 0.5 GB storage  
✅ Serverless - no need to manage infrastructure  
✅ Auto-scaling  
✅ Works perfectly with Prisma  
✅ Same database for local dev and production (or create separate projects)
