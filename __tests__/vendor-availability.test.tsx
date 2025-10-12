import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VendorAvailabilityTracker from '../client/src/components/VendorAvailabilityTracker';

// Mock the Directus SDK
jest.mock('../client/src/lib/directus', () => ({
  getVendors: jest.fn()
}));

describe('VendorAvailabilityTracker', () => {
  const mockVendors = [
    {
      id: '1',
      name: 'Goa Photography Studio',
      category: 1,
      description: 'Professional wedding photography',
      price_range: '₹50,000 - ₹1,50,000',
      location: 'Calangute, North Goa',
      phone: '+91 98765 43210',
      email: 'info@goaphotostudio.com',
      website: 'https://goaphotostudio.com',
      social_media: {
        facebook: 'GoaPhotographyStudio',
        instagram: '@goaphotostudio',
        linkedin: '',
        twitter: ''
      },
      images: [],
      featured_image: null,
      rating: 4.8,
      reviews_count: 42,
      availability_calendar: null,
      status: 'active',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Sunset Candid Shots',
      category: 1,
      description: 'Award-winning photographers',
      price_range: '₹75,000 - ₹2,00,000',
      location: 'Baga, North Goa',
      phone: '+91 98765 43211',
      email: 'hello@sunsetcandid.com',
      website: 'https://sunsetcandid.com',
      social_media: {
        facebook: 'SunsetCandidShots',
        instagram: '@sunsetcandid',
        linkedin: '',
        twitter: ''
      },
      images: [],
      featured_image: null,
      rating: 4.9,
      reviews_count: 38,
      availability_calendar: null,
      status: 'active',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (require('../client/src/lib/directus').getVendors as jest.Mock).mockResolvedValue(mockVendors);
  });

  it('renders without crashing', async () => {
    render(<VendorAvailabilityTracker />);
    
    expect(screen.getByText('Loading vendors...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Vendor Availability')).toBeInTheDocument();
    });
  });

  it('displays vendor list', async () => {
    render(<VendorAvailabilityTracker />);
    
    await waitFor(() => {
      expect(screen.getByText('Goa Photography Studio')).toBeInTheDocument();
      expect(screen.getByText('Sunset Candid Shots')).toBeInTheDocument();
    });
  });

  it('displays vendor details correctly', async () => {
    render(<VendorAvailabilityTracker />);
    
    await waitFor(() => {
      expect(screen.getByText('Goa Photography Studio')).toBeInTheDocument();
      expect(screen.getByText('Professional wedding photography')).toBeInTheDocument();
      expect(screen.getByText('Calangute, North Goa')).toBeInTheDocument();
      expect(screen.getByText('4.8')).toBeInTheDocument();
    });
  });

  it('handles loading state', () => {
    // Reset the mock to delay resolution
    (require('../client/src/lib/directus').getVendors as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockVendors), 100))
    );
    
    render(<VendorAvailabilityTracker />);
    
    expect(screen.getByText('Loading vendors...')).toBeInTheDocument();
  });

  it('handles empty vendor list', async () => {
    (require('../client/src/lib/directus').getVendors as jest.Mock).mockResolvedValue([]);
    
    render(<VendorAvailabilityTracker />);
    
    await waitFor(() => {
      expect(screen.getByText('No vendors available at the moment.')).toBeInTheDocument();
    });
  });

  it('handles vendor data fetch error', async () => {
    (require('../client/src/lib/directus').getVendors as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch vendors')
    );
    
    render(<VendorAvailabilityTracker />);
    
    await waitFor(() => {
      expect(screen.getByText('Error loading vendors. Please try again later.')).toBeInTheDocument();
    });
  });

  it('displays vendor status indicators', async () => {
    render(<VendorAvailabilityTracker />);
    
    await waitFor(() => {
      const statusIndicators = screen.getAllByTestId('vendor-status');
      expect(statusIndicators).toHaveLength(2);
    });
  });

  it('refreshes vendor data periodically', async () => {
    jest.useFakeTimers();
    
    render(<VendorAvailabilityTracker />);
    
    await waitFor(() => {
      expect(screen.getByText('Goa Photography Studio')).toBeInTheDocument();
    });
    
    // Advance timers by 30 seconds (polling interval)
    jest.advanceTimersByTime(30000);
    
    // Check that getVendors was called again
    expect(require('../client/src/lib/directus').getVendors).toHaveBeenCalledTimes(2);
    
    jest.useRealTimers();
  });
});