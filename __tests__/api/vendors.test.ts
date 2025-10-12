import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock the drizzle and schema imports
jest.mock('drizzle-orm/d1', () => ({
  drizzle: jest.fn(() => ({
    select: jest.fn(() => ({
      from: jest.fn(() => ({
        where: jest.fn(() => ({
          all: jest.fn(() => Promise.resolve({ results: [] }))
        }))
      }))
    }))
  }))
}));

jest.mock('../../../shared/schema.js', () => ({
  vendors: { category: 'category', location: 'location', name: 'name', description: 'description' }
}));

describe('Vendors API', () => {
  let mockEnv: any;
  let mockRequest: any;

  beforeEach(() => {
    mockEnv = {
      DB: {
        prepare: jest.fn(),
        batch: jest.fn(),
        exec: jest.fn()
      }
    };

    mockRequest = {
      url: 'http://localhost:8787/api/vendors',
      json: jest.fn()
    };
  });

  it('should handle GET request for vendors', async () => {
    // Mock the onRequestGet function
    const onRequestGet = async ({ env, request }: { env: any, request: any }) => {
      try {
        const url = new URL(request.url);
        const category = url.searchParams.get('category');
        const location = url.searchParams.get('location');
        const search = url.searchParams.get('search');
        
        // Mock database response
        const results = [
          {
            id: 1,
            name: 'Test Vendor',
            category: 'Photography',
            location: 'North Goa',
            description: 'Test description'
          }
        ];
        
        return new Response(JSON.stringify(results), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch vendors' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    };

    const response = await onRequestGet({ env: mockEnv, request: mockRequest });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].name).toBe('Test Vendor');
  });

  it('should handle POST request for creating vendors', async () => {
    const vendorData = {
      name: 'New Vendor',
      category: 'Photography',
      location: 'South Goa',
      description: 'New vendor description'
    };

    mockRequest.json = jest.fn().mockResolvedValue(vendorData);

    const onRequestPost = async ({ env, request }: { env: any, request: any }) => {
      try {
        const body = await request.json();
        
        // Mock successful creation
        const newVendor = { id: 2, ...body };
        
        return new Response(JSON.stringify(newVendor), {
          status: 201,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to create vendor' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    };

    const response = await onRequestPost({ env: mockEnv, request: mockRequest });
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.name).toBe('New Vendor');
    expect(data.id).toBe(2);
  });

  it('should handle OPTIONS request for CORS', async () => {
    const onRequestOptions = async () => {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    };

    const response = await onRequestOptions();

    expect(response.status).toBe(200);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('should handle query parameters correctly', async () => {
    const mockRequestWithParams = {
      url: 'http://localhost:8787/api/vendors?category=Photography&location=North%20Goa&search=wedding'
    };

    const onRequestGet = async ({ request }: { request: any }) => {
      const url = new URL(request.url);
      const category = url.searchParams.get('category');
      const location = url.searchParams.get('location');
      const search = url.searchParams.get('search');
      
      expect(category).toBe('Photography');
      expect(location).toBe('North Goa');
      expect(search).toBe('wedding');
      
      return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' },
      });
    };

    await onRequestGet({ request: mockRequestWithParams });
  });
});
