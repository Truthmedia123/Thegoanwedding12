import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { X, Filter, MapPin, Star, DollarSign } from 'lucide-react';
import { useAnalytics } from './Performance/Analytics';

interface FilterOptions {
  categories: string[];
  locations: string[];
  priceRange: [number, number];
  rating: number;
  features: string[];
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  initialFilters?: Partial<FilterOptions>;
  categories?: string[];
  locations?: string[];
  features?: string[];
  maxPrice?: number;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onFiltersChange,
  initialFilters = {},
  categories = [
    'Photographers',
    'Videographers',
    'Venues',
    'Caterers',
    'Decorators',
    'Makeup Artists',
    'Bridal Wear',
    'Groom Wear',
    'Jewelry',
    'Music & DJ',
    'Transportation',
    'Wedding Planners',
  ],
  locations = [
    'North Goa',
    'South Goa',
  ],
  features = [
    'Outdoor Venue',
    'Indoor Venue',
    'Beach Wedding',
    'Garden Wedding',
    'Destination Wedding',
    'Traditional Goan',
    'Modern',
    'Luxury',
    'Budget Friendly',
    'Pet Friendly',
  ],
  maxPrice = 1000000,
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    categories: initialFilters.categories || [],
    locations: initialFilters.locations || [],
    priceRange: initialFilters.priceRange || [0, maxPrice],
    rating: initialFilters.rating || 0,
    features: initialFilters.features || [],
  });

  const [isOpen, setIsOpen] = useState(false);
  const { trackUserInteraction } = useAnalytics();

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const handleCategoryToggle = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
    trackUserInteraction('filter-category', category);
  };

  const handleLocationToggle = (location: string) => {
    setFilters(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location]
    }));
    trackUserInteraction('filter-location', location);
  };

  const handleFeatureToggle = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
    trackUserInteraction('filter-feature', feature);
  };

  const handlePriceRangeChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [value[0], value[1]]
    }));
    trackUserInteraction('filter-price', `${value[0]}-${value[1]}`);
  };

  const handleRatingChange = (rating: number) => {
    setFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? 0 : rating
    }));
    trackUserInteraction('filter-rating', rating.toString());
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      locations: [],
      priceRange: [0, maxPrice],
      rating: 0,
      features: [],
    });
    trackUserInteraction('filter-clear', 'all');
  };

  const getActiveFiltersCount = () => {
    return filters.categories.length + 
           filters.locations.length + 
           filters.features.length + 
           (filters.rating > 0 ? 1 : 0) +
           (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice ? 1 : 0);
  };

  const formatPrice = (price: number) => {
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else if (price >= 1000) {
      return `₹${(price / 1000).toFixed(0)}K`;
    }
    return `₹${price}`;
  };

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="ml-2">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>

        {getActiveFiltersCount() > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.categories.map(category => (
            <Badge key={category} variant="secondary" className="flex items-center space-x-1">
              <span>{category}</span>
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleCategoryToggle(category)}
              />
            </Badge>
          ))}
          {filters.locations.map(location => (
            <Badge key={location} variant="secondary" className="flex items-center space-x-1">
              <span>{location}</span>
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleLocationToggle(location)}
              />
            </Badge>
          ))}
          {filters.features.map(feature => (
            <Badge key={feature} variant="secondary" className="flex items-center space-x-1">
              <span>{feature}</span>
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleFeatureToggle(feature)}
              />
            </Badge>
          ))}
          {filters.rating > 0 && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>{filters.rating}+ Stars</span>
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleRatingChange(filters.rating)}
              />
            </Badge>
          )}
          {(filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>
                {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
              </span>
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setFilters(prev => ({ ...prev, priceRange: [0, maxPrice] }))}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Filter Panel */}
      {isOpen && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categories.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <label
                    htmlFor={`category-${category}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Locations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {locations.map(location => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={`location-${location}`}
                    checked={filters.locations.includes(location)}
                    onCheckedChange={() => handleLocationToggle(location)}
                  />
                  <label
                    htmlFor={`location-${location}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {location}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Price Range
            </h3>
            <div className="space-y-4">
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceRangeChange}
                max={maxPrice}
                min={0}
                step={10000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{formatPrice(filters.priceRange[0])}</span>
                <span>{formatPrice(filters.priceRange[1])}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Star className="h-4 w-4 mr-2" />
              Minimum Rating
            </h3>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <Button
                  key={rating}
                  variant={filters.rating === rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleRatingChange(rating)}
                  className="flex items-center space-x-1"
                >
                  <Star className="h-4 w-4" />
                  <span>{rating}+</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {features.map(feature => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={`feature-${feature}`}
                    checked={filters.features.includes(feature)}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                  />
                  <label
                    htmlFor={`feature-${feature}`}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {feature}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Hook for filter management
export const useAdvancedFilters = (initialFilters?: Partial<FilterOptions>) => {
  const [filters, setFilters] = useState<FilterOptions>({
    categories: initialFilters?.categories || [],
    locations: initialFilters?.locations || [],
    priceRange: initialFilters?.priceRange || [0, 1000000],
    rating: initialFilters?.rating || 0,
    features: initialFilters?.features || [],
  });

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      locations: [],
      priceRange: [0, 1000000],
      rating: 0,
      features: [],
    });
  };

  const getFilterCount = () => {
    return filters.categories.length + 
           filters.locations.length + 
           filters.features.length + 
           (filters.rating > 0 ? 1 : 0) +
           (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000 ? 1 : 0);
  };

  return {
    filters,
    updateFilters,
    clearFilters,
    getFilterCount,
  };
};