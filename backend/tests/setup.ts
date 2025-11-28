// Jest setup file
import { jest } from '@jest/globals';

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATABASE_PATH = ':memory:';

// Increase timeout for integration tests
jest.setTimeout(10000);

