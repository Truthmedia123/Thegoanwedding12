import { render } from '@testing-library/react';
import { Analytics } from '../Analytics';

// Mock Google Analytics
const mockGtag = jest.fn();
(global as any).gtag = mockGtag;

describe('Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Analytics />);
  });

  it('tracks page views', () => {
    render(<Analytics />);
    // Component should initialize GA tracking
    expect(mockGtag).toHaveBeenCalledWith('config', 'GA_TRACKING_ID', {
      page_title: document.title,
      page_location: window.location.href,
    });
  });

  it('tracks user interactions', () => {
    const { container } = render(<Analytics />);
    
    // Simulate a button click
    const button = document.createElement('button');
    button.setAttribute('data-analytics', 'click');
    button.setAttribute('data-analytics-category', 'engagement');
    button.setAttribute('data-analytics-action', 'button_click');
    button.setAttribute('data-analytics-label', 'test_button');
    
    container.appendChild(button);
    button.click();
    
    expect(mockGtag).toHaveBeenCalledWith('event', 'click', {
      event_category: 'engagement',
      event_action: 'button_click',
      event_label: 'test_button',
    });
  });
});

