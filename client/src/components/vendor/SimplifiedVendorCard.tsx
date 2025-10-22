import { Link } from "wouter";
import type { Vendor } from "@shared/schema";

interface SimplifiedVendorCardProps {
  vendor: Vendor;
}

export default function SimplifiedVendorCard({ vendor }: SimplifiedVendorCardProps) {
  return (
    <Link href={`/vendor/${vendor.id}`} className="block">
      <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
        <div className="aspect-square w-full overflow-hidden">
          <img 
            src={vendor.profile_image_url || vendor.featured_image || (vendor.images && vendor.images[0]) || "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800"} 
            alt={vendor.name}
            className="w-full h-full object-cover"
          />
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
        
        {/* Featured badge on top right in rose gold */}
        {vendor.featured && (
          <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            Featured
          </div>
        )}
      </div>
    </Link>
  );
}