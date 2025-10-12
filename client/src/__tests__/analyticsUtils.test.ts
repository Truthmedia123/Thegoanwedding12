import { trackEvent, trackPageView, trackUserInteraction, trackPerformance, useAnalytics } from '../components/Performance/Analytics';

// Mock the window object
const mockUmami = jest.fn();

describe('Analytics Utilities', () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockUmami.mockReset();
    
    // Mock the window object
    Object.defineProperty(global, 'window', {
      value: {
        umami: mockUmami,
      },
      writable: true,
    });
  });

  describe('trackEvent', () => {
    it('should call umami with correct parameters', () => {
      trackEvent('test_event', { param: 'value' });
      
      expect(mockUmami).toHaveBeenCalledWith('test_event', { param: 'value' });
    });

    it('should not call umami if not available', () => {
      // Remove umami from window
      Object.defineProperty(global, 'window', {
        value: {},
        writable: true,
      });
      
      trackEvent('test_event');
      
      expect(mockUmami).not.toHaveBeenCalled();
    });
  });

  describe('trackPageView', () => {
    it('should track page view with url and referrer', () => {
      trackPageView('/test-page', 'https://example.com');
      
      expect(mockUmami).toHaveBeenCalledWith('pageview', { 
        url: '/test-page', 
        referrer: 'https://example.com' 
      });
    });
  });

  describe('trackUserInteraction', () => {
    it('should track user interaction event', () => {
      trackUserInteraction('button', 'click');
      
      expect(mockUmami).toHaveBeenCalledWith('user_interaction', { 
        element: 'button', 
        action: 'click' 
      });
    });
  });

  describe('trackPerformance', () => {
    it('should track performance metrics', () => {
      trackPerformance('load_time', 1200);
      
      expect(mockUmami).toHaveBeenCalledWith('performance_metric', { 
        metric: 'load_time', 
        value: 1200 
      });
    });
  });

  describe('useAnalytics', () => {
    it('should provide trackClick function', () => {
      const { trackClick } = useAnalytics();
      trackClick('test-button');
      
      expect(mockUmami).toHaveBeenCalledWith('user_interaction', {
        element: 'test-button',
        action: 'click',
      });
    });

    it('should provide trackView function', () => {
      const { trackView } = useAnalytics();
      trackView('/test-page');
      
      expect(mockUmami).toHaveBeenCalledWith('pageview', {
        url: '/test-page',
      });
    });

    it('should provide trackSearch function', () => {
      const { trackSearch } = useAnalytics();
      trackSearch('test query', 5);
      
      expect(mockUmami).toHaveBeenCalledWith('search', {
        query: 'test query',
        results: 5,
      });
    });

    it('should provide trackVendorView function', () => {
      const { trackVendorView } = useAnalytics();
      trackVendorView('vendor-123', 'Test Vendor');
      
      expect(mockUmami).toHaveBeenCalledWith('vendor_view', {
        vendorId: 'vendor-123',
        vendorName: 'Test Vendor',
      });
    });

    it('should provide trackWishlistAction function', () => {
      const { trackWishlistAction } = useAnalytics();
      
      trackWishlistAction('add', 'vendor-123');
      expect(mockUmami).toHaveBeenCalledWith('wishlist_add', {
        vendorId: 'vendor-123',
      });
      
      trackWishlistAction('remove', 'vendor-123');
      expect(mockUmami).toHaveBeenCalledWith('wishlist_remove', {
        vendorId: 'vendor-123',
      });
    });
  });
});