import { createApp } from './app.js';
import { connectDatabase, disconnectDatabase } from './config/database.config.js';
import { loadConfig } from './config/env.config.js';

async function start() {
  const config = loadConfig();
  await connectDatabase(config.mongoUri);

  const server = createApp(config).listen(config.port, () => {
    console.log(`M3alem.ma running on http://localhost:${config.port}`);
  });

  const shutdown = () => {
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

start().catch((error) => {
  console.error('Failed to start the server:', error.message);
  process.exit(1);
});
