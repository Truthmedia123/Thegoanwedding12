import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VendorProfile from '../VendorProfile';

// Mock wouter
jest.mock('wouter', () => ({
  useParams: () => ({ id: '1' }),
}));

// Mock use-toast
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Mock react-query
const mockVendor = {
  id: 1,
  name: 'Test Vendor',
  category: 'Photography',
  description: 'Test vendor description',
  phone: '+919876543210',
  email: 'test@example.com',
  whatsapp: '+919876543210',
  location: 'Goa',
  address: '123 Test Street',
  website: 'https://testvendor.com',
  instagram: 'testvendor',
  youtube: 'testvendor',
  facebook: 'testvendor',
  profileImage: '/test-profile.jpg',
  coverImage: '/test-cover.jpg',
  gallery: ['/image1.jpg', '/image2.jpg'],
  services: ['Wedding Photography', 'Pre-Wedding Shoot'],
  priceRange: '₹50,000 - ₹1,00,000',
  featured: true,
  verified: true,
  rating: 4.5,
  reviewCount: 12,
  embedCode: '<blockquote class="instagram-media">Test embed</blockquote>',
};

const mockReviews = [
  {
    id: 1,
    vendorId: 1,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    rating: 5,
    comment: 'Excellent service!',
    createdAt: new Date().toISOString(),
  },
];

// Create a wrapper component with QueryClient
const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
      },
    },
  });
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const testQueryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={testQueryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Mock fetch API
global.fetch = jest.fn();

describe('VendorProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful API responses
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/api/vendors/1')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockVendor),
        });
      }
      if (url.includes('/api/vendors/1/reviews')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockReviews),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });
  });

  it('renders vendor profile with all information', async () => {
    render(
      <TestWrapper>
        <VendorProfile />
      </TestWrapper>
    );

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test Vendor')).toBeInTheDocument();
    });

    // Check vendor details
    expect(screen.getByText('Photography')).toBeInTheDocument();
    expect(screen.getByText('Test vendor description')).toBeInTheDocument();
    expect(screen.getByText('Goa')).toBeInTheDocument();
    expect(screen.getByText('123 Test Street')).toBeInTheDocument();
    
    // Check services
    expect(screen.getByText('Wedding Photography')).toBeInTheDocument();
    expect(screen.getByText('Pre-Wedding Shoot')).toBeInTheDocument();
    
    // Check price range
    expect(screen.getByText('₹50,000 - ₹1,00,000')).toBeInTheDocument();
    
    // Check rating
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('(12 reviews)')).toBeInTheDocument();
    
    // Check social media links
    expect(screen.getByText('View Instagram Profile')).toBeInTheDocument();
    expect(screen.getByText('View YouTube Channel')).toBeInTheDocument();
  });

  it('displays vendor gallery when available', async () => {
    render(
      <TestWrapper>
        <VendorProfile />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Gallery')).toBeInTheDocument();
    });

    expect(screen.getByAltText('Test Vendor gallery 1')).toBeInTheDocument();
    expect(screen.getByAltText('Test Vendor gallery 2')).toBeInTheDocument();
  });

  it('displays social media embeds when available', async () => {
    render(
      <TestWrapper>
        <VendorProfile />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Social Media Content')).toBeInTheDocument();
    });

    const embedContainer = screen.getByText('Test embed');
    expect(embedContainer).toBeInTheDocument();
  });

  it('displays reviews section', async () => {
    render(
      <TestWrapper>
        <VendorProfile />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Reviews & Ratings')).toBeInTheDocument();
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Excellent service!')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    // Mock loading state
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    render(
      <TestWrapper>
        <VendorProfile />
      </TestWrapper>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('handles vendor not found', async () => {
    // Mock 404 response
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/api/vendors/1')) {
        return Promise.resolve({
          ok: false,
          status: 404,
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });

    render(
      <TestWrapper>
        <VendorProfile />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Vendor Not Found')).toBeInTheDocument();
    });
  });
});