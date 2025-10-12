import React from 'react';
import { Button } from '@/components/ui/button';
import { Scale } from 'lucide-react';
import { useVendorComparison } from '@/hooks/useVendorComparison';

interface ComparisonButtonProps {
  vendor: {
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
  };
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
}

export function ComparisonButton({ vendor, className = '', variant = 'outline' }: ComparisonButtonProps) {
  const { isInComparison, toggleComparison, isFull } = useVendorComparison();
  const isInList = isInComparison(vendor.id);

  const handleClick = () => {
    if (!isInList && isFull) {
      alert('You can only compare up to 4 vendors at a time. Please remove one first.');
      return;
    }
    toggleComparison(vendor);
  };

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={handleClick}
      className={`${className} ${isInList ? 'bg-blue-500 hover:bg-blue-600 text-white' : ''}`}
      disabled={!isInList && isFull}
    >
      <Scale className="h-4 w-4" />
      <span className="ml-2">
        {isInList ? 'Added to Compare' : 'Compare'}
      </span>
    </Button>
  );
}