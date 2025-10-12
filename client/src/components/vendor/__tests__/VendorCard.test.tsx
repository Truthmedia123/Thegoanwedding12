import React from 'react';
import { render, screen } from '@testing-library/react';
import SimplifiedVendorCard from '../SimplifiedVendorCard';

// Mock the necessary modules
jest.mock('wouter', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
  CardContent: ({ children, ...props }: any) => (
    <div {...props}>{children}</div>
  ),
}));

describe('SimplifiedVendorCard', () => {
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
    gallery: '/image1.jpg,/image2.jpg',
    services: '["Wedding Photography","Pre-Wedding Shoot"]',
    priceRange: '₹50,000 - ₹1,00,000',
    featured: true,
    verified: true,
    rating: 4.5,
    reviewCount: 12,
    createdAt: new Date(),
    facebookUrl: 'https://facebook.com/testvendor',
    instagramUrl: 'https://instagram.com/testvendor',
    linkedinUrl: 'https://linkedin.com/testvendor',
    twitterUrl: 'https://twitter.com/testvendor',
    embedCode: '<blockquote class="instagram-media">Test embed</blockquote>',
  };

  it('renders vendor card with all information', () => {
    render(<SimplifiedVendorCard vendor={mockVendor as any} />);

    expect(screen.getByText('Test Vendor')).toBeInTheDocument();
    expect(screen.getByText('Goa')).toBeInTheDocument();
    expect(screen.getByAltText('Test Vendor')).toBeInTheDocument();
  });

  it('handles missing profile image', () => {
    const vendorWithoutImage = {
      ...mockVendor,
      profileImage: undefined,
    };

    render(<SimplifiedVendorCard vendor={vendorWithoutImage as any} />);

    expect(screen.getByText('Test Vendor')).toBeInTheDocument();
    expect(screen.getByText('Goa')).toBeInTheDocument();
  });

  it('renders vendor link correctly', () => {
    render(<SimplifiedVendorCard vendor={mockVendor as any} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/vendor/1');
  });
});