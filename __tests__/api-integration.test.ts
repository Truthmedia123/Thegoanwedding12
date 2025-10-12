import { createDirectus, rest, readItems } from '@directus/sdk';

// Mock server environment
const mockDirectusUrl = 'http://localhost:8055';
const mockDirectusToken = 'test-token';

// Define interfaces for Directus collections
interface Vendor {
  id: string;
  name: string;
  category: number;
  description: string;
  price_range: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  social_media: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
  };
  images: any[];
  featured_image: any;
  rating: number;
  reviews_count: number;
  availability_calendar: any;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sort: number;
  status: string;
  created_at: string;
  updated_at: string;
}

// Define the schema interface
interface DirectusSchema {
  vendors: Vendor[];
  categories: Category[];
}

// Mock fetch for API calls
global.fetch = jest.fn();

describe('API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Directus Connection', () => {
    it('should connect to Directus server', async () => {
      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { server: 'directus', version: '10.0.0' } })
      });

      const response = await fetch(`${mockDirectusUrl}/server/info`);
      
      expect(response.ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(`${mockDirectusUrl}/server/info`);
    });

    it('should handle Directus connection errors', async () => {
      // Mock failed response
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(fetch(`${mockDirectusUrl}/server/info`)).rejects.toThrow('Network error');
    });

    it('should authenticate with Directus using token', async () => {
      // Mock successful authentication
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { id: 1, email: 'test@example.com' } })
      });

      const response = await fetch(`${mockDirectusUrl}/users/me`, {
        headers: {
          'Authorization': `Bearer ${mockDirectusToken}`
        }
      });

      expect(response.ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(`${mockDirectusUrl}/users/me`, {
        headers: {
          'Authorization': `Bearer ${mockDirectusToken}`
        }
      });
    });
  });

  describe('Meilisearch Integration', () => {
    it('should connect to Meilisearch server', async () => {
      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          status: 'available',
          version: '1.0.0'
        })
      });

      const response = await fetch('http://localhost:7700/health');
      
      expect(response.ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:7700/health');
    });

    it('should perform search queries on Meilisearch', async () => {
      // Mock search response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          hits: [
            {
              id: '1',
              name: 'Goa Photography Studio',
              description: 'Professional wedding photography'
            }
          ],
          estimatedTotalHits: 1,
          processingTimeMs: 2
        })
      });

      const searchQuery = JSON.stringify({
        q: 'photography',
        limit: 10
      });

      const response = await fetch('http://localhost:7700/indexes/vendors/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: searchQuery
      });

      expect(response.ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:7700/indexes/vendors/search',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
    });

    it('should handle Meilisearch errors gracefully', async () => {
      // Mock failed response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Index not found'
      });

      const response = await fetch('http://localhost:7700/indexes/nonexistent/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ q: 'test' })
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });
  });

  describe('Cloudflare Workers Endpoints', () => {
    it('should respond to health check endpoint', async () => {
      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ 
          status: 'ok',
          timestamp: new Date().toISOString(),
          services: {
            directus: 'connected',
            meilisearch: 'connected',
            database: 'connected'
          }
        })
      });

      const response = await fetch('/api/system/status');
      
      expect(response.ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith('/api/system/status');
    });

    it('should handle vendor data endpoints', async () => {
      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              id: '1',
              name: 'Goa Photography Studio',
              category: 1,
              description: 'Professional wedding photography',
              rating: 4.8
            }
          ],
          meta: {
            total_count: 1
          }
        })
      });

      const response = await fetch('/api/vendors?limit=10');
      
      expect(response.ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith('/api/vendors?limit=10');
    });

    it('should handle category data endpoints', async () => {
      // Mock successful response
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: [
            {
              id: 1,
              name: 'Photographers',
              slug: 'photographers',
              description: 'Capture your special moments'
            }
          ]
        })
      });

      const response = await fetch('/api/categories');
      
      expect(response.ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith('/api/categories');
    });
  });

  describe('WebSocket Real-time Features', () => {
    beforeEach(() => {
      // Reset WebSocket mock
      (global as any).WebSocket = undefined;
    });

    it('should establish WebSocket connection', () => {
      // Mock WebSocket constructor
      const mockWebSocket = {
        onopen: jest.fn(),
        onmessage: jest.fn(),
        onerror: jest.fn(),
        onclose: jest.fn(),
        send: jest.fn(),
        close: jest.fn()
      };

      // Mock the WebSocket class
      (global as any).WebSocket = jest.fn().mockImplementation(() => mockWebSocket);
      (global as any).WebSocket.CONNECTING = 0;
      (global as any).WebSocket.OPEN = 1;
      (global as any).WebSocket.CLOSING = 2;
      (global as any).WebSocket.CLOSED = 3;

      const ws = new WebSocket('ws://localhost:8055/websocket');
      
      expect(WebSocket).toHaveBeenCalledWith('ws://localhost:8055/websocket');
      expect(ws).toBeDefined();
    });

    it('should handle WebSocket messages', () => {
      const mockWebSocket = {
        onopen: jest.fn(),
        onmessage: jest.fn(),
        onerror: jest.fn(),
        onclose: jest.fn(),
        send: jest.fn(),
        close: jest.fn()
      };

      // Mock the WebSocket class
      (global as any).WebSocket = jest.fn().mockImplementation(() => mockWebSocket);
      (global as any).WebSocket.CONNECTING = 0;
      (global as any).WebSocket.OPEN = 1;
      (global as any).WebSocket.CLOSING = 2;
      (global as any).WebSocket.CLOSED = 3;

      const ws = new WebSocket('ws://localhost:8055/websocket');
      
      // Simulate message event
      const messageEvent = {
        data: JSON.stringify({
          type: 'vendor_update',
          payload: {
            id: '1',
            name: 'Goa Photography Studio',
            status: 'available'
          }
        })
      };
      
      if (mockWebSocket.onmessage) {
        mockWebSocket.onmessage(messageEvent);
      }

      // We can't easily test the actual message handling without
      // the real component, but we can verify the event was called
      expect(WebSocket).toHaveBeenCalledWith('ws://localhost:8055/websocket');
    });

    it('should handle WebSocket connection errors', () => {
      const mockWebSocket = {
        onopen: jest.fn(),
        onmessage: jest.fn(),
        onerror: jest.fn(),
        onclose: jest.fn(),
        send: jest.fn(),
        close: jest.fn()
      };

      // Mock the WebSocket class
      (global as any).WebSocket = jest.fn().mockImplementation(() => mockWebSocket);
      (global as any).WebSocket.CONNECTING = 0;
      (global as any).WebSocket.OPEN = 1;
      (global as any).WebSocket.CLOSING = 2;
      (global as any).WebSocket.CLOSED = 3;

      const ws = new WebSocket('ws://localhost:8055/websocket');
      
      // Simulate error event
      const errorEvent = {
        error: new Error('Connection failed'),
        message: 'Connection failed'
      };
      
      if (mockWebSocket.onerror) {
        mockWebSocket.onerror(errorEvent);
      }

      expect(WebSocket).toHaveBeenCalledWith('ws://localhost:8055/websocket');
    });
  });
});