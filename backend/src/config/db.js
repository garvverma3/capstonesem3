const prisma = require('./prisma');

const connectDB = async () => {
  try {
    // Test the connection
    await prisma.$connect();
    console.log('📦 Database connected (Prisma + SQLite)');
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
