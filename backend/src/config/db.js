const mongoose = require('mongoose');
const { config } = require('./env');

mongoose.set('strictQuery', true);

const connectDB = async () => {
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    return;
  }
  
  try {
    await mongoose.connect(config.mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log('📦 MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // Don't exit in serverless environments (Vercel)
    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      console.error('⚠️  Running in serverless environment - connection will be retried on next request');
      throw error; // Throw instead of exiting
    }
    
    console.error('\n⚠️  Please ensure MongoDB is running:');
    console.error('   - Install: brew install mongodb-community');
    console.error('   - Start: brew services start mongodb-community');
    console.error('   - Or use MongoDB Atlas (cloud) and update MONGODB_URI in .env\n');
    process.exit(1);
  }
};

module.exports = { connectDB };


