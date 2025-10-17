import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import SimplifiedVendorCard from "@/components/vendor/SimplifiedVendorCard";
import type { Vendor } from "@shared/schema";
import NewsletterSignup from "@/components/engagement/NewsletterSignup";
import { mockVendors } from "@/data/mockVendors";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export default function VendorCategory() {
  console.log('VendorCategory component loaded');
  
  const { category } = useParams();
  const [location] = useLocation();
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  
  console.log('Category:', category);

  // Parse URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    setSearch(urlParams.get('search') || '');
    setSelectedLocation(urlParams.get('location') || '');
  }, [location]);

  const { data: vendors, isLoading, error } = useQuery<Vendor[]>({
    queryKey: ['vendors', category, search, selectedLocation], // Use consistent key
    queryFn: async () => {
      try {
        console.log('Query function started');
        let allVendors: any[] = [];
        
        if (isSupabaseConfigured) {
          console.log('Loading vendors from Supabase...');
          const { data, error: supabaseError } = await supabase
            .from('vendors')
            .select('*');
          
          if (supabaseError) {
            console.error('Supabase error:', supabaseError);
            throw new Error(`Failed to fetch vendors: ${supabaseError.message}`);
          }
          
          allVendors = data || [];
          console.log('Vendors loaded from Supabase:', allVendors.length);
        } else {
          console.log('Supabase not configured, using localStorage + mock data');
          const storedVendors = JSON.parse(localStorage.getItem('vendors') || '[]');
          allVendors = [...mockVendors, ...storedVendors];
          console.log('Total vendors loaded (mock + stored):', allVendors.length);
        }
        
        console.log('Category filter:', category);
        
        let filteredVendors = allVendors;
        
        // Apply filters
        if (category && category !== 'all') {
          filteredVendors = filteredVendors.filter((v: any) => 
            v.category?.toLowerCase() === category.toLowerCase()
          );
          console.log(`Vendors in category "${category}":`, filteredVendors.length);
        }
        if (search) {
          const searchLower = search.toLowerCase();
          filteredVendors = filteredVendors.filter((v: any) => 
            v.name?.toLowerCase().includes(searchLower) ||
            v.category?.toLowerCase().includes(searchLower) ||
            v.location?.toLowerCase().includes(searchLower)
          );
        }
        if (selectedLocation && selectedLocation !== 'all') {
          filteredVendors = filteredVendors.filter((v: any) => 
            v.location?.toLowerCase().includes(selectedLocation.toLowerCase())
          );
        }
        
        console.log('Returning filtered vendors:', filteredVendors);
        return filteredVendors;
      } catch (err) {
        console.error('Query function error:', err);
        throw err;
      }
    },
    staleTime: 30000, // Cache for 30 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: false
  });
  
  console.log('Query result - vendors:', vendors, 'isLoading:', isLoading, 'error:', error);

  const sortedVendors = vendors?.sort((a: Vendor, b: Vendor) => {
    switch (sortBy) {
      case 'rating':
        return Number(b.rating) - Number(a.rating);
      case 'reviews':
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const categoryTitle = category === 'all' 
    ? 'All Vendors' 
    : category?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Vendors';

  // Show error if query failed
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-red-800 mb-2">Error Loading Vendors</h2>
          <p className="text-red-600">{error.toString()}</p>
          <pre className="mt-4 p-4 bg-white rounded text-sm overflow-auto">{JSON.stringify(error, null, 2)}</pre>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryTitle}</h1>
          <p className="text-xl opacity-90">
            Find the perfect {categoryTitle.toLowerCase()} for your special day in Goa
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <Input
                type="text"
                placeholder="Search vendors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="North Goa">North Goa</SelectItem>
                <SelectItem value="South Goa">South Goa</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={() => {
                setSearch("");
                setSelectedLocation("");
                setSortBy("rating");
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </section>

      {/* Vendors Grid - Simplified Layout */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-300 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : sortedVendors?.length ? (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-gray-600">
                  Showing {sortedVendors.length} vendor{sortedVendors.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {sortedVendors.map((vendor: Vendor) => (
                  <SimplifiedVendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">No vendors found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search filters</p>
              <Button 
                onClick={() => {
                  setSearch("");
                  setSelectedLocation("");
                }}
                className="bg-red-500 hover:bg-red-600"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}