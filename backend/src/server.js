const { app } = require('./app');
const { connectDB } = require('./config/db');
const { config } = require('./config/env');

const start = async () => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`🚀 Server ready on http://localhost:${config.port}`);
  });
};

start();

