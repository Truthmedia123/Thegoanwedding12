import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Star, Phone, Mail } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Vendor {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  priceRange: string;
  description: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  featured: boolean;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const response = await fetch('/api/vendors');
      if (!response.ok) throw new Error('Failed to fetch vendors');
      return response.json();
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
  });

  const filteredVendors = vendors.filter((vendor: Vendor) => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory;
    const matchesLocation = selectedLocation === 'all' || vendor.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const locations = ['North Goa', 'South Goa'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Search Wedding Vendors
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the perfect wedding vendors for your special day in Goa
          </p>
        </div>

        {/* Search Filters */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Input */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search vendors, services, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category: any) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="all">All Locations</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredVendors.length} vendors found
            </h2>
            {searchTerm && (
              <Button
                variant="outline"
                onClick={() => setSearchTerm('')}
                className="text-sm"
              >
                Clear Search
              </Button>
            )}
          </div>
        </div>

        {/* Vendor Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredVendors.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No vendors found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse all categories
              </p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLocation('all');
                }}
                className="bg-pink-500 hover:bg-pink-600"
              >
                View All Vendors
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor: Vendor) => (
              <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {vendor.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {vendor.category}
                        </Badge>
                        {vendor.featured && (
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{vendor.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{vendor.location}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {vendor.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-pink-600">
                        {vendor.priceRange}
                      </span>
                      <div className="flex gap-2">
                        {vendor.whatsapp && (
                          <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                            <Phone className="w-3 h-3" />
                          </Button>
                        )}
                        {vendor.email && (
                          <Button size="sm" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                            <Mail className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
