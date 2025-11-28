import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { runMigrations, closeDatabase } from './config/database.js';
import { logger } from './utils/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { requestIdMiddleware, requestLogger } from './middleware/requestLogger.js';
import routes from './routes/index.js';

// ============================================
// Create Express App
// ============================================

const app = express();

// ============================================
// Middleware
// ============================================

// CORS
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request ID and logging
app.use(requestIdMiddleware);
if (!env.isTest) {
  app.use(requestLogger);
}

// ============================================
// Routes
// ============================================

app.use('/api', routes);

// ============================================
// Error Handling
// ============================================

app.use(notFoundHandler);
app.use(errorHandler);

// ============================================
// Server Startup
// ============================================

function startServer() {
  // Run database migrations
  runMigrations();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${env.PORT}`);
    logger.info(`📚 Environment: ${env.NODE_ENV}`);
  });

  // Graceful shutdown
  const shutdown = () => {
    logger.info('Shutting down server...');
    server.close(() => {
      closeDatabase();
      logger.info('Server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

// Start server if not in test mode
if (!env.isTest) {
  startServer();
}

export default app;

