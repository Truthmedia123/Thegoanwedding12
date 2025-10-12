import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from '../Home';

// Mock wouter
jest.mock('wouter', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  CardContent: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  CardHeader: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  CardTitle: ({ children, ...props }: any) => (
    <h3 {...props}>{children}</h3>
  ),
}));

// Mock other components
jest.mock('@/components/search/SearchBar', () => () => (
  <div data-testid="search-bar">Search Bar</div>
));

jest.mock('@/components/vendor/CategoryGrid', () => () => (
  <div data-testid="category-grid">Category Grid</div>
));

jest.mock('@/components/vendor/SimplifiedVendorCard', () => ({ vendor }: any) => (
  <div data-testid="vendor-card">{vendor.name}</div>
));

jest.mock('@/components/vendor/TestimonialSlider', () => () => (
  <div data-testid="testimonial-slider">Testimonial Slider</div>
));

jest.mock('@/components/engagement/NewsletterSignup', () => () => (
  <div data-testid="newsletter-signup">Newsletter Signup</div>
));

// Mock data
const mockVendors = [
  {
    id: 1,
    name: 'Featured Vendor 1',
    category: 'Photography',
    location: 'Goa',
    rating: 4.5,
    profileImage: '/vendor1.jpg',
  },
  {
    id: 2,
    name: 'Featured Vendor 2',
    category: 'Catering',
    location: 'Mumbai',
    rating: 4.8,
    profileImage: '/vendor2.jpg',
  },
];

const mockBlogPosts = [
  {
    id: 1,
    title: 'Wedding Planning Tips',
    slug: 'wedding-planning-tips',
    excerpt: 'Essential tips for planning your perfect wedding',
    featuredImage: '/blog1.jpg',
    category: 'Planning',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Goan Wedding Traditions',
    slug: 'goan-wedding-traditions',
    excerpt: 'Explore the rich traditions of Goan weddings',
    featuredImage: '/blog2.jpg',
    category: 'Traditions',
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

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful API responses
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/api/vendors/featured')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockVendors),
        });
      }
      if (url.includes('/api/blog')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockBlogPosts),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });
  });

  it('renders home page with all sections', async () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    // Check hero section
    expect(screen.getByText('Where Dreams Come True')).toBeInTheDocument();
    expect(screen.getByText('Celebrate Your')).toBeInTheDocument();
    expect(screen.getByText('Perfect Day')).toBeInTheDocument();
    expect(screen.getByText('Goan Style')).toBeInTheDocument();

    // Check trust indicators
    expect(screen.getByText('500+')).toBeInTheDocument();
    expect(screen.getByText('Trusted Vendors')).toBeInTheDocument();
    expect(screen.getByText('1000+')).toBeInTheDocument();
    expect(screen.getByText('Happy Couples')).toBeInTheDocument();

    // Wait for dynamic content
    await waitFor(() => {
      expect(screen.getByText('Featured Vendor 1')).toBeInTheDocument();
    });

    // Check featured vendors section
    expect(screen.getByText('Premium Selection')).toBeInTheDocument();
    expect(screen.getByText('Featured Vendors')).toBeInTheDocument();
    expect(screen.getByText('Featured Vendor 1')).toBeInTheDocument();
    expect(screen.getByText('Featured Vendor 2')).toBeInTheDocument();

    // Check blog preview section
    expect(screen.getByText('Wedding Inspiration & Tips')).toBeInTheDocument();
    expect(screen.getByText('Wedding Planning Tips')).toBeInTheDocument();
    expect(screen.getByText('Essential tips for planning your perfect wedding')).toBeInTheDocument();
    expect(screen.getByText('Goan Wedding Traditions')).toBeInTheDocument();
    expect(screen.getByText('Explore the rich traditions of Goan weddings')).toBeInTheDocument();
  });

  it('displays loading states', () => {
    // Mock loading state
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    expect(screen.getByText('Loading featured vendors...')).toBeInTheDocument();
    expect(screen.getByText('Loading blog posts...')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    // Mock error responses
    (global.fetch as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        status: 500,
      });
    });

    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    // Should still render static content even with API errors
    expect(screen.getByText('Where Dreams Come True')).toBeInTheDocument();
    expect(screen.getByText('Celebrate Your')).toBeInTheDocument();
  });

  it('renders all components', async () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    // Wait for components to render
    await waitFor(() => {
      expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    });

    expect(screen.getByTestId('category-grid')).toBeInTheDocument();
    expect(screen.getByTestId('testimonial-slider')).toBeInTheDocument();
    expect(screen.getByTestId('newsletter-signup')).toBeInTheDocument();
  });
});