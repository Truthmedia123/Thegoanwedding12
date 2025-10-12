import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ChevronDown,
  X,
  Calendar as CalendarIcon,
  MapPin,
  Filter,
  Save,
  RotateCcw,
  Search,
  Star,
  DollarSign,
  Check
} from 'lucide-react';
import { format } from 'date-fns';

interface FilterOptions {
  categories: string[];
  locations: string[];
  priceRange: [number, number];
  priceMin?: number;
  priceMax?: number;
  availabilityDate?: Date;
  rating: number;
  features: string[];
  savedFilterName?: string;
}

interface EnhancedVendorSearchFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  initialFilters?: Partial<FilterOptions>;
  categories?: string[];
  locations?: string[];
  features?: string[];
  maxPrice?: number;
}

interface SavedFilter {
  id: string;
  name: string;
  filters: FilterOptions;
  createdAt: Date;
}

// Mock location data for autocomplete
const MOCK_LOCATIONS = [
  'North Goa',
  'South Goa', 
  'Panaji',
  'Margao',
  'Calangute',
  'Baga',
  'Anjuna',
  'Arambol',
  'Candolim',
  'Colva',
  'Benaulim',
  'Palolem',
  'Vagator',
  'Morjim',
  'Assagao',
  'Mapusa',
  'Vasco da Gama',
  'Ponda',
  'Curchorem',
  'Sanguem'
];

export default function EnhancedVendorSearchFilters({
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
  locations = MOCK_LOCATIONS,
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
    'Air Conditioned',
    'Parking Available',
    'Alcohol Permitted',
    'Decoration Included'
  ],
  maxPrice = 1000000,
}: EnhancedVendorSearchFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    categories: initialFilters.categories || [],
    locations: initialFilters.locations || [],
    priceRange: initialFilters.priceRange || [0, maxPrice],
    priceMin: initialFilters.priceMin,
    priceMax: initialFilters.priceMax,
    availabilityDate: initialFilters.availabilityDate,
    rating: initialFilters.rating || 0,
    features: initialFilters.features || [],
  });

  const [isOpen, setIsOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');

  // Load saved filters from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('vendorSearchFilters');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedFilters(parsed.map((f: any) => ({
          ...f,
          createdAt: new Date(f.createdAt),
          filters: {
            ...f.filters,
            availabilityDate: f.filters.availabilityDate ? new Date(f.filters.availabilityDate) : undefined
          }
        })));
      } catch (error) {
        console.error('Failed to load saved filters:', error);
      }
    }
  }, []);

  // Save filters to localStorage
  const saveFiltersToStorage = (filters: SavedFilter[]) => {
    localStorage.setItem('vendorSearchFilters', JSON.stringify(filters));
  };

  // Notify parent of filter changes
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  // Filter locations based on search
  const filteredLocations = locations.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const handleCategoryToggle = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleLocationToggle = (location: string) => {
    setFilters(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(l => l !== location)
        : [...prev.locations, location]
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handlePriceRangeChange = (value: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [value[0], value[1]]
    }));
  };

  const handlePriceMinChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setFilters(prev => ({
      ...prev,
      priceMin: numValue,
      priceRange: [numValue, prev.priceRange[1]]
    }));
  };

  const handlePriceMaxChange = (value: string) => {
    const numValue = parseInt(value) || maxPrice;
    setFilters(prev => ({
      ...prev,
      priceMax: numValue,
      priceRange: [prev.priceRange[0], numValue]
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? 0 : rating
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setFilters(prev => ({
      ...prev,
      availabilityDate: date
    }));
    setShowCalendar(false);
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      locations: [],
      priceRange: [0, maxPrice],
      rating: 0,
      features: [],
      availabilityDate: undefined,
      priceMin: undefined,
      priceMax: undefined
    });
  };

  const saveCurrentFilters = () => {
    if (!filterName.trim()) return;

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName.trim(),
      filters: { ...filters },
      createdAt: new Date()
    };

    const updatedFilters = [...savedFilters, newFilter];
    setSavedFilters(updatedFilters);
    saveFiltersToStorage(updatedFilters);
    setFilterName('');
    setShowSaveDialog(false);
  };

  const loadSavedFilter = (savedFilter: SavedFilter) => {
    setFilters(savedFilter.filters);
  };

  const deleteSavedFilter = (id: string) => {
    const updatedFilters = savedFilters.filter(f => f.id !== id);
    setSavedFilters(updatedFilters);
    saveFiltersToStorage(updatedFilters);
  };

  const getActiveFiltersCount = () => {
    return filters.categories.length + 
           filters.locations.length + 
           filters.features.length + 
           (filters.rating > 0 ? 1 : 0) +
           (filters.availabilityDate ? 1 : 0) +
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
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Advanced Filters</span>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="ml-2">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>

        <div className="flex items-center space-x-2">
          {/* Saved Filters Dropdown */}
          {savedFilters.length > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  Saved Filters
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-2">
                  {savedFilters.map(savedFilter => (
                    <div key={savedFilter.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <div 
                        className="cursor-pointer flex-1"
                        onClick={() => loadSavedFilter(savedFilter)}
                      >
                        <div className="font-medium text-sm">{savedFilter.name}</div>
                        <div className="text-xs text-gray-500">
                          {format(savedFilter.createdAt, 'MMM dd, yyyy')}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteSavedFilter(savedFilter.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Save Filter Button */}
          {getActiveFiltersCount() > 0 && (
            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save Filter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Filter Preset</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="filterName">Filter Name</Label>
                    <Input
                      id="filterName"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      placeholder="e.g., Beach Wedding Vendors"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={saveCurrentFilters}
                      disabled={!filterName.trim()}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Clear All Button */}
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
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
              <MapPin className="h-3 w-3" />
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
              <Star className="h-3 w-3" />
              <span>{filters.rating}+ Stars</span>
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleRatingChange(filters.rating)}
              />
            </Badge>
          )}
          {filters.availabilityDate && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <CalendarIcon className="h-3 w-3" />
              <span>{format(filters.availabilityDate, 'MMM dd, yyyy')}</span>
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleDateSelect(undefined)}
              />
            </Badge>
          )}
          {(filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <DollarSign className="h-3 w-3" />
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
        <Card>
          <CardContent className="p-6 space-y-6">
            {/* Availability Date */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Availability Date
              </h3>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    {filters.availabilityDate ? (
                      format(filters.availabilityDate, 'PPP')
                    ) : (
                      <span className="text-gray-500">Check availability for date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.availabilityDate}
                    onSelect={handleDateSelect}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Categories with Search */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search categories..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                  {filteredCategories.map(category => (
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
            </div>

            {/* Locations with Autocomplete */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Locations
              </h3>
              <div className="space-y-3">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search locations..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                  {filteredLocations.map(location => (
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
            </div>

            {/* Enhanced Price Range */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Price Range
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priceMin">Minimum Price</Label>
                    <Input
                      id="priceMin"
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin || ''}
                      onChange={(e) => handlePriceMinChange(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="priceMax">Maximum Price</Label>
                    <Input
                      id="priceMax"
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax || ''}
                      onChange={(e) => handlePriceMaxChange(e.target.value)}
                    />
                  </div>
                </div>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}