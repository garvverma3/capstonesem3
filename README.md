# Node.js Prisma Authentication Project

## Setup Instructions

### Backend Setup
1. Create MySQL database `auth_db` in MySQL Workbench
2. Update `.env` file with your MySQL credentials
3. Navigate to backend folder: `cd backend`
4. Install dependencies: `npm install`
5. Generate Prisma client: `npx prisma generate`
6. Create database tables: `npx prisma db push`
7. Start server: `npm run dev`

### Frontend Setup
1. Navigate to frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start React app: `npm start`

## Usage
- Backend runs on http://localhost:5000
- Frontend runs on http://localhost:3000
- Use the signup form to create a new account
- Use the login form to authenticate existing users