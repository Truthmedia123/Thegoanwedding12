import React, { useState, useEffect, useRef } from 'react'
import { vendorService, categoryService } from '../lib/supabase-service'
import type { Vendor, Category, VendorFilters } from '@shared/schema'

interface SearchResult {
  id: number
  name: string
  description: string | null
  category: string | null
  location: string | null
  rating: number | null
  featured_image: string | null
}

const SupabaseSearch: React.FC = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Vendor[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data, error } = await categoryService.getAll()
        if (error) {
          console.error('Error loading categories:', error)
          setError('Failed to load categories')
        } else if (data) {
          setCategories(data)
        }
      } catch (error: any) {
        console.error('Error loading categories:', error)
        setError('Failed to load categories')
      }
    }

    loadCategories()
  }, [])

  // Handle search with debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (query.length > 2 || selectedCategory || locationFilter) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch()
      }, 300)
    } else {
      setResults([])
      setShowResults(false)
      setError(null)
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [query, selectedCategory, locationFilter])

  // Perform search using Supabase
  const performSearch = async () => {
    setIsLoading(true)
    setError(null)
    setShowResults(true)

    try {
      const filters: VendorFilters = {}
      if (selectedCategory) {
        filters.category = selectedCategory
      }
      if (locationFilter) {
        filters.location = locationFilter
      }

      let searchResult
      if (query.length > 2) {
        searchResult = await vendorService.search(query, filters)
      } else {
        searchResult = await vendorService.getAll(filters)
      }

      if (searchResult.error) {
        setError(searchResult.error)
        setResults([])
      } else if (searchResult.data) {
        setResults(searchResult.data)
      }
    } catch (error: any) {
      console.error('Search error:', error)
      setError(error.message || 'An error occurred while searching')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  // Clear search
  const clearSearch = () => {
    setQuery('')
    setSelectedCategory('')
    setLocationFilter('')
    setResults([])
    setShowResults(false)
    setError(null)
  }

  return (
    <div className="relative max-w-4xl mx-auto p-4">
      {/* Search Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Find Your Perfect Wedding Vendor
        </h2>
        <p className="text-gray-600">
          Search through our curated collection of Goan wedding vendors
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search vendors, services, or locations..."
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              className="h-5 w-5 text-gray-400 hover:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Locations</option>
          <option value="Panaji">Panaji</option>
          <option value="Margao">Margao</option>
          <option value="Vasco">Vasco</option>
          <option value="Mapusa">Mapusa</option>
          <option value="Ponda">Ponda</option>
          <option value="Calangute">Calangute</option>
          <option value="Baga">Baga</option>
          <option value="Candolim">Candolim</option>
          <option value="Anjuna">Anjuna</option>
          <option value="Vagator">Vagator</option>
        </select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Searching...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg
              className="h-5 w-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Search Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {showResults && !isLoading && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {results.length > 0 ? `${results.length} vendor${results.length === 1 ? '' : 's'} found` : 'No vendors found'}
            </h3>
            {results.length > 0 && (
              <button
                onClick={clearSearch}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear search
              </button>
            )}
          </div>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((vendor) => (
                <div
                  key={vendor.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
                >
                  {vendor.featured_image && (
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={vendor.featured_image}
                        alt={vendor.name}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {vendor.name}
                      </h4>
                      {vendor.rating && (
                        <div className="flex items-center text-yellow-500">
                          <svg
                            className="h-4 w-4 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                          <span className="ml-1 text-sm font-medium">
                            {vendor.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {vendor.category && (
                      <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full mb-2">
                        {vendor.category}
                      </span>
                    )}
                    
                    {vendor.location && (
                      <p className="text-sm text-gray-600 mb-2 flex items-center">
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {vendor.location}
                      </p>
                    )}
                    
                    {vendor.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {vendor.description}
                      </p>
                    )}
                    
                    {vendor.price_range && (
                      <p className="text-sm font-medium text-green-600 mb-3">
                        {vendor.price_range}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                      {vendor.verified && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <svg
                            className="h-3 w-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No vendors found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or browse all categories.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Quick Category Links */}
      {!showResults && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 12).map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="w-8 h-8 mb-2 flex items-center justify-center">
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SupabaseSearch
