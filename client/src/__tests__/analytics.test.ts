import { trackEvent, trackPageView, trackUserInteraction, trackPerformance } from '../components/Performance/Analytics';

// Mock the window object
const mockUmami = jest.fn();
const mockWindow = {
  umami: mockUmami,
} as any;

describe('Analytics', () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockUmami.mockReset();
    
    // Mock the window object
    Object.defineProperty(global, 'window', {
      value: mockWindow,
      writable: true,
    });
  });

  describe('trackEvent', () => {
    it('should call umami with the correct parameters', () => {
      const eventName = 'test_event';
      const data = { test: 'data' };
      
      trackEvent(eventName, data);
      
      expect(mockUmami).toHaveBeenCalledWith(eventName, data);
    });

    it('should not throw an error if umami is not defined', () => {
      // Remove umami from window
      delete (global as any).window.umami;
      
      expect(() => {
        trackEvent('test_event');
      }).not.toThrow();
    });
  });

  describe('trackPageView', () => {
    it('should call umami with pageview event', () => {
      const url = '/test-page';
      const referrer = 'https://example.com';
      
      trackPageView(url, referrer);
      
      expect(mockUmami).toHaveBeenCalledWith('pageview', { url, referrer });
    });
  });

  describe('trackUserInteraction', () => {
    it('should call umami with user_interaction event', () => {
      const element = 'button';
      const action = 'click';
      
      trackUserInteraction(element, action);
      
      expect(mockUmami).toHaveBeenCalledWith('user_interaction', { element, action });
    });
  });

  describe('trackPerformance', () => {
    it('should call umami with performance_metric event', () => {
      const metric = 'load_time';
      const value = 123;
      
      trackPerformance(metric, value);
      
      expect(mockUmami).toHaveBeenCalledWith('performance_metric', { metric, value });
    });
  });
});