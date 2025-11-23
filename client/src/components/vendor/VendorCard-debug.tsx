import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Vendor } from "@shared/schema";

interface VendorCardProps {
  vendor: any; // Using any for now since we're mixing Directus and local schema
}

export default function VendorCard({ vendor }: VendorCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // DEBUG: Log vendor data
  console.log('🔍 VendorCard Debug - Vendor data:', {
    vendor,
    profile_image_url: vendor.profile_image_url,
    cover_image_url: vendor.cover_image_url,
    images: vendor.images,
    profileImage: vendor.profileImage, // Check for alternative field name
  });

  // Get all available images
  const allImages = [
    vendor.profile_image_url,
    vendor.cover_image_url,
    ...(vendor.images || []),
  ].filter(Boolean);

  // DEBUG: Log images array
  console.log('🔍 VendorCard Debug - All images:', allImages);
  console.log('🔍 VendorCard Debug - Images count:', allImages.length);

  // Auto-advance carousel
  useEffect(() => {
    if (allImages.length <= 1) return;
    
    console.log('🔍 VendorCard Debug - Starting carousel with', allImages.length, 'images');
    
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const newIndex = (prev + 1) % allImages.length;
        console.log('🔍 VendorCard Debug - Auto-advancing to index:', newIndex);
        return newIndex;
      });
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, [allImages.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🔍 VendorCard Debug - Previous button clicked');
    setCurrentImageIndex(prev => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🔍 VendorCard Debug - Next button clicked');
    setCurrentImageIndex(prev => 
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  // Touch event handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      console.log('🔍 VendorCard Debug - Swipe left detected');
      setCurrentImageIndex(prev => 
        prev === allImages.length - 1 ? 0 : prev + 1
      );
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      console.log('🔍 VendorCard Debug - Swipe right detected');
      setCurrentImageIndex(prev => 
        prev === 0 ? allImages.length - 1 : prev - 1
      );
    }
  };

  // If no images, use a default
  if (allImages.length === 0) {
    console.log('🔍 VendorCard Debug - No images found, using default');
    allImages.push(
      "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
    );
  }

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    // Add Umami tracking for contact vendor click
    if (typeof window !== 'undefined' && (window as any).umami) {
      (window as any).umami('contact_vendor_click', { 
        vendor_id: vendor.id,
        vendor_name: vendor.name,
        contact_method: 'whatsapp'
      });
    }
    const message = encodeURIComponent(`Hi! I found your business ${vendor.name} on TheGoanWedding.com and would like to know more about your services.`);
    window.open(`https://wa.me/${vendor.whatsapp}?text=${message}`, '_blank');
  };

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    // Add Umami tracking for contact vendor click
    if (typeof window !== 'undefined' && (window as any).umami) {
      (window as any).umami('contact_vendor_click', { 
        vendor_id: vendor.id,
        vendor_name: vendor.name,
        contact_method: 'phone'
      });
    }
    window.location.href = `tel:${vendor.phone}`;
  };

  return (
    <Card className={`group cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden rounded-2xl ${
      vendor.featured 
        ? 'border-2 border-rose-gold-400 shadow-xl shadow-rose-gold-400/20 bg-gradient-to-b from-rose-gold-50 to-white' 
        : 'bg-white border-0'
    }`}>
      {/* DEBUG INFO */}
      <div className="bg-red-500 text-white text-xs p-2">
        DEBUG: Images={allImages.length}, Current={currentImageIndex}
      </div>
      
      <Link href={`/vendor/${vendor.id}`}>
        <div
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Image Carousel */}
          <div className="relative h-72 w-full overflow-hidden">
            {allImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${vendor.name} - ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
                onError={(e) => {
                  // Fallback to default image if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500";
                }}
              />
            ))}
          </div>

          {/* Navigation Arrows (only show if multiple images) */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 z-10 transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 z-10 transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-white w-6"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Featured Badge - Rose Gold with Shimmer */}
          {vendor.featured && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className="relative overflow-hidden bg-gradient-to-r from-rose-gold-400 to-rose-gold-100 text-white font-bold px-3 py-1.5 shadow-lg">
                <span className="relative z-10 flex items-center">
                  <i className="fas fa-star mr-1.5"></i>
                  FEATURED
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style={{backgroundSize: '200% 100%'}}></span>
              </Badge>
            </div>
          )}
          
          {/* Rating overlay */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
            <div className="flex items-center gap-1">
              <i className="fas fa-star text-yellow-500 text-sm"></i>
              <span className="text-sm font-semibold text-slate-800">{vendor.rating}</span>
              <span className="text-xs text-gray-500">({vendor.reviewCount || vendor.reviews_count})</span>
            </div>
          </div>
        </div>
      </Link>
      
      <CardContent className="p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-slate-800 group-hover:text-red-600 transition-colors duration-300">
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
        
        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
          {vendor.description}
        </p>
        
        <div className="flex items-center mb-6 text-gray-500 text-sm">
          <i className="fas fa-map-marker-alt mr-2 text-red-500"></i>
          <span>{vendor.location}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <Button
            onClick={handleWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white py-2 md:py-3 px-2 md:px-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg text-xs md:text-sm"
          >
            <i className="fab fa-whatsapp mr-1 md:mr-2"></i>
            <span className="hidden sm:inline">WhatsApp</span>
            <span className="sm:hidden">WA</span>
          </Button>
          <Button
            onClick={handleCall}
            className="bg-red-500 hover:bg-red-600 text-white py-2 md:py-3 px-2 md:px-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg text-xs md:text-sm"
          >
            <i className="fas fa-phone mr-1 md:mr-2"></i>
            <span className="hidden sm:inline">Call Now</span>
            <span className="sm:hidden">Call</span>
          </Button>
        </div>
        
        {/* View profile link */}
        <Link href={`/vendor/${vendor.id}`}>
          <div 
            className="mt-4 text-center text-sm text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
            onClick={() => {
              // Add Umami tracking for vendor profile view
              if (typeof window !== 'undefined' && (window as any).umami) {
                (window as any).umami('vendor_page_view', { 
                  vendor_id: vendor.id,
                  vendor_name: vendor.name,
                  vendor_category: vendor.category
                });
              }
            }}
          >
            View Full Profile <i className="fas fa-arrow-right ml-1"></i>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
