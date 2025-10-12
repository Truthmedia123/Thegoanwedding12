import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SearchBar from "@/components/search/SearchBar";
import CategoryGrid from "@/components/vendor/CategoryGrid";
import SimplifiedVendorCard from "@/components/vendor/SimplifiedVendorCard";
import TestimonialSlider from "@/components/vendor/TestimonialSlider";
import NewsletterSignup from "@/components/engagement/NewsletterSignup";
import type { Vendor, BlogPost } from "@shared/schema";
import { useEffect } from "react";

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "TheGoanWedding.com",
  "url": "https://thegoanwedding.com",
  "logo": "https://thegoanwedding.com/assets/logo.png",
  "description": "Premium wedding vendor directory in Goa offering photographers, caterers, venues, decorators and more for your perfect Goan wedding celebration.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Goa",
    "addressCountry": "IN"
  },
  "sameAs": [
    "https://www.facebook.com/thegoanwedding",
    "https://www.instagram.com/thegoanwedding",
    "https://twitter.com/thegoanwedding"
  ]
};

console.log("Home module loaded");

export default function Home() {
  console.log("Home component rendering");
  
  const { data: featuredVendors, error: vendorsError, isLoading: vendorsLoading, isError: vendorsIsError } = useQuery<Vendor[]>({
    queryKey: ["/api/vendors/featured"],
  });

  const { data: blogPosts, error: blogError, isLoading: blogLoading, isError: blogIsError } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  // Add structured data to head
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Log any errors
  useEffect(() => {
    if (vendorsError) {
      console.error("Vendors query error:", vendorsError);
      console.error("Vendors error details:", {
        name: vendorsError.name,
        message: vendorsError.message,
        stack: vendorsError.stack
      });
    }
    
    if (blogError) {
      console.error("Blog query error:", blogError);
      console.error("Blog error details:", {
        name: blogError.name,
        message: blogError.message,
        stack: blogError.stack
      });
    }
    
    console.log("Home component state:", { 
      featuredVendors, 
      vendorsLoading, 
      vendorsIsError,
      vendorsError,
      blogPosts, 
      blogLoading,
      blogIsError,
      blogError
    });
  }, [featuredVendors, vendorsLoading, vendorsIsError, vendorsError, blogPosts, blogLoading, blogIsError, blogError]);

  console.log("Home component rendering with data:", { featuredVendors, blogPosts, vendorsLoading, blogLoading });

  // Show error state
  if (vendorsIsError || blogIsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Data Loading Error</h1>
          <p className="text-gray-700 mb-4">There was an error loading the homepage data.</p>
          {vendorsError && (
            <div className="mb-2">
              <p className="text-sm text-red-500 mb-1">Vendors Error: {vendorsError.message}</p>
              <p className="text-xs text-gray-500">Check browser console for detailed error information</p>
            </div>
          )}
          {blogError && (
            <div>
              <p className="text-sm text-red-500 mb-1">Blog Error: {blogError.message}</p>
              <p className="text-xs text-gray-500">Check browser console for detailed error information</p>
            </div>
          )}
          <div className="mt-4 flex flex-col gap-2">
            <button 
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              onClick={() => {
                // Clear any cached data and retry
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
              }}
            >
              Clear Cache and Reload
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section relative min-h-screen flex items-center overflow-hidden">
        {/* Background with parallax effect */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero.jpg"
            alt="Beautiful Goan beach wedding ceremony"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 hero-overlay"></div>
        </div>

        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="floating-element absolute top-20 left-10 w-4 h-4 bg-yellow-400 rounded-full opacity-60 hidden md:block"></div>
          <div className="floating-element absolute top-40 right-20 w-6 h-6 bg-teal-400 rounded-full opacity-40 hidden md:block"></div>
          <div className="floating-element absolute bottom-40 left-20 w-3 h-3 bg-red-400 rounded-full opacity-50 hidden lg:block"></div>
          <div className="floating-element absolute bottom-60 right-40 w-5 h-5 bg-yellow-300 rounded-full opacity-30 hidden lg:block"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center">
            <div className="animate-fade-in-up">
              {/* Elegant subtitle */}
              <p className="wedding-script text-xl md:text-2xl lg:text-3xl text-yellow-300 mb-3 md:mb-4 opacity-90">
                Where Dreams Come True
              </p>

              {/* Main heading with ornaments */}
              <h1 className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-bold text-white mb-4 md:mb-6 leading-none px-2 sm:px-0">
                <span className="block -mb-2 md:-mb-4">Celebrate Your</span>
                <span className="goan-text-gradient ornament wedding-script text-4xl sm:text-5xl md:text-8xl lg:text-9xl">
                  Perfect Day
                </span>
                <span className="block text-2xl sm:text-3xl md:text-5xl lg:text-6xl mt-2 md:mt-4 text-teal-300">
                  Goan Style
                </span>
              </h1>

              {/* Enhanced description */}
              <p className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-8 md:mb-12 leading-relaxed max-w-4xl mx-auto px-4 sm:px-0">
                Discover Goa's most exquisite wedding vendors and create unforgettable memories.
                From stunning beach ceremonies to authentic traditional Goan celebrations.
              </p>

              {/* Trust indicators */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">500+</div>
                  <div className="text-sm text-gray-300">Trusted Vendors</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">1000+</div>
                  <div className="text-sm text-gray-300">Happy Couples</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">15+</div>
                  <div className="text-sm text-gray-300">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">5★</div>
                  <div className="text-sm text-gray-300">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <CategoryGrid />

      {/* Featured Vendors */}
      <section className="py-12 md:py-24 bg-gradient-to-b from-white to-slate-50 relative section-mobile">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-20">
            <p className="wedding-script text-xl md:text-2xl text-teal-600 mb-3 md:mb-4">
              Premium Selection
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-slate-800 mb-4 md:mb-6 section-title-mobile px-4 sm:px-0">
              Featured Vendors
            </h2>
            <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-teal-500 to-red-500 mx-auto mb-4 md:mb-6 rounded-full"></div>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed section-subtitle-mobile px-4 sm:px-0">
              Meet our carefully selected partners who have consistently delivered exceptional experiences.
              These trusted professionals are the heart of unforgettable Goan weddings.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6 mb-8 md:mb-12">
            {vendorsLoading ? (
              <div className="col-span-full text-center py-12">
                <p>Loading featured vendors...</p>
              </div>
            ) : featuredVendors ? featuredVendors.slice(0, 6).map((vendor: Vendor, index: number) => (
              <div
                key={vendor.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <SimplifiedVendorCard vendor={vendor} />
              </div>
            )) : null}
          </div>

          <div className="text-center px-4 sm:px-0">
            <Link href="/vendors/all">
              <div className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 hover:from-teal-600 hover:via-teal-700 hover:to-teal-800 text-white px-6 md:px-10 py-3 md:py-5 rounded-full font-bold text-base md:text-lg transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl mobile-btn">
                <span>Discover All Vendors</span>
                <i className="fas fa-star text-yellow-300"></i>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSlider />

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Planning Your Dream Wedding?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Join thousands of couples who have found their perfect wedding vendors in Goa. Start your journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vendors/all">
              <Button className="bg-white text-red-500 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg">
                <i className="fas fa-search mr-2"></i>Find Vendors Now
              </Button>
            </Link>
            <Link href="/list-business">
              <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-red-500 px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105">
                <i className="fas fa-plus mr-2"></i>List Your Business
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Wedding Inspiration & Tips
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the latest wedding trends, planning tips, and Goan traditions to make your special day unforgettable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogLoading ? (
              <div className="col-span-full text-center py-12">
                <p>Loading blog posts...</p>
              </div>
            ) : blogPosts ? blogPosts.slice(0, 3).map((post: BlogPost) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="group cursor-pointer hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden">
                  <img
                    src={post.featured_image || "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <CardContent className="p-6">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold mb-3 inline-block uppercase">
                      {post.category}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-3 group-hover:text-red-500 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{new Date(post.published_date || post.created_at!).toLocaleDateString()}</span>
                      <span>5 min read</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )) : null}
          </div>

          <div className="text-center mt-12">
            <Link href="/blog">
              <Button className="bg-slate-800 hover:bg-gray-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg">
                Read More Articles <i className="fas fa-arrow-right ml-2"></i>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}