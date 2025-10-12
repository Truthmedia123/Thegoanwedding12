import { useState, useEffect } from 'react';

interface RecentlyViewedVendor {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  profileImage?: string;
  viewedAt: number; // timestamp
}

export function useRecentlyViewed(maxItems: number = 10) {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedVendor[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentlyViewedVendors');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('recentlyViewedVendors', JSON.stringify(recentlyViewed));
    }
  }, [recentlyViewed]);

  const addViewedVendor = (vendor: Omit<RecentlyViewedVendor, 'viewedAt'>) => {
    setRecentlyViewed(prev => {
      // Remove if already exists
      const filtered = prev.filter(item => item.id !== vendor.id);
      // Add to the beginning with current timestamp
      const newItem = {
        ...vendor,
        viewedAt: Date.now()
      };
      // Limit to maxItems
      const updated = [newItem, ...filtered];
      return updated.slice(0, maxItems);
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
  };

  // Get recently viewed vendors sorted by viewedAt (newest first)
  const getRecentlyViewed = () => {
    return [...recentlyViewed].sort((a, b) => b.viewedAt - a.viewedAt);
  };

  return {
    recentlyViewed: getRecentlyViewed(),
    addViewedVendor,
    clearRecentlyViewed
  };
}