const mongoose = require('mongoose');
const { config } = require('./env');

mongoose.set('strictQuery', true);

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log('📦 MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('\n⚠️  Please ensure MongoDB is running:');
    console.error('   - Install: brew install mongodb-community');
    console.error('   - Start: brew services start mongodb-community');
    console.error('   - Or use MongoDB Atlas (cloud) and update MONGODB_URI in .env\n');
    process.exit(1);
  }
};

module.exports = { connectDB };


