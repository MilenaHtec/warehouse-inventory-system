import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../../src/app.js';
import { getDatabase, runMigrations, closeDatabase } from '../../src/config/database.js';

describe('Categories API', () => {
  beforeAll(() => {
    runMigrations();
  });

  afterAll(() => {
    closeDatabase();
  });

  beforeEach(() => {
    // Clean up categories table before each test
    const db = getDatabase();
    db.exec('DELETE FROM products');
    db.exec('DELETE FROM categories');
  });

  describe('GET /api/categories', () => {
    it('should return empty array when no categories exist', async () => {
      const response = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should return all categories with product counts', async () => {
      // Create a category first
      const db = getDatabase();
      db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)').run('Electronics', 'Electronic items');
      db.prepare('INSERT INTO categories (name, description) VALUES (?, ?)').run('Clothing', 'Apparel');

      const response = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty('product_count');
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return category by id', async () => {
      const db = getDatabase();
      const result = db.prepare('INSERT INTO categories (name) VALUES (?)').run('Test Category');
      const categoryId = result.lastInsertRowid;

      const response = await request(app)
        .get(`/api/categories/${categoryId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Test Category');
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(app)
        .get('/api/categories/9999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const response = await request(app)
        .post('/api/categories')
        .send({ name: 'New Category', description: 'Test description' })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('New Category');
      expect(response.body.data.id).toBeDefined();
    });

    it('should return 400 for missing name', async () => {
      const response = await request(app)
        .post('/api/categories')
        .send({ description: 'No name' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 409 for duplicate category name', async () => {
      // Create first category
      await request(app)
        .post('/api/categories')
        .send({ name: 'Duplicate' })
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/categories')
        .send({ name: 'Duplicate' })
        .expect(409);

      expect(response.body.error.code).toBe('CONFLICT');
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update an existing category', async () => {
      const db = getDatabase();
      const result = db.prepare('INSERT INTO categories (name) VALUES (?)').run('Old Name');
      const categoryId = result.lastInsertRowid;

      const response = await request(app)
        .put(`/api/categories/${categoryId}`)
        .send({ name: 'New Name' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('New Name');
    });

    it('should return 404 for non-existent category', async () => {
      const response = await request(app)
        .put('/api/categories/9999')
        .send({ name: 'Updated' })
        .expect(404);

      expect(response.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete an empty category', async () => {
      const db = getDatabase();
      const result = db.prepare('INSERT INTO categories (name) VALUES (?)').run('To Delete');
      const categoryId = result.lastInsertRowid;

      const response = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should not delete category with products', async () => {
      const db = getDatabase();
      const catResult = db.prepare('INSERT INTO categories (name) VALUES (?)').run('Has Products');
      const categoryId = catResult.lastInsertRowid;
      
      db.prepare('INSERT INTO products (name, product_code, price, quantity, category_id) VALUES (?, ?, ?, ?, ?)')
        .run('Product', 'PROD-001', 10.00, 5, categoryId);

      const response = await request(app)
        .delete(`/api/categories/${categoryId}`)
        .expect(422);

      expect(response.body.error.code).toBe('CATEGORY_HAS_PRODUCTS');
    });
  });
});

