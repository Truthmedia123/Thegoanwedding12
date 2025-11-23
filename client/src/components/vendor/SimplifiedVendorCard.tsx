import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Vendor } from "@shared/schema";

interface SimplifiedVendorCardProps {
  vendor: Vendor;
}

export default function SimplifiedVendorCard({ vendor }: SimplifiedVendorCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Get all available images
  const allImages = [
    vendor.profile_image_url,
    vendor.featured_image,
    ...(vendor.images || []),
  ].filter(Boolean);

  // DEBUG: Log vendor data
  console.log('🔍 SimplifiedVendorCard Debug - Vendor data:', {
    vendor,
    profile_image_url: vendor.profile_image_url,
    featured_image: vendor.featured_image,
    images: vendor.images,
  });

  console.log('🔍 SimplifiedVendorCard Debug - All images:', allImages);
  console.log('🔍 SimplifiedVendorCard Debug - Images count:', allImages.length);

  // Auto-advance carousel
  useEffect(() => {
    if (allImages.length <= 1) return;
    
    console.log('🔍 SimplifiedVendorCard Debug - Starting carousel with', allImages.length, 'images');
    
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const newIndex = (prev + 1) % allImages.length;
        console.log('🔍 SimplifiedVendorCard Debug - Auto-advancing to index:', newIndex);
        return newIndex;
      });
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, [allImages.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🔍 SimplifiedVendorCard Debug - Previous button clicked');
    setCurrentImageIndex(prev => 
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🔍 SimplifiedVendorCard Debug - Next button clicked');
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
      console.log('🔍 SimplifiedVendorCard Debug - Swipe left detected');
      setCurrentImageIndex(prev => 
        prev === allImages.length - 1 ? 0 : prev + 1
      );
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      console.log('🔍 SimplifiedVendorCard Debug - Swipe right detected');
      setCurrentImageIndex(prev => 
        prev === 0 ? allImages.length - 1 : prev - 1
      );
    }
  };

  return (
    <Link href={`/vendor/${vendor.id}`} className="block">
      <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
        {/* DEBUG INFO */}
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-xs p-1 z-20 text-center">
          DEBUG: Images={allImages.length}, Current={currentImageIndex}
        </div>
        
        <div 
          className="aspect-square w-full overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Image Carousel */}
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
                target.src = "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800";
              }}
            />
          ))}

          {/* Navigation Arrows (only show if multiple images) */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 z-10 transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 z-10 transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {allImages.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-white w-4"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Overlay with vendor info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-white font-bold text-sm mb-0.5 truncate">{vendor.name}</h3>
            <p className="text-white/90 text-xs mb-1 truncate">
              <i className="fas fa-map-marker-alt mr-1 text-xs"></i>
              {vendor.location}
            </p>
          </div>
        </div>
        
        {/* Featured badge - Rose Gold with Shimmer */}
        {vendor.featured && (
          <div className="absolute top-2 right-2 overflow-hidden bg-gradient-to-r from-rose-gold-400 to-rose-gold-100 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
            <span className="relative z-10 flex items-center gap-1">
              <i className="fas fa-star text-[8px]"></i>
              <span>FEATURED</span>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style={{backgroundSize: '200% 100%'}}></span>
          </div>
        )}
      </div>
    </Link>
  );
}