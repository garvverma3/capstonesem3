// Vercel serverless function wrapper for Express backend
// This ensures database connection is established before handling requests

let appInstance;
let connectionPromise = null;

const initializeApp = async () => {
  if (appInstance) return appInstance;
  
  // Import app and database connection
  const { app } = require('../backend/src/app');
  const { connectDB } = require('../backend/src/config/db');
  
  // Connect to database (reuse connection if already connecting)
  if (!connectionPromise) {
    connectionPromise = connectDB().catch(error => {
      console.error('Database connection error in serverless function:', error.message);
      // Don't block - connection will be retried
      connectionPromise = null;
    });
  }
  
  // Wait for connection (or continue if it fails - will retry)
  try {
    await connectionPromise;
  } catch (error) {
    // Connection failed, but continue - will retry on next request
  }
  
  appInstance = app;
  return app;
};

// Export as serverless function
module.exports = async (req, res) => {
  try {
    const app = await initializeApp();
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

