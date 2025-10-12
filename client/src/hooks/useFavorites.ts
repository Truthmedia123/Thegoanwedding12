import { useState, useEffect } from 'react';

interface FavoriteVendor {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  profileImage?: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteVendor[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vendorFavorites');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vendorFavorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const addFavorite = (vendor: FavoriteVendor) => {
    setFavorites(prev => {
      // Check if vendor is already in favorites
      if (prev.some(fav => fav.id === vendor.id)) {
        return prev;
      }
      return [...prev, vendor];
    });
  };

  const removeFavorite = (vendorId: string) => {
    setFavorites(prev => prev.filter(vendor => vendor.id !== vendorId));
  };

  const isFavorite = (vendorId: string) => {
    return favorites.some(vendor => vendor.id === vendorId);
  };

  const toggleFavorite = (vendor: FavoriteVendor) => {
    if (isFavorite(vendor.id)) {
      removeFavorite(vendor.id);
    } else {
      addFavorite(vendor);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite
  };
}