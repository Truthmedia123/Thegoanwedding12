import { getVendors, getCategories, searchVendors } from '../lib/directus';

// Mock the directus client
jest.mock('../lib/directus', () => {
  const actual = jest.requireActual('../lib/directus');
  return {
    ...actual,
    directus: {
      request: jest.fn()
    }
  };
});

const { directus } = require('../lib/directus');

describe('Directus API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getVendors', () => {
    it('should fetch vendors with correct parameters', async () => {
      const mockVendors = [
        { id: '1', name: 'Test Vendor', status: 'active' },
        { id: '2', name: 'Another Vendor', status: 'active' }
      ];
      
      (directus.request as jest.Mock).mockResolvedValue(mockVendors);
      
      const result = await getVendors(10, 0);
      
      expect(directus.request).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          offset: 0,
          filter: { status: { _eq: 'active' } },
          sort: ['-created_at']
        })
      );
      expect(result).toEqual(mockVendors);
    });

    it('should handle errors when fetching vendors', async () => {
      (directus.request as jest.Mock).mockRejectedValue(new Error('API Error'));
      
      await expect(getVendors()).rejects.toThrow('Failed to fetch vendors');
    });
  });

  describe('getCategories', () => {
    it('should fetch categories with correct parameters', async () => {
      const mockCategories = [
        { id: 1, name: 'Photographers', status: 'published' },
        { id: 2, name: 'Venues', status: 'published' }
      ];
      
      (directus.request as jest.Mock).mockResolvedValue(mockCategories);
      
      const result = await getCategories();
      
      expect(directus.request).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: { status: { _eq: 'published' } },
          sort: ['sort']
        })
      );
      expect(result).toEqual(mockCategories);
    });

    it('should handle errors when fetching categories', async () => {
      (directus.request as jest.Mock).mockRejectedValue(new Error('API Error'));
      
      await expect(getCategories()).rejects.toThrow('Failed to fetch categories');
    });
  });

  describe('searchVendors', () => {
    it('should search vendors with query and filters', async () => {
      const mockVendors = [
        { id: '1', name: 'Test Vendor', description: 'A test vendor' }
      ];
      
      (directus.request as jest.Mock).mockResolvedValue(mockVendors);
      
      const result = await searchVendors('test', { location: 'North Goa' });
      
      expect(directus.request).toHaveBeenCalledWith(
        expect.objectContaining({
          filter: {
            _or: [
              { name: { _contains: 'test' } },
              { description: { _contains: 'test' } }
            ],
            status: { _eq: 'active' },
            location: { _eq: 'North Goa' }
          },
          sort: ['-rating']
        })
      );
      expect(result).toEqual(mockVendors);
    });
  });
});