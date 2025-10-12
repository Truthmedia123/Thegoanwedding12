import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Vendor } from "@shared/schema";

interface VendorCardProps {
  vendor: any; // Using any for now since we're mixing Directus and local schema
}

export default function VendorCard({ vendor }: VendorCardProps) {
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

  // Determine the image source based on available fields
  const profileImage = vendor.profile_image_url || vendor.profileImage || 
    "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500";

  return (
    <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden bg-white border-0 rounded-2xl">
      <Link href={`/vendor/${vendor.id}`}>
        <div className="relative overflow-hidden">
          <img 
            src={profileImage} 
            alt={vendor.name}
            className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700" 
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            {vendor.featured && (
              <Badge className="bg-red-500/90 backdrop-blur-sm text-white border-0 shadow-lg">
                <i className="fas fa-star mr-1"></i>Featured
              </Badge>
            )}
          </div>
          
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