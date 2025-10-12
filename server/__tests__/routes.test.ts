import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { Hono } from 'hono';
import { registerRoutes } from '../routes';
import type { Env } from '../db';

// Mock the database
const mockDb = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  all: jest.fn().mockResolvedValue([]),
  get: jest.fn().mockResolvedValue(null),
  insert: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
};

// Mock getDb function
jest.mock('../db', () => ({
  getDb: () => mockDb,
}));

describe('API Routes', () => {
  let app: Hono<{ Bindings: Env }>;

  beforeEach(() => {
    app = new Hono<{ Bindings: Env }>();
    registerRoutes(app);
    jest.clearAllMocks();
  });

  describe('GET /api/vendors', () => {
    it('should return vendors list', async () => {
      const mockVendors = [
        { id: 1, name: 'Test Vendor', location: 'Goa' },
        { id: 2, name: 'Another Vendor', location: 'Mumbai' },
      ];
      (mockDb.all as jest.Mock).mockResolvedValue(mockVendors);

      const res = await app.request('/api/vendors');
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual(mockVendors);
    });

    it('should filter vendors by category', async () => {
      const res = await app.request('/api/vendors?category=Photography');
      
      expect(mockDb.where).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });

    it('should handle database errors', async () => {
      (mockDb.all as jest.Mock).mockRejectedValue(new Error('Database error'));

      const res = await app.request('/api/vendors');
      const data = await res.json();

      expect(res.status).toBe(500);
      expect(data.message).toBe('Failed to fetch vendors');
    });
  });

  describe('POST /api/vendors/:id/reviews', () => {
    it('should create a new review', async () => {
      const mockReview = { id: 1, vendorId: 1, rating: 5, comment: 'Great service!' };
      (mockDb.get as jest.Mock).mockResolvedValue(mockReview);

      const reviewData = {
        rating: 5,
        comment: 'Great service!',
        reviewerName: 'John Doe',
        reviewerEmail: 'john@example.com',
      };

      const res = await app.request('/api/vendors/1/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data).toEqual(mockReview);
    });

    it('should handle invalid review data', async () => {
      const invalidData = { rating: 'invalid' };

      const res = await app.request('/api/vendors/1/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.message).toBe('Invalid review data');
    });
  });

  describe('GET /api/categories', () => {
    it('should return categories list', async () => {
      const mockCategories = [
        { id: 1, name: 'Photography', slug: 'photography' },
        { id: 2, name: 'Catering', slug: 'catering' },
      ];
      (mockDb.all as jest.Mock).mockResolvedValue(mockCategories);

      const res = await app.request('/api/categories');
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data).toEqual(mockCategories);
    });
  });
});

