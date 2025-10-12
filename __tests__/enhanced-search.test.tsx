import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnhancedSearch from '../client/src/components/EnhancedSearch';

// Mock the Directus SDK
jest.mock('../client/src/lib/directus', () => ({
  searchVendors: jest.fn(),
  getCategories: jest.fn()
}));

// Mock Meilisearch
jest.mock('meilisearch', () => {
  return {
    MeiliSearch: jest.fn().mockImplementation(() => ({
      index: jest.fn().mockReturnValue({
        search: jest.fn().mockResolvedValue({
          hits: [
            {
              id: '1',
              name: 'Goa Photography Studio',
              description: 'Professional wedding photography',
              category: {
                name: 'Photographers',
                slug: 'photographers'
              },
              location: 'Calangute, North Goa',
              rating: 4.8
            }
          ],
          estimatedTotalHits: 1
        })
      })
    }))
  };
});

describe('EnhancedSearch', () => {
  const mockVendors = [
    {
      id: 1,
      name: 'Goa Photography Studio',
      description: 'Professional wedding photography',
      category: 1,
      location: 'Calangute, North Goa',
      rating: 4.8,
      reviews_count: 42,
      status: 'active'
    },
    {
      id: 2,
      name: 'Sunset Candid Shots',
      description: 'Award-winning photographers',
      category: 1,
      location: 'Baga, North Goa',
      rating: 4.9,
      reviews_count: 38,
      status: 'active'
    }
  ];

  const mockCategories = [
    {
      id: 1,
      name: 'Photographers',
      slug: 'photographers',
      description: 'Capture your special moments',
      icon: 'fas fa-camera',
      color: '#ec4899',
      sort: 1,
      status: 'published'
    },
    {
      id: 2,
      name: 'Venues',
      slug: 'venues',
      description: 'Beautiful locations for your wedding',
      icon: 'fas fa-umbrella-beach',
      color: '#8b5cf6',
      sort: 2,
      status: 'published'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (require('../client/src/lib/directus').searchVendors as jest.Mock).mockResolvedValue(mockVendors);
    (require('../client/src/lib/directus').searchCategories as jest.Mock).mockResolvedValue(mockCategories);
  });

  it('renders without crashing', () => {
    render(<EnhancedSearch />);

    expect(screen.getByPlaceholderText('Search for vendors (e.g., photographers, venues, caterers)...')).toBeInTheDocument();
  });

  it('displays search input and filters', () => {
    render(<EnhancedSearch />);

    expect(screen.getByPlaceholderText('Search for vendors (e.g., photographers, venues, caterers)...')).toBeInTheDocument();
    expect(screen.getByText('All Categories')).toBeInTheDocument();
    expect(screen.getByText('All Locations')).toBeInTheDocument();
  });

  it('performs search when typing', async () => {
    render(<EnhancedSearch />);

    const searchInput = screen.getByPlaceholderText('Search for vendors (e.g., photographers, venues, caterers)...');
    fireEvent.change(searchInput, { target: { value: 'photography' } });

    await waitFor(() => {
      expect(screen.getByText('Goa Photography Studio')).toBeInTheDocument();
    });
  });

  it('filters by category', async () => {
    render(<EnhancedSearch />);

    // Open category dropdown
    const categoryDropdown = screen.getByText('All Categories');
    fireEvent.click(categoryDropdown);

    // Select a category
    const photographerCategory = screen.getByText('Photographers');
    fireEvent.click(photographerCategory);

    await waitFor(() => {
      expect(screen.getByText('Goa Photography Studio')).toBeInTheDocument();
    });
  });

  it('shows autocomplete suggestions', async () => {
    render(<EnhancedSearch />);

    const searchInput = screen.getByPlaceholderText('Search for vendors (e.g., photographers, venues, caterers)...');
    fireEvent.change(searchInput, { target: { value: 'goa' } });

    await waitFor(() => {
      // Check for autocomplete suggestions
      expect(screen.getByText('Goa Photography Studio')).toBeInTheDocument();
    });
  });

  it('handles search errors gracefully', async () => {
    (require('../client/src/lib/directus').searchVendors as jest.Mock).mockRejectedValue(new Error('Search failed'));

    render(<EnhancedSearch />);

    const searchInput = screen.getByPlaceholderText('Search for vendors (e.g., photographers, venues, caterers)...');
    fireEvent.change(searchInput, { target: { value: 'photography' } });

    await waitFor(() => {
      expect(screen.getByText('No vendors found matching your criteria.')).toBeInTheDocument();
    });
  });

  it('displays vendor results correctly', async () => {
    render(<EnhancedSearch />);

    const searchInput = screen.getByPlaceholderText('Search for vendors (e.g., photographers, venues, caterers)...');
    fireEvent.change(searchInput, { target: { value: 'photography' } });

    await waitFor(() => {
      expect(screen.getByText('Goa Photography Studio')).toBeInTheDocument();
      expect(screen.getByText('Professional wedding photography')).toBeInTheDocument();
      expect(screen.getByText('4.8')).toBeInTheDocument();
    });
  });

  it('handles empty search results', async () => {
    (require('../client/src/lib/directus').searchVendors as jest.Mock).mockResolvedValue([]);

    render(<EnhancedSearch />);

    const searchInput = screen.getByPlaceholderText('Search for vendors (e.g., photographers, venues, caterers)...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await waitFor(() => {
      expect(screen.getByText('No vendors found matching your criteria.')).toBeInTheDocument();
    });
  });
});