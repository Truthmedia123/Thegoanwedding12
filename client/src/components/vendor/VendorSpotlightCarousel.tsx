import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Star, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'wouter';

interface FeaturedVendor {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  logo: string;
  featuredImage: string;
  testimonial: string;
  testimonialAuthor: string;
  priceRange: string;
  specialties: string[];
  featured: boolean;
}

interface VendorSpotlightCarouselProps {
  autoRotate?: boolean;
  rotateInterval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  slidesToShow?: number;
}

export default function VendorSpotlightCarousel({
  autoRotate = true,
  rotateInterval = 5000,
  showDots = true,
  showArrows = true,
  slidesToShow = 3
}: VendorSpotlightCarouselProps) {
  const [vendors, setVendors] = useState<FeaturedVendor[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Mock data - in real app this would fetch from /api/vendors?featured=true
  const mockVendors: FeaturedVendor[] = [
    {
      id: '1',
      name: 'Paradise Beach Resort',
      category: 'Venues',
      location: 'Candolim, North Goa',
      rating: 4.8,
      reviewCount: 127,
      logo: '/api/placeholder/80/80',
      featuredImage: '/api/placeholder/400/300',
      testimonial: 'Absolutely magical venue with stunning sunset views. The staff went above and beyond to make our day perfect.',
      testimonialAuthor: 'Priya & Arjun',
      priceRange: '₹2-5L',
      specialties: ['Beach Wedding', 'Destination Wedding', 'Luxury'],
      featured: true
    },
    {
      id: '2',
      name: 'Capture Moments Photography',
      category: 'Photographers',
      location: 'Panaji, Goa',
      rating: 4.9,
      reviewCount: 89,
      logo: '/api/placeholder/80/80',
      featuredImage: '/api/placeholder/400/300',
      testimonial: 'They captured every emotion beautifully. Our wedding album tells the perfect story of our special day.',
      testimonialAuthor: 'Maria & Carlos',
      priceRange: '₹50K-1L',
      specialties: ['Candid Photography', 'Traditional Goan', 'Drone shots'],
      featured: true
    },
    {
      id: '3',
      name: 'Goan Spice Caterers',
      category: 'Caterers',
      location: 'Margao, South Goa',
      rating: 4.7,
      reviewCount: 156,
      logo: '/api/placeholder/80/80',
      featuredImage: '/api/placeholder/400/300',
      testimonial: 'Authentic Goan flavors that impressed all our guests. The fish curry was simply outstanding!',
      testimonialAuthor: 'Anjali & Rohit',
      priceRange: '₹800-1500/plate',
      specialties: ['Authentic Goan', 'Seafood Specialist', 'Vegetarian Options'],
      featured: true
    },
    {
      id: '4',
      name: 'Elegant Bridal Studio',
      category: 'Makeup Artists',
      location: 'Calangute, North Goa',
      rating: 4.6,
      reviewCount: 73,
      logo: '/api/placeholder/80/80',
      featuredImage: '/api/placeholder/400/300',
      testimonial: 'Made me feel like a princess on my wedding day. The makeup lasted throughout the celebrations.',
      testimonialAuthor: 'Sophia D\'Souza',
      priceRange: '₹15K-35K',
      specialties: ['Bridal Makeup', 'Hair Styling', 'Traditional Look'],
      featured: true
    },
    {
      id: '5',
      name: 'Royal Events & Decor',
      category: 'Decorators',
      location: 'Vasco da Gama, Goa',
      rating: 4.5,
      reviewCount: 94,
      logo: '/api/placeholder/80/80',
      featuredImage: '/api/placeholder/400/300',
      testimonial: 'Transformed our venue into a fairy tale setting. Every detail was perfectly executed.',
      testimonialAuthor: 'Isabel & Francis',
      priceRange: '₹1-3L',
      specialties: ['Floral Arrangements', 'Mandap Decoration', 'Lighting'],
      featured: true
    }
  ];

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setVendors(mockVendors);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate functionality
  useEffect(() => {
    if (!autoRotate || vendors.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(vendors.length / slidesToShow));
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotateInterval, vendors.length, slidesToShow]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(vendors.length / slidesToShow));
  }, [vendors.length, slidesToShow]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.ceil(vendors.length / slidesToShow) - 1 : prev - 1
    );
  }, [vendors.length, slidesToShow]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  if (isLoading) {
    return (
      <div className="w-full py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 animate-pulse rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 animate-pulse h-80 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalSlides = Math.ceil(vendors.length / slidesToShow);
  const startIndex = currentIndex * slidesToShow;
  const visibleVendors = vendors.slice(startIndex, startIndex + slidesToShow);

  return (
    <div className="w-full py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Featured Wedding Vendors
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover Goa's most trusted wedding professionals, handpicked for their exceptional service and quality
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Arrow Navigation */}
          {showArrows && totalSlides > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg hover:bg-gray-50 rounded-full w-10 h-10 p-0"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg hover:bg-gray-50 rounded-full w-10 h-10 p-0"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Vendor Cards */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {visibleVendors.map((vendor) => (
              <Card key={vendor.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Featured Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={vendor.featuredImage}
                    alt={vendor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white">Featured</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-white/90 text-gray-700">
                      {vendor.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Vendor Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={vendor.logo}
                        alt={`${vendor.name} logo`}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-lg text-slate-800">{vendor.name}</h3>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-3 w-3 mr-1" />
                          {vendor.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{vendor.rating}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {vendor.reviewCount} reviews
                      </div>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-4">
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      {vendor.priceRange}
                    </Badge>
                  </div>

                  {/* Specialties */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {vendor.specialties.slice(0, 3).map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <blockquote className="text-sm text-gray-700 italic mb-2">
                      "{vendor.testimonial}"
                    </blockquote>
                    <cite className="text-xs font-medium text-gray-600">
                      - {vendor.testimonialAuthor}
                    </cite>
                  </div>

                  {/* Action Button */}
                  <Link href={`/vendor/${vendor.id}`} className="block">
                    <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dots Pagination */}
          {showDots && totalSlides > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex
                      ? 'bg-red-500'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/vendors/all">
            <Button variant="outline" size="lg" className="px-8">
              View All Vendors
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}