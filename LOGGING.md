# Logging Specification

## Overview

This document defines the logging strategy for the Warehouse Inventory System. Logging is essential for debugging, monitoring, and auditing application behavior.

---

## Logging Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Application                                        │
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ Controllers │  │  Services   │  │ Repositories│  │ Middleware  │       │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘       │
│         │                │                │                │              │
│         └────────────────┼────────────────┼────────────────┘              │
│                          ▼                                                 │
│                   ┌─────────────┐                                         │
│                   │   Logger    │                                         │
│                   │  (Winston)  │                                         │
│                   └──────┬──────┘                                         │
│                          │                                                 │
└──────────────────────────┼─────────────────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │   Console   │ │    File     │ │  External   │
    │  Transport  │ │  Transport  │ │  (Future)   │
    └─────────────┘ └─────────────┘ └─────────────┘
```

---

## Technology

| Component   | Technology | Purpose                               |
| ----------- | ---------- | ------------------------------------- |
| Logger      | Winston    | Primary logging library               |
| Format      | JSON       | Structured log format                 |
| Rotation    | winston-daily-rotate-file | Log file rotation |

---

## Log Levels

| Level   | Priority | Usage                                              |
| ------- | -------- | -------------------------------------------------- |
| error   | 0        | Errors that need immediate attention               |
| warn    | 1        | Warning conditions, potential issues               |
| info    | 2        | General operational information                    |
| http    | 3        | HTTP request logging                               |
| debug   | 4        | Detailed debugging information                     |

### Environment-Based Levels

| Environment | Default Level | Description                      |
| ----------- | ------------- | -------------------------------- |
| production  | info          | Minimal logging for performance  |
| development | debug         | Verbose logging for debugging    |
| test        | error         | Only critical errors             |

---

## Log Format

### Standard Log Entry

```json
{
  "level": "info",
  "message": "Product created successfully",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "warehouse-api",
  "requestId": "req-abc123",
  "context": {
    "productId": 1,
    "productCode": "BEV-001"
  }
}
```

### HTTP Request Log

```json
{
  "level": "http",
  "message": "POST /api/products 201",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "warehouse-api",
  "requestId": "req-abc123",
  "http": {
    "method": "POST",
    "url": "/api/products",
    "statusCode": 201,
    "responseTime": 45,
    "userAgent": "Mozilla/5.0..."
  }
}
```

### Error Log

```json
{
  "level": "error",
  "message": "Database connection failed",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "warehouse-api",
  "requestId": "req-abc123",
  "error": {
    "name": "DatabaseError",
    "message": "Connection timeout",
    "code": "DATABASE_ERROR",
    "stack": "Error: Connection timeout\n    at..."
  }
}
```

---

## Logger Implementation

### Logger Configuration

```typescript
// src/utils/logger.ts

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

const { combine, timestamp, json, printf, colorize, errors } = winston.format;

// Custom format for console in development
const devFormat = printf(({ level, message, timestamp, requestId, ...meta }) => {
  const reqId = requestId ? `[${requestId}]` : '';
  const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
  return `${timestamp} ${level} ${reqId} ${message} ${metaStr}`;
});

// Determine log level based on environment
const level = process.env.LOG_LEVEL || 
  (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

// Create transports array
const transports: winston.transport[] = [];

// Console transport
if (process.env.NODE_ENV !== 'test') {
  transports.push(
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'development'
        ? combine(colorize(), timestamp({ format: 'HH:mm:ss' }), devFormat)
        : combine(timestamp(), json()),
    })
  );
}

// File transports (production and development)
if (process.env.NODE_ENV !== 'test') {
  const logsDir = path.join(process.cwd(), 'logs');

  // Combined log file
  transports.push(
    new DailyRotateFile({
      dirname: logsDir,
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: combine(timestamp(), json()),
    })
  );

  // Error log file
  transports.push(
    new DailyRotateFile({
      dirname: logsDir,
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error',
      format: combine(timestamp(), json()),
    })
  );
}

// Create logger instance
export const logger = winston.createLogger({
  level,
  defaultMeta: { service: 'warehouse-api' },
  format: combine(
    errors({ stack: true }),
    timestamp()
  ),
  transports,
});

// Create child logger with request context
export const createRequestLogger = (requestId: string) => {
  return logger.child({ requestId });
};
```

---

## HTTP Request Logging Middleware

```typescript
// src/middleware/logger.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { logger, createRequestLogger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

declare global {
  namespace Express {
    interface Request {
      id: string;
      log: typeof logger;
    }
  }
}

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  // Generate unique request ID
  req.id = req.headers['x-request-id'] as string || uuidv4();
  req.log = createRequestLogger(req.id);
  
  // Set request ID in response header
  res.setHeader('x-request-id', req.id);

  // Record start time
  const startTime = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    logger.http(`${req.method} ${req.originalUrl} ${res.statusCode}`, {
      requestId: req.id,
      http: {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: duration,
        contentLength: res.get('content-length'),
        userAgent: req.get('user-agent'),
        ip: req.ip,
      },
    });
  });

  next();
};
```

---

## Logging in Application Layers

### Controller Logging

```typescript
// src/controllers/product.controller.ts

export class ProductController {
  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.log.debug('Creating product', { body: req.body });

      const product = await this.productService.create(req.body);

      req.log.info('Product created successfully', {
        productId: product.id,
        productCode: product.productCode,
      });

      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };
}
```

### Service Logging

```typescript
// src/services/inventory.service.ts

export class InventoryService {
  async decreaseStock(productId: number, quantity: number, reason?: string) {
    logger.debug('Decreasing stock', { productId, quantity, reason });

    const product = await this.productRepository.findById(productId);
    
    if (!product) {
      logger.warn('Product not found for stock decrease', { productId });
      throw Errors.productNotFound(productId);
    }

    if (product.quantity < quantity) {
      logger.warn('Insufficient stock', {
        productId,
        requested: quantity,
        available: product.quantity,
      });
      throw Errors.insufficientStock(quantity, product.quantity);
    }

    // ... perform update

    logger.info('Stock decreased successfully', {
      productId,
      previousQuantity: product.quantity,
      newQuantity: newQuantity,
      change: -quantity,
    });

    return result;
  }
}
```

### Error Logging

```typescript
// src/middleware/error-handler.middleware.ts

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isOperational = err instanceof AppError && err.isOperational;

  // Log error with appropriate level
  if (isOperational) {
    logger.warn('Operational error', {
      requestId: req.id,
      error: {
        code: (err as AppError).code,
        message: err.message,
      },
      path: req.path,
      method: req.method,
    });
  } else {
    logger.error('Unexpected error', {
      requestId: req.id,
      error: {
        name: err.name,
        message: err.message,
        stack: err.stack,
      },
      path: req.path,
      method: req.method,
      body: req.body,
    });
  }

  // ... send response
};
```

---

## Log Files Structure

```
logs/
├── app-2024-01-15.log        # All logs (info and above)
├── app-2024-01-14.log
├── error-2024-01-15.log      # Error logs only
├── error-2024-01-14.log
└── ...
```

---

## What to Log

### DO Log

| Category              | Examples                                        |
| --------------------- | ----------------------------------------------- |
| Business events       | Product created, stock changed, order placed    |
| Errors & exceptions   | All caught and uncaught errors                  |
| API requests          | Method, URL, status code, response time         |
| Authentication events | Login attempts, session events                  |
| Database operations   | Slow queries (> threshold), connection issues   |
| Application lifecycle | Startup, shutdown, config loaded                |

### DON'T Log

| Category              | Reason                                          |
| --------------------- | ----------------------------------------------- |
| Passwords             | Security - never log credentials                |
| Credit card numbers   | PCI compliance                                  |
| Personal identifiable info | GDPR/privacy compliance                    |
| Full request bodies   | May contain sensitive data                      |
| Stack traces in prod  | Security - hide internal details                |

---

## Performance Considerations

| Practice                   | Benefit                                    |
| -------------------------- | ------------------------------------------ |
| Async logging              | Non-blocking I/O                           |
| Log level filtering        | Reduce unnecessary logs in production      |
| Log rotation               | Prevent disk space issues                  |
| Structured JSON            | Efficient parsing and searching            |
| Request sampling           | Reduce volume for high-traffic endpoints   |

---

## Log Queries

### Find errors by request ID

```bash
grep "req-abc123" logs/error-2024-01-15.log | jq
```

### Find slow requests (> 1000ms)

```bash
cat logs/app-2024-01-15.log | jq 'select(.http.responseTime > 1000)'
```

### Count errors by code

```bash
cat logs/error-2024-01-15.log | jq -r '.error.code' | sort | uniq -c | sort -rn
```

---

## Monitoring Integration

### Structured Log Fields

```typescript
// Standard fields for monitoring systems
interface LogEntry {
  level: string;
  message: string;
  timestamp: string;
  service: string;
  requestId?: string;
  userId?: string;
  traceId?: string;
  spanId?: string;
  error?: {
    code: string;
    message: string;
    stack?: string;
  };
  http?: {
    method: string;
    url: string;
    statusCode: number;
    responseTime: number;
  };
  context?: Record<string, unknown>;
}
```

---

## Best Practices Summary

1. **Use structured logging** - JSON format for easy parsing
2. **Include request IDs** - Trace requests across logs
3. **Log at appropriate levels** - Don't spam info with debug
4. **Redact sensitive data** - Security first
5. **Rotate log files** - Prevent disk issues
6. **Use async logging** - Don't block requests
7. **Include context** - Make logs actionable
8. **Monitor log volume** - Alert on anomalies

