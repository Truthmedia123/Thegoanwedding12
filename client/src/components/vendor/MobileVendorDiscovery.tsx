import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MobileVendorDiscoverySEO } from '@/components/SEO/MobileVendorDiscoverySEO';
import type { Vendor } from '@shared/schema';

// Mock vendor data for demonstration
const mockVendors: Vendor[] = [
  {
    id: 1,
    name: "Goa Wedding Photography",
    category: "photographers",
    description: "Professional wedding photography capturing your special moments with artistic flair.",
    phone: "+91 9876543210",
    email: "info@goaweddingphoto.com",
    whatsapp: "+91 9876543210",
    location: "North Goa",
    address: "Calangute, Goa",
    website: "https://goaweddingphoto.com",
    instagram: "goaweddingphoto",
    youtube: "goaweddingphoto",
    facebook: "goaweddingphoto",
    profileImage: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    coverImage: "",
    gallery: "",
    services: '["Wedding Photography", "Pre-Wedding Shoot", "Candid Photography"]',
    priceRange: "₹50,000 - ₹1,50,000",
    featured: true,
    verified: true,
    rating: 4.8,
    reviewCount: 42,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Beachside Venues",
    category: "venues",
    description: "Stunning beachfront venues for your dream wedding in Goa.",
    phone: "+91 9876543211",
    email: "info@beachsidevenues.com",
    whatsapp: "+91 9876543211",
    location: "South Goa",
    address: "Palolem Beach, Goa",
    website: "https://beachsidevenues.com",
    instagram: "beachsidevenues",
    youtube: "beachsidevenues",
    facebook: "beachsidevenues",
    profileImage: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    coverImage: "",
    gallery: "",
    services: '["Beach Venues", "Garden Venues", "Banquet Halls"]',
    priceRange: "₹1,00,000 - ₹5,00,000",
    featured: true,
    verified: true,
    rating: 4.9,
    reviewCount: 38,
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "Goan Flavors Catering",
    category: "caterers",
    description: "Authentic Goan cuisine for your special day with customizable menus.",
    phone: "+91 9876543212",
    email: "info@goanflavors.com",
    whatsapp: "+91 9876543212",
    location: "North Goa",
    address: "Mapusa, Goa",
    website: "https://goanflavors.com",
    instagram: "goanflavors",
    youtube: "goanflavors",
    facebook: "goanflavors",
    profileImage: "https://images.unsplash.com/photo-1555243896-c3032f648188?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    coverImage: "",
    gallery: "",
    services: '["Goan Cuisine", "Multi-Cuisine", "Fusion Food"]',
    priceRange: "₹800 - ₹2000 per plate",
    featured: false,
    verified: true,
    rating: 4.7,
    reviewCount: 56,
    createdAt: new Date(),
  },
  {
    id: 4,
    name: "Bollywood Beats DJ",
    category: "bands-djs",
    description: "Professional DJs specializing in Bollywood and international music for weddings.",
    phone: "+91 9876543213",
    email: "info@bollywoodbeats.com",
    whatsapp: "+91 9876543213",
    location: "North Goa",
    address: "Panjim, Goa",
    website: "https://bollywoodbeats.com",
    instagram: "bollywoodbeats",
    youtube: "bollywoodbeats",
    facebook: "bollywoodbeats",
    profileImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    coverImage: "",
    gallery: "",
    services: '["Wedding DJ", "Live Music", "Sound Systems"]',
    priceRange: "₹25,000 - ₹75,000",
    featured: true,
    verified: true,
    rating: 4.9,
    reviewCount: 67,
    createdAt: new Date(),
  },
  {
    id: 5,
    name: "Royal Makeup Artists",
    category: "makeup-artists",
    description: "Bridal and party makeup artists with 10+ years of experience.",
    phone: "+91 9876543214",
    email: "info@royalmakeup.com",
    whatsapp: "+91 9876543214",
    location: "South Goa",
    address: "Margao, Goa",
    website: "https://royalmakeup.com",
    instagram: "royalmakeup",
    youtube: "royalmakeup",
    facebook: "royalmakeup",
    profileImage: "https://images.unsplash.com/photo-1560066984-138dadb4c5bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    coverImage: "",
    gallery: "",
    services: '["Bridal Makeup", "Party Makeup", "Hair Styling"]',
    priceRange: "₹15,000 - ₹40,000",
    featured: false,
    verified: true,
    rating: 4.8,
    reviewCount: 89,
    createdAt: new Date(),
  },
  {
    id: 6,
    name: "Floral Dreams Decor",
    category: "decor-florists",
    description: "Creating magical wedding decor with fresh flowers and creative designs.",
    phone: "+91 9876543215",
    email: "info@floraldreams.com",
    whatsapp: "+91 9876543215",
    location: "North Goa",
    address: "Baga, Goa",
    website: "https://floraldreams.com",
    instagram: "floraldreams",
    youtube: "floraldreams",
    facebook: "floraldreams",
    profileImage: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    coverImage: "",
    gallery: "",
    services: '["Floral Decor", "Stage Decor", "Lighting"]',
    priceRange: "₹50,000 - ₹2,00,000",
    featured: true,
    verified: true,
    rating: 4.7,
    reviewCount: 54,
    createdAt: new Date(),
  },
];

// Calculate distance between two coordinates (simplified)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
};

// Get user's current location
const getUserLocation = (): Promise<{latitude: number, longitude: number}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// Enhanced offline caching
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const cacheVendors = (vendors: Vendor[], userLocation: any) => {
  localStorage.setItem('vendorCache', JSON.stringify({
    data: vendors,
    timestamp: Date.now(),
    location: userLocation
  }));
};

const getCachedVendors = () => {
  try {
    const cached = localStorage.getItem('vendorCache');
    if (cached) {
      const parsed = JSON.parse(cached);
      // Check if cache is still valid
      if (Date.now() - parsed.timestamp < CACHE_DURATION) {
        return parsed;
      } else {
        // Clear expired cache
        localStorage.removeItem('vendorCache');
      }
    }
  } catch (e) {
    console.error('Error reading cached vendors:', e);
  }
  return null;
};

// Voice search hook
const useVoiceSearch = (onResult: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Enhanced voice search configuration
  const enhancedVoiceSearch = {
    continuous: true,
    interimResults: true,
    lang: 'en-IN', // Indian English for better Goan accent recognition
  };

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = enhancedVoiceSearch.continuous;
      recognitionRef.current.interimResults = enhancedVoiceSearch.interimResults;
      recognitionRef.current.lang = enhancedVoiceSearch.lang;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice search error",
          description: "Could not recognize your voice. Please try again.",
          variant: "destructive"
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onResult]);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    } else {
      toast({
        title: "Voice search not supported",
        description: "Your browser does not support voice search.",
        variant: "destructive"
      });
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return { isListening, startListening, stopListening };
};

// Fetch vendors function
const fetchVendors = async (): Promise<Vendor[]> => {
  // In a real implementation, this would be an API call
  // For now, we'll use mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockVendors);
    }, 500);
  });
};

export default function MobileVendorDiscovery() {
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [userPreferences, setUserPreferences] = useState({
    category: '',
    location: '',
    priceRange: ''
  });
  const [wishlist, setWishlist] = useState<number[]>(() => {
    const saved = localStorage.getItem('vendor_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch vendors
  const { data, isLoading, error } = useQuery({
    queryKey: ['vendors'],
    queryFn: fetchVendors,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Voice search
  const { isListening, startListening, stopListening } = useVoiceSearch((text) => {
    setSearchQuery(text);
    // Simple parsing of voice commands
    if (text.toLowerCase().includes('photographer') && text.includes('50 thousand')) {
      setPriceFilter('under-50k');
      setLocationFilter('North Goa');
    }
  });

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load vendors
  useEffect(() => {
    if (data) {
      setVendors(data);
      setFilteredVendors(data);
      // Cache vendors when online
      if (isOnline) {
        cacheVendors(data, userLocation);
      }
    } else if (!isOnline) {
      // Load from cache when offline
      const cached = getCachedVendors();
      if (cached) {
        setVendors(cached.data);
        setFilteredVendors(cached.data);
      }
    }
  }, [data, isOnline, userLocation]);

  // Apply filters
  useEffect(() => {
    let result = [...vendors];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(vendor => 
        vendor.name.toLowerCase().includes(query) || 
        vendor.description.toLowerCase().includes(query) ||
        vendor.category.toLowerCase().includes(query)
      );
    }
    
    if (locationFilter) {
      result = result.filter(vendor => vendor.location === locationFilter);
    }
    
    if (priceFilter === 'under-50k') {
      result = result.filter(vendor => {
        if (vendor.priceRange?.includes('50,000') || vendor.priceRange?.includes('40,000') || 
            vendor.priceRange?.includes('30,000') || vendor.priceRange?.includes('20,000') ||
            vendor.priceRange?.includes('10,000')) {
          return true;
        }
        return false;
      });
    }
    
    setFilteredVendors(result);
    setCurrentIndex(0); // Reset to first card when filters change
  }, [vendors, searchQuery, locationFilter, priceFilter]);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('vendor_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Smart preloading
  const preloadNextVendors = useCallback(() => {
    // Preload next 10 vendors based on swipe direction
    if (currentIndex >= vendors.length - 3 && isOnline) {
      // In a real implementation, this would fetch more vendors
      console.log('Preloading more vendors based on user preferences:', userPreferences);
    }
  }, [currentIndex, vendors.length, isOnline, userPreferences]);

  // Trigger preloading when approaching end
  useEffect(() => {
    preloadNextVendors();
  }, [preloadNextVendors]);

  // Swipe handlers
  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    if (direction === 'right') {
      // Save to wishlist
      const currentVendor = filteredVendors[currentIndex];
      if (currentVendor && !wishlist.includes(currentVendor.id)) {
        setWishlist(prev => [...prev, currentVendor.id]);
        toast({
          title: "Saved to wishlist",
          description: `${currentVendor.name} has been added to your wishlist.`,
        });
      }
    }
    
    // Move to next card
    if (currentIndex < filteredVendors.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // No more vendors
      toast({
        title: "No more vendors",
        description: "You've reached the end of the vendor list.",
      });
    }
  }, [currentIndex, filteredVendors, wishlist]);

  // Quick actions
  const handleSave = (vendorId: number) => {
    if (!wishlist.includes(vendorId)) {
      setWishlist(prev => [...prev, vendorId]);
      const vendor = filteredVendors.find(v => v.id === vendorId);
      if (vendor) {
        toast({
          title: "Saved to wishlist",
          description: `${vendor.name} has been added to your wishlist.`,
        });
      }
    }
  };

  const handleContact = (vendor: Vendor) => {
    const message = encodeURIComponent(`Hi! I found your business ${vendor.name} on TheGoanWedding.com and would like to know more about your services.`);
    window.open(`https://wa.me/${vendor.whatsapp}?text=${message}`, '_blank');
  };

  const handleShare = (vendor: Vendor) => {
    if (navigator.share) {
      navigator.share({
        title: vendor.name,
        text: vendor.description,
        url: `${window.location.origin}/vendor/${vendor.id}`,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`${window.location.origin}/vendor/${vendor.id}`);
      toast({
        title: "Link copied",
        description: "Vendor profile link copied to clipboard.",
      });
    }
  };

  const handleViewPortfolio = (vendorId: number) => {
    window.location.hash = `/vendor/${vendorId}`;
  };

  // Render current vendor card
  const renderVendorCard = () => {
    if (filteredVendors.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="text-5xl mb-4">😢</div>
          <h3 className="text-xl font-bold mb-2">No vendors found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or search terms
          </p>
          <Button onClick={() => {
            setSearchQuery('');
            setLocationFilter('');
            setPriceFilter('');
          }}>
            Clear Filters
          </Button>
        </div>
      );
    }

    const vendor = filteredVendors[currentIndex];
    if (!vendor) return null;

    return (
      <div className="relative w-full h-full">
        {/* Vendor image */}
        <div className="relative w-full h-2/3 overflow-hidden rounded-t-2xl">
          <img 
            src={vendor.profileImage || "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"} 
            alt={vendor.name}
            className="w-full h-full object-cover"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            {vendor.featured && (
              <Badge className="bg-red-500/90 backdrop-blur-sm text-white border-0 shadow-lg">
                <i className="fas fa-star mr-1"></i>Featured
              </Badge>
            )}
            {vendor.verified && (
              <Badge className="bg-blue-500/90 backdrop-blur-sm text-white border-0 shadow-lg">
                <i className="fas fa-check-circle mr-1"></i>Verified
              </Badge>
            )}
          </div>
          
          {/* Rating */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
            <div className="flex items-center gap-1">
              <i className="fas fa-star text-yellow-500 text-sm"></i>
              <span className="text-sm font-semibold text-slate-800">{vendor.rating}</span>
              <span className="text-xs text-gray-500">({vendor.reviewCount})</span>
            </div>
          </div>
        </div>
        
        {/* Vendor info */}
        <div className="p-6 h-1/3 flex flex-col">
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xl font-bold text-slate-800 truncate">
                {vendor.name}
              </h3>
              {vendor.priceRange && (
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {vendor.priceRange}
                </span>
              )}
            </div>
            <p className="text-gray-500 text-sm capitalize font-medium">
              {vendor.category.replace('-', ' ')}
            </p>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-2 flex-grow">
            {vendor.description}
          </p>
          
          <div className="flex items-center text-gray-500 text-sm mb-4">
            <i className="fas fa-map-marker-alt mr-2 text-red-500"></i>
            <span>{vendor.location}</span>
          </div>
          
          {/* Action buttons */}
          <div className="grid grid-cols-4 gap-2">
            <Button
              onClick={() => handleSave(vendor.id)}
              className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 py-2 rounded-xl font-semibold transition-all"
            >
              <i className="fas fa-heart"></i>
            </Button>
            <Button
              onClick={() => handleContact(vendor)}
              className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl font-semibold transition-all"
            >
              <i className="fab fa-whatsapp"></i>
            </Button>
            <Button
              onClick={() => handleShare(vendor)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl font-semibold transition-all"
            >
              <i className="fas fa-share-alt"></i>
            </Button>
            <Button
              onClick={() => handleViewPortfolio(vendor.id)}
              className="bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-xl font-semibold transition-all"
            >
              <i className="fas fa-images"></i>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Loading vendors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center p-4">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold mb-2">Error loading vendors</h3>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-md mx-auto">
      {/* SEO Component */}
      <MobileVendorDiscoverySEO />
      
      {/* Header */}
      <div className="p-4 bg-white border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-800">Discover Vendors</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={startListening}
              disabled={isListening}
              className="flex items-center gap-2"
            >
              <i className={`fas fa-microphone ${isListening ? 'text-red-500' : ''}`}></i>
              {isListening ? 'Listening...' : 'Voice'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.vibrate?.(100);
                getUserLocation()
                  .then(pos => {
                    setUserLocation(pos);
                    toast({
                      title: "Location detected",
                      description: `You are at ${pos.latitude.toFixed(4)}, ${pos.longitude.toFixed(4)}`,
                    });
                  })
                  .catch(err => {
                    toast({
                      title: "Location error",
                      description: err.message,
                      variant: "destructive"
                    });
                  });
              }}
              className="flex items-center gap-2"
            >
              <i className="fas fa-location-crosshairs"></i>
              GPS
            </Button>
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="space-y-3">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">All Locations</option>
              <option value="North Goa">North Goa</option>
              <option value="South Goa">South Goa</option>
            </select>
            
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Any Price</option>
              <option value="under-50k">Under ₹50,000</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Vendor cards area */}
      <div className="flex-grow relative overflow-hidden">
        {filteredVendors.length > 0 ? (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <Card className="w-full h-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
              {renderVendorCard()}
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full p-8">
            <div className="text-center">
              <div className="text-5xl mb-4">😢</div>
              <h3 className="text-xl font-bold mb-2">No vendors found</h3>
              <p className="text-gray-600">
                Try adjusting your filters or search terms
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Swipe controls */}
      {filteredVendors.length > 0 && (
        <div className="p-4 bg-white border-t">
          <div className="flex justify-between items-center">
            <Button
              onClick={() => handleSwipe('left')}
              className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
            >
              <i className="fas fa-times text-2xl text-red-500"></i>
            </Button>
            
            <div className="text-sm text-gray-500">
              {currentIndex + 1} of {filteredVendors.length}
            </div>
            
            <Button
              onClick={() => handleSwipe('right')}
              className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
            >
              <i className="fas fa-heart text-2xl text-green-500"></i>
            </Button>
          </div>
        </div>
      )}
      
      {/* Offline indicator */}
      {!isOnline && (
        <div className="bg-yellow-100 border-t border-yellow-400 text-yellow-700 px-4 py-3 text-center">
          <p className="text-sm">
            <i className="fas fa-exclamation-circle mr-2"></i>
            You are offline. Showing cached vendors.
          </p>
        </div>
      )}
    </div>
  );
}