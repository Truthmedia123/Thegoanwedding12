import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WishlistButton, WishlistPage, useWishlist } from '../Wishlist';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Mock vendor data
const mockVendor = {
  id: 1,
  name: 'Test Photographer',
  category: 'Photography',
  location: 'Goa',
  rating: 4.5,
  profileImage: '/test-image.jpg',
};

describe('WishlistButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('[]');
  });

  it('renders wishlist button', () => {
    render(<WishlistButton vendor={mockVendor} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows heart outline when vendor is not in wishlist', () => {
    render(<WishlistButton vendor={mockVendor} />);
    // The heart icon should be present (HeartOff component)
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('adds vendor to wishlist when clicked', async () => {
    render(<WishlistButton vendor={mockVendor} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'wedding-wishlist',
        JSON.stringify([mockVendor])
      );
    });
  });

  it('removes vendor from wishlist when clicked again', async () => {
    // Mock that vendor is already in wishlist
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockVendor]));
    
    render(<WishlistButton vendor={mockVendor} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'wedding-wishlist',
        JSON.stringify([])
      );
    });
  });
});

describe('WishlistPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows empty state when no vendors in wishlist', () => {
    mockLocalStorage.getItem.mockReturnValue('[]');
    
    render(<WishlistPage />);
    
    expect(screen.getByText('Your wishlist is empty')).toBeInTheDocument();
    expect(screen.getByText('Browse Vendors')).toBeInTheDocument();
  });

  it('displays vendors in wishlist', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockVendor]));
    
    render(<WishlistPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Photographer')).toBeInTheDocument();
      expect(screen.getByText('Photography')).toBeInTheDocument();
      expect(screen.getByText('Goa')).toBeInTheDocument();
    });
  });

  it('removes vendor from wishlist when delete button is clicked', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockVendor]));
    
    render(<WishlistPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Photographer')).toBeInTheDocument();
    });
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'wedding-wishlist',
        JSON.stringify([])
      );
    });
  });

  it('clears all vendors when clear all button is clicked', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockVendor]));
    
    render(<WishlistPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Photographer')).toBeInTheDocument();
    });
    
    const clearButton = screen.getByText('Clear All');
    fireEvent.click(clearButton);
    
    await waitFor(() => {
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('wedding-wishlist');
    });
  });
});

describe('useWishlist hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads wishlist from localStorage', () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockVendor]));
    
    const TestComponent = () => {
      const { wishlist } = useWishlist();
      return <div>{wishlist.length}</div>;
    };
    
    render(<TestComponent />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('handles empty wishlist', () => {
    mockLocalStorage.getItem.mockReturnValue('[]');
    
    const TestComponent = () => {
      const { wishlist } = useWishlist();
      return <div>{wishlist.length}</div>;
    };
    
    render(<TestComponent />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles localStorage errors gracefully', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    
    const TestComponent = () => {
      const { wishlist } = useWishlist();
      return <div>{wishlist.length}</div>;
    };
    
    render(<TestComponent />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});