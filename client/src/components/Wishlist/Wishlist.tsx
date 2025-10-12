import React, { useState, useEffect } from 'react';
import { Heart, HeartOff, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/components/Performance/Analytics';

interface Vendor {
  id: number;
  name: string;
  category: string;
  location: string;
  rating: number;
  profileImage?: string;
}

interface WishlistProps {
  vendor: Vendor;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const WishlistButton: React.FC<WishlistProps> = ({ 
  vendor, 
  size = 'md', 
  showText = false 
}) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { trackUserInteraction } = useAnalytics();

  useEffect(() => {
    // Check if vendor is in wishlist
    const wishlist = getWishlist();
    setIsInWishlist(wishlist.some(item => item.id === vendor.id));
  }, [vendor.id]);

  const getWishlist = (): Vendor[] => {
    try {
      const stored = localStorage.getItem('wedding-wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveWishlist = (wishlist: Vendor[]) => {
    try {
      localStorage.setItem('wedding-wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist:', error);
    }
  };

  const toggleWishlist = async () => {
    setIsLoading(true);
    
    try {
      const wishlist = getWishlist();
      
      if (isInWishlist) {
        // Remove from wishlist
        const updatedWishlist = wishlist.filter(item => item.id !== vendor.id);
        saveWishlist(updatedWishlist);
        setIsInWishlist(false);
        trackUserInteraction('wishlist-remove', vendor.name);
      } else {
        // Add to wishlist
        const updatedWishlist = [...wishlist, vendor];
        saveWishlist(updatedWishlist);
        setIsInWishlist(true);
        trackUserInteraction('wishlist-add', vendor.name);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleWishlist}
      disabled={isLoading}
      className={`
        ${sizeClasses[size]} 
        ${isInWishlist 
          ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100' 
          : 'hover:bg-gray-50'
        }
        transition-all duration-200
      `}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isInWishlist ? (
        <Heart className={`${iconSizes[size]} fill-current`} />
      ) : (
        <HeartOff className={iconSizes[size]} />
      )}
      {showText && (
        <span className="ml-2">
          {isInWishlist ? 'Saved' : 'Save'}
        </span>
      )}
    </Button>
  );
};

// Wishlist Page Component
export const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { trackUserInteraction } = useAnalytics();

  useEffect(() => {
    const loadWishlist = () => {
      try {
        const stored = localStorage.getItem('wedding-wishlist');
        const wishlistData = stored ? JSON.parse(stored) : [];
        setWishlist(wishlistData);
      } catch (error) {
        console.error('Error loading wishlist:', error);
        setWishlist([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const removeFromWishlist = (vendorId: number) => {
    const updatedWishlist = wishlist.filter(vendor => vendor.id !== vendorId);
    setWishlist(updatedWishlist);
    localStorage.setItem('wedding-wishlist', JSON.stringify(updatedWishlist));
    trackUserInteraction('wishlist-remove-page', vendorId.toString());
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('wedding-wishlist');
    trackUserInteraction('wishlist-clear', 'all');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
        <p className="text-gray-600 mb-6">
          Start saving your favorite wedding vendors to build your perfect wedding team.
        </p>
        <Button asChild>
          <a href="/vendors">Browse Vendors</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600">{wishlist.length} vendor{wishlist.length !== 1 ? 's' : ''} saved</p>
        </div>
        <Button
          variant="outline"
          onClick={clearWishlist}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((vendor) => (
          <div key={vendor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {vendor.profileImage && (
              <img
                src={vendor.profileImage}
                alt={vendor.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{vendor.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{vendor.category}</p>
              <p className="text-sm text-gray-500 mb-3">{vendor.location}</p>
              
              {vendor.rating > 0 && (
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < vendor.rating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">{vendor.rating.toFixed(1)}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Button asChild size="sm">
                  <a href={`/vendors/${vendor.id}`}>View Details</a>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeFromWishlist(vendor.id)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Hook for wishlist management
export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<Vendor[]>([]);

  useEffect(() => {
    const loadWishlist = () => {
      try {
        const stored = localStorage.getItem('wedding-wishlist');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    };

    setWishlist(loadWishlist());
  }, []);

  const addToWishlist = (vendor: Vendor) => {
    const updatedWishlist = [...wishlist, vendor];
    setWishlist(updatedWishlist);
    localStorage.setItem('wedding-wishlist', JSON.stringify(updatedWishlist));
  };

  const removeFromWishlist = (vendorId: number) => {
    const updatedWishlist = wishlist.filter(vendor => vendor.id !== vendorId);
    setWishlist(updatedWishlist);
    localStorage.setItem('wedding-wishlist', JSON.stringify(updatedWishlist));
  };

  const isInWishlist = (vendorId: number) => {
    return wishlist.some(vendor => vendor.id === vendorId);
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('wedding-wishlist');
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount: wishlist.length
  };
};






