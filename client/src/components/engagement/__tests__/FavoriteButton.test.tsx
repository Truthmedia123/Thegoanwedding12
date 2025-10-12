import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { FavoriteButton } from '../FavoriteButton';

// Mock the useFavorites hook
jest.mock('@/hooks/useFavorites', () => ({
  useFavorites: () => ({
    isFavorite: jest.fn().mockReturnValue(false),
    toggleFavorite: jest.fn(),
  }),
}));

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, variant }: any) => (
    <button onClick={onClick} className={className} data-variant={variant}>
      {children}
    </button>
  ),
}));

describe('FavoriteButton', () => {
  const mockVendor = {
    id: '1',
    name: 'Test Vendor',
    category: 'Photography',
    location: 'Goa',
    rating: 4.5,
    profileImage: '/test-profile.jpg',
  };

  it('renders favorite button with correct text when not favorited', () => {
    render(<FavoriteButton vendor={mockVendor} />);

    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('outline');
  });

  it('renders favorite button with correct text when favorited', () => {
    // Mock the hook to return true for isFavorite
    const useFavoritesMock = require('@/hooks/useFavorites');
    useFavoritesMock.useFavorites.mockReturnValue({
      isFavorite: jest.fn().mockReturnValue(true),
      toggleFavorite: jest.fn(),
    });

    render(<FavoriteButton vendor={mockVendor} />);

    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('bg-red-500');
  });

  it('calls toggleFavorite when clicked', () => {
    const toggleFavoriteMock = jest.fn();
    
    // Mock the hook to return our mock function
    const useFavoritesMock = require('@/hooks/useFavorites');
    useFavoritesMock.useFavorites.mockReturnValue({
      isFavorite: jest.fn().mockReturnValue(false),
      toggleFavorite: toggleFavoriteMock,
    });

    render(<FavoriteButton vendor={mockVendor} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(toggleFavoriteMock).toHaveBeenCalledWith(mockVendor);
  });

  it('applies custom className and variant', () => {
    render(<FavoriteButton vendor={mockVendor} className="custom-class" variant="secondary" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveAttribute('data-variant', 'secondary');
  });
});