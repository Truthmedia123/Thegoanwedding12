import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  vendor: {
    id: string;
    name: string;
    category: string;
    location: string;
    rating: number;
    profileImage?: string;
  };
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
}

export function FavoriteButton({ vendor, className = '', variant = 'outline' }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFavorited = isFavorite(vendor.id);

  const handleClick = () => {
    toggleFavorite(vendor);
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleClick}
      className={`${className} ${isFavorited ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
    >
      <Heart 
        className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} 
      />
      <span className="ml-2">
        {isFavorited ? 'Saved' : 'Save'}
      </span>
    </Button>
  );
}