const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Get client origin - support Vercel's dynamic URLs
const getClientOrigin = () => {
  if (process.env.CLIENT_ORIGIN) return process.env.CLIENT_ORIGIN;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.VERCEL) return process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
  return 'http://localhost:3000';
};

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5001,
  clientOrigin: getClientOrigin(),
  mongoUri:
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pharmacy',
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-jwt-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-jwt-refresh-secret',
    accessExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
};

module.exports = { config };

