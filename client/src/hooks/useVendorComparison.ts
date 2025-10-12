import { useState, useEffect } from 'react';

interface ComparableVendor {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  priceRange?: string;
  profileImage?: string;
  description: string;
  services?: string[];
  verified: boolean;
}

export function useVendorComparison(maxItems: number = 4) {
  const [comparisonList, setComparisonList] = useState<ComparableVendor[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vendorComparison');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vendorComparison', JSON.stringify(comparisonList));
    }
  }, [comparisonList]);

  const addToComparison = (vendor: ComparableVendor) => {
    setComparisonList(prev => {
      // Check if vendor is already in comparison
      if (prev.some(item => item.id === vendor.id)) {
        return prev;
      }
      // Limit to maxItems
      if (prev.length >= maxItems) {
        return prev;
      }
      return [...prev, vendor];
    });
  };

  const removeFromComparison = (vendorId: string) => {
    setComparisonList(prev => prev.filter(vendor => vendor.id !== vendorId));
  };

  const isInComparison = (vendorId: string) => {
    return comparisonList.some(vendor => vendor.id === vendorId);
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  const toggleComparison = (vendor: ComparableVendor) => {
    if (isInComparison(vendor.id)) {
      removeFromComparison(vendor.id);
    } else {
      addToComparison(vendor);
    }
  };

  return {
    comparisonList,
    addToComparison,
    removeFromComparison,
    isInComparison,
    clearComparison,
    toggleComparison,
    isFull: comparisonList.length >= maxItems
  };
}