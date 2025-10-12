import { renderHook } from '@testing-library/react';
import { useAnalytics } from '../components/Performance/Analytics';

// Mock the window object
const mockUmami = jest.fn();
const mockWindow = {
  umami: mockUmami,
} as any;

describe('useAnalytics', () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockUmami.mockReset();
    
    // Mock the window object
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true,
    });
  });

  it('should provide trackClick function', () => {
    const { result } = renderHook(() => useAnalytics());
    
    result.current.trackClick('test-button');
    
    expect(mockUmami).toHaveBeenCalledWith('user_interaction', {
      element: 'test-button',
      action: 'click',
    });
  });

  it('should provide trackView function', () => {
    const { result } = renderHook(() => useAnalytics());
    
    result.current.trackView('/test-page');
    
    expect(mockUmami).toHaveBeenCalledWith('pageview', {
      url: '/test-page',
    });
  });

  it('should provide trackSearch function', () => {
    const { result } = renderHook(() => useAnalytics());
    
    result.current.trackSearch('test query', 5);
    
    expect(mockUmami).toHaveBeenCalledWith('search', {
      query: 'test query',
      results: 5,
    });
  });

  it('should provide trackVendorView function', () => {
    const { result } = renderHook(() => useAnalytics());
    
    result.current.trackVendorView('vendor-123', 'Test Vendor');
    
    expect(mockUmami).toHaveBeenCalledWith('vendor_view', {
      vendorId: 'vendor-123',
      vendorName: 'Test Vendor',
    });
  });

  it('should provide trackWishlistAction function', () => {
    const { result } = renderHook(() => useAnalytics());
    
    result.current.trackWishlistAction('add', 'vendor-123');
    
    expect(mockUmami).toHaveBeenCalledWith('wishlist_add', {
      vendorId: 'vendor-123',
    });
    
    // Test remove action
    result.current.trackWishlistAction('remove', 'vendor-123');
    
    expect(mockUmami).toHaveBeenCalledWith('wishlist_remove', {
      vendorId: 'vendor-123',
    });
  });
});