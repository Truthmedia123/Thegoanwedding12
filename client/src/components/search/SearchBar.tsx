import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface SearchBarProps {
  onSearch?: (search: string, location: string) => void;
  className?: string;
}

interface Vendor {
  id: number;
  name: string;
  category: string;
  location: string;
}

export default function SearchBar({ onSearch, className = "" }: SearchBarProps) {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [suggestions, setSuggestions] = useState<Vendor[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.length > 2) {
        try {
          const response = await fetch(`/api/search/vendors?q=${encodeURIComponent(search)}`);
          const results = await response.json();
          setSuggestions(results.slice(0, 5)); // Limit to 5 suggestions
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSearch) {
      onSearch(search, selectedLocation);
    } else {
      // Navigate to vendors page with search params
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedLocation) params.set('location', selectedLocation);
      
      const queryString = params.toString();
      setLocation(`/vendors/all${queryString ? `?${queryString}` : ''}`);
    }
    
    // Hide suggestions after search
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (vendor: Vendor) => {
    setSearch(vendor.name);
    setShowSuggestions(false);
    // Navigate to vendor profile
    setLocation(`/vendor/${vendor.id}`);
  };

  return (
    <div className={`bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Find Your Perfect Vendors</h2>
        <p className="text-gray-600">Search from 500+ trusted wedding professionals</p>
      </div>
      
      <form onSubmit={handleSearch} className="space-y-3 md:space-y-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="relative">
            <i className="fas fa-search absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-red-500"></i>
            <Input
              type="text"
              placeholder="Search photographers, venues, caterers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 text-base md:text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              onFocus={() => search.length > 2 && setSuggestions(suggestions)}
            />
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg rounded-xl overflow-hidden">
                <div className="py-2">
                  {suggestions.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => handleSuggestionClick(vendor)}
                    >
                      <div className="font-medium text-gray-900">{vendor.name}</div>
                      <div className="text-sm text-gray-500">{vendor.category} • {vendor.location}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
          
          <div className="relative">
            <i className="fas fa-map-marker-alt absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-teal-500 z-10"></i>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 text-base md:text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                <SelectValue placeholder="Select Location in Goa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations in Goa</SelectItem>
                <SelectItem value="North Goa">North Goa</SelectItem>
                <SelectItem value="South Goa">South Goa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-xl hover:shadow-2xl"
        >
          <i className="fas fa-search mr-3"></i>
          Search Wedding Vendors
          <i className="fas fa-heart ml-3 text-pink-300"></i>
        </Button>
      </form>
    </div>
  );
}