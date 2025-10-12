import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminDashboard from '../AdminDashboard';

// Mock the necessary modules
jest.mock('wouter', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
  useLocation: () => [{}, jest.fn()],
}));

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));

jest.mock('@/components/ui/textarea', () => ({
  Textarea: (props: any) => <textarea {...props} />,
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children }: any) => <div>{children}</div>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children }: any) => <div>{children}</div>,
  SelectTrigger: ({ children }: any) => <div>{children}</div>,
  SelectValue: () => <div />,
}));

jest.mock('@/components/ui/table', () => ({
  Table: ({ children }: any) => <table>{children}</table>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableCell: ({ children }: any) => <td>{children}</td>,
  TableHead: ({ children }: any) => <th>{children}</th>,
  TableHeader: ({ children }: any) => <thead>{children}</thead>,
  TableRow: ({ children }: any) => <tr>{children}</tr>,
}));

// Mock PapaParse
jest.mock('papaparse', () => ({
  parse: jest.fn((data, options) => {
    if (options && options.header) {
      return {
        data: [
          {
            name: 'Test Vendor',
            category: 'Photography',
            description: 'Test description',
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
            gallery: '/image1.jpg,/image2.jpg',
            services: 'Wedding Photography,Pre-Wedding Shoot',
            priceRange: '₹50,000 - ₹1,00,000',
            featured: 'true',
            verified: 'true',
            facebookUrl: 'https://facebook.com/testvendor',
            instagramUrl: 'https://instagram.com/testvendor',
            linkedinUrl: 'https://linkedin.com/testvendor',
            twitterUrl: 'https://twitter.com/testvendor',
            embedCode: '<blockquote class="instagram-media">Test embed</blockquote>',
          }
        ],
        errors: [],
      };
    }
    return { data: [], errors: [] };
  }),
}));

// Mock fetch
global.fetch = jest.fn();

describe('AdminDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful API responses
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/api/vendors')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      if (url.includes('/api/categories')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: 1, name: 'Photography', slug: 'photography' },
            { id: 2, name: 'Catering', slug: 'catering' },
          ]),
        });
      }
      if (url.includes('/api/business-submissions')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });
  });

  it('renders admin dashboard with all sections', async () => {
    render(<AdminDashboard />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    // Check all main sections
    expect(screen.getByText('Vendor Management')).toBeInTheDocument();
    expect(screen.getByText('Business Submissions')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('handles manual vendor creation', async () => {
    render(<AdminDashboard />);

    // Wait for the form to be available
    await waitFor(() => {
      expect(screen.getByText('Add New Vendor')).toBeInTheDocument();
    });

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Vendor Name'), {
      target: { value: 'Test Vendor' },
    });
    
    fireEvent.change(screen.getByLabelText('Category'), {
      target: { value: 'Photography' },
    });
    
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Test vendor description' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Add Vendor'));

    // Wait for the API call
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/vendors'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  it('handles bulk vendor import', async () => {
    render(<AdminDashboard />);

    // Wait for the import section to be available
    await waitFor(() => {
      expect(screen.getByText('Bulk Import Vendors')).toBeInTheDocument();
    });

    // Simulate file upload
    const file = new File(['test,csv,data'], 'vendors.csv', { type: 'text/csv' });
    const fileInput = screen.getByLabelText('Choose CSV File');
    
    // Create a mock event
    const event = {
      target: {
        files: [file],
      },
    };
    
    fireEvent.change(fileInput, event);

    // Wait for parsing to complete
    await waitFor(() => {
      expect(screen.getByText('Preview')).toBeInTheDocument();
    });

    // Click import button
    fireEvent.click(screen.getByText('Import Vendors'));

    // Wait for the API call
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/vendors/bulk'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  it('displays business submissions', async () => {
    render(<AdminDashboard />);

    // Wait for submissions to load
    await waitFor(() => {
      expect(screen.getByText('Business Submissions')).toBeInTheDocument();
    });

    // Check that the submissions table is rendered
    expect(screen.getByText('No submissions found')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    // Mock error response
    (global.fetch as jest.Mock).mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ message: 'Internal server error' }),
      });
    });

    render(<AdminDashboard />);

    // Wait for error handling
    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });
  });
});