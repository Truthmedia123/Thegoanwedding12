import React from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import VendorCard from '@/components/vendor/VendorCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites();

  const handleRemoveFavorite = (vendorId: string) => {
    removeFavorite(vendorId);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Saved Vendors</h1>
          <p className="mt-2 text-gray-600">
            {favorites.length > 0 
              ? `You have ${favorites.length} saved vendor${favorites.length !== 1 ? 's' : ''}` 
              : 'You haven\'t saved any vendors yet'}
          </p>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((vendor) => (
              <div key={vendor.id} className="relative">
                <VendorCard vendor={vendor as any} />
                <div className="mt-2 flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => handleRemoveFavorite(vendor.id)}
                  >
                    Remove from Favorites
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>No Saved Vendors</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                You haven't saved any vendors yet. Browse our vendor directory and save your favorites!
              </p>
              <Link to="/search">
                <Button>Browse Vendors</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}