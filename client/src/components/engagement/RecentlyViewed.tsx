import React from 'react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import VendorCard from '@/components/vendor/VendorCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface RecentlyViewedProps {
  maxItems?: number;
}

export function RecentlyViewed({ maxItems = 6 }: RecentlyViewedProps) {
  const { recentlyViewed } = useRecentlyViewed(maxItems);

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently Viewed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentlyViewed.slice(0, maxItems).map((vendor) => (
            <div key={vendor.id} className="max-w-xs">
              <VendorCard vendor={vendor as any} />
            </div>
          ))}
        </div>
        {recentlyViewed.length > maxItems && (
          <div className="mt-4 text-center">
            <Button variant="outline">View All Recently Viewed</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}