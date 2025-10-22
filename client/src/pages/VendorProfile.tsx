import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { FavoriteButton } from "@/components/engagement/FavoriteButton";
import { SocialShare } from "@/components/engagement/SocialShare";
import NewsletterSignup from "@/components/engagement/NewsletterSignup";
import { NewsArticles } from "@/components/NewsArticles";
import { vendorJSONLD } from "@/utils/seoStructuredData";
import { Helmet } from "react-helmet";
import type { Review } from "@shared/schema";
import { mockVendors } from "@/data/mockVendors";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// Extend window interface for social media SDKs
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
    FB?: {
      XFBML: {
        parse: () => void;
      };
    };
  }
}

type Service = string;
type GalleryImage = string;

// Update the convertVendorForJSONLD function to handle both field naming conventions
const convertVendorForJSONLD = (vendor: any): any => {
  return {
    id: vendor.id,
    name: vendor.name || "",
    description: vendor.description || "",
    category: vendor.category,
    phone: vendor.phone || "",
    email: vendor.email || "",
    website: vendor.website || undefined, // Convert null to undefined
    location: vendor.location || "",
    address: vendor.address || undefined, // Convert null to undefined
    profileImage: vendor.profile_image_url || vendor.profileImage || undefined, // Convert null to undefined
    coverImage: vendor.cover_image_url || vendor.coverImage || undefined, // Convert null to undefined
    rating: vendor.rating || 0,
    reviewCount: vendor.reviewCount || vendor.reviews_count || 0,
    priceRange: vendor.priceRange || undefined, // Convert null to undefined
  };
};

export default function VendorProfile() {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    customerName: "",
    customerEmail: "",
    rating: 5,
    comment: ""
  });

  const { data: vendor, isLoading } = useQuery<any>({
    queryKey: ['vendors', id], // Use consistent key
    queryFn: async () => {
      console.log('Fetching vendor with ID:', id);
      
      if (isSupabaseConfigured) {
        console.log('Loading vendor from Supabase...');
        const { data, error } = await supabase
          .from('vendors')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('Supabase error:', error);
          if (error.code === 'PGRST116') {
            // Not found
            return null;
          }
          throw new Error(`Failed to fetch vendor: ${error.message}`);
        }
        
        console.log('Vendor loaded from Supabase:', data);
        return data;
      } else {
        console.log('Supabase not configured, using localStorage + mock data');
        const storedVendors = JSON.parse(localStorage.getItem('vendors') || '[]');
        const allVendors = [...mockVendors, ...storedVendors];
        
        console.log('Total vendors available:', allVendors.length);
        
        // Find vendor by ID (convert to number for comparison)
        const vendorId = Number(id);
        const foundVendor = allVendors.find((v: any) => Number(v.id) === vendorId);
        
        console.log('Found vendor:', foundVendor);
        
        if (!foundVendor) {
          return null;
        }
        
        return foundVendor;
      }
    },
  });

  // Add Umami tracking for vendor page views
  useEffect(() => {
    if (vendor && typeof window !== 'undefined' && (window as any).umami) {
      (window as any).umami('vendor_page_view', { 
        vendor_id: vendor.id,
        vendor_name: vendor.name,
        vendor_category: vendor.category
      });
    }
  }, [vendor]);

  const { data: reviews } = useQuery<Review[]>({
    queryKey: [`/api/vendors/${id}/reviews`],
    queryFn: async () => {
      // Return empty reviews for now - can be extended to use localStorage
      return [];
    },
  });

  // Add Umami tracking for vendor page views
  useEffect(() => {
    if (vendor && typeof window !== 'undefined' && (window as any).umami) {
      (window as any).umami('vendor_page_view', { 
        vendor_id: vendor.id,
        vendor_name: vendor.name,
        vendor_category: vendor.category
      });
    }
  }, [vendor]);

  // Initialize social media embeds
  useEffect(() => {
    if (vendor?.embedCode) {
      // Process Instagram embeds
      if (typeof window !== 'undefined' && window.instgrm) {
        window.instgrm.Embeds.process();
      }

      // Process Facebook embeds
      if (typeof window !== 'undefined' && window.FB) {
        window.FB.XFBML.parse();
      }
    }
  }, [vendor?.embedCode]);

  // Add to recently viewed when component mounts
  useEffect(() => {
    if (vendor) {
      // Add to recently viewed
      const recentlyViewedHook = {
        addViewedVendor: (vendor: any) => {
          const item = {
            id: vendor.id?.toString() || "",
            name: vendor.name || "",
            category: vendor.category || "",
            location: vendor.location || "",
            rating: vendor.rating || 0,
            profileImage: vendor.profileImage || ""
          };
          localStorage.setItem('recentlyViewedVendors', JSON.stringify([
            {...item, viewedAt: Date.now()},
            ...JSON.parse(localStorage.getItem('recentlyViewedVendors') || '[]').slice(0, 9)
          ]));
        }
      };
      recentlyViewedHook.addViewedVendor(vendor);
    }
  }, [vendor]);

  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: typeof reviewForm) => {
      const response = await fetch(`/api/vendors/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      if (!response.ok) throw new Error('Failed to create review');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/vendors/${id}/reviews`] });
      queryClient.invalidateQueries({ queryKey: [`/api/vendors/${id}`] });
      toast({ title: "Review submitted successfully!" });
      setShowReviewForm(false);
      setReviewForm({ customerName: "", customerEmail: "", rating: 5, comment: "" });
    },
    onError: () => {
      toast({ title: "Failed to submit review", variant: "destructive" });
    },
  });

  const handleWhatsApp = () => {
    if (!vendor) return;
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

  const handleCall = () => {
    if (!vendor) return;
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

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    createReviewMutation.mutate(reviewForm);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor Not Found</h2>
            <p className="text-gray-600">The vendor you're looking for doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Convert vendor for JSON-LD
  const vendorForJSONLD = convertVendorForJSONLD(vendor);

  // Determine image sources based on available fields
  const coverImage = vendor.cover_image_url || vendor.coverImage || 
    vendor.profile_image_url || vendor.profileImage ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=800";

  const profileImage = vendor.profile_image_url || vendor.profileImage || 
    vendor.cover_image_url || vendor.coverImage ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500";

  // Determine gallery images based on available fields
  let galleryImages: string[] = [];
  if (vendor.images && Array.isArray(vendor.images)) {
    // Supabase stores images as array (used by YouTube sync)
    galleryImages = vendor.images;
  } else if (vendor.gallery_image_urls && Array.isArray(vendor.gallery_image_urls)) {
    galleryImages = vendor.gallery_image_urls;
  } else if (vendor.gallery && typeof vendor.gallery === 'string') {
    try {
      galleryImages = JSON.parse(vendor.gallery);
    } catch (e) {
      galleryImages = [];
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>{vendor.name || "Vendor"} - Wedding Vendor in Goa | TheGoanWedding</title>
        <meta name="description" content={vendor.description || ""} />
        <script type="application/ld+json">
          {JSON.stringify(vendorJSONLD(vendorForJSONLD))}
        </script>
      </Helmet>
      
      {/* Hero Section - 2 Images */}
      <section className="relative h-96">
        <div className="grid grid-cols-2 gap-1 h-full">
          {/* First Image */}
          <div className="relative h-full overflow-hidden">
            <img 
              src={coverImage} 
              alt={`${vendor.name} - Image 1`}
              className="w-full h-full object-cover" 
            />
          </div>
          
          {/* Second Image */}
          <div className="relative h-full overflow-hidden">
            <img 
              src={galleryImages[0] || profileImage} 
              alt={`${vendor.name} - Image 2`}
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
        
        {/* Overlay and Text */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
        <div className="absolute bottom-8 left-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            {vendor.featured && <Badge className="bg-red-500"><i className="fas fa-star mr-1"></i>Featured</Badge>}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{vendor.name || "Vendor"}</h1>
          <p className="text-xl capitalize">{vendor.category?.replace('-', ' ') || ""}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>About {vendor.name || "Vendor"}</CardTitle>
                  <FavoriteButton 
                    vendor={{
                      id: vendor.id?.toString() || "",
                      name: vendor.name || "",
                      category: vendor.category || "",
                      location: vendor.location || "",
                      rating: vendor.rating || 0,
                      profileImage: profileImage
                    }} 
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{vendor.description || ""}</p>
                
                {vendor.services && (vendor.services as unknown as Service[]).length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">Services Offered:</h3>
                    <div className="flex flex-wrap gap-2">
                      {(vendor.services as unknown as Service[]).map((service: Service, index: number) => (
                        <Badge key={index} variant="secondary">{service}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  <Carousel className="w-full">
                    <CarouselContent>
                      {galleryImages.map((image: string, index: number) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                          <img 
                            src={image} 
                            alt={`${vendor.name || "Vendor"} gallery ${index + 1}`}
                            className="w-full h-64 object-cover rounded-lg cursor-pointer" 
                            onClick={() => {
                              // Google Analytics tracking
                              if (typeof window !== 'undefined' && (window as any).gtag) {
                                (window as any).gtag('event', 'gallery_image_open', { 
                                  vendor_id: vendor.id,
                                  vendor_name: vendor.name,
                                  image_index: index
                                });
                              }
                            }}
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </CardContent>
              </Card>
            )}

            {/* Social Media Embeds */}
            {vendor.embedCode && (
              <Card>
                <CardHeader>
                  <CardTitle>Social Media Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="vendor-embed"
                    dangerouslySetInnerHTML={{ __html: vendor.embedCode }} 
                  />
                </CardContent>
              </Card>
            )}

            {/* Social Media Content */}
            {(vendor.instagram || vendor.youtube || vendor.facebook) && (
              <Card>
                <CardHeader>
                  <CardTitle>Follow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Instagram Integration */}
                    {vendor.instagram && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <i className="fab fa-instagram text-pink-500 text-xl"></i>
                          <h3 className="font-semibold">Instagram</h3>
                        </div>
                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl border">
                          <p className="text-sm text-gray-600 mb-3">
                            Follow on Instagram for the latest updates
                          </p>
                          <a 
                            href={vendor.instagram.startsWith('http') ? vendor.instagram : `https://instagram.com/${vendor.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all w-full justify-center"
                          >
                            <i className="fab fa-instagram"></i>
                            View Profile
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Facebook Integration */}
                    {vendor.facebook && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <i className="fab fa-facebook text-blue-500 text-xl"></i>
                          <h3 className="font-semibold">Facebook</h3>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border">
                          <p className="text-sm text-gray-600 mb-3">
                            Follow on Facebook for updates
                          </p>
                          <a 
                            href={vendor.facebook.startsWith('http') ? vendor.facebook : `https://facebook.com/${vendor.facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all w-full justify-center"
                          >
                            <i className="fab fa-facebook"></i>
                            View Page
                          </a>
                        </div>
                      </div>
                    )}

                    {/* YouTube Integration - Scrollable Gallery */}
                    {vendor.youtube && vendor.images && vendor.images.length > 0 && (
                      <div className="space-y-4 lg:col-span-3">
                        <div className="flex items-center gap-2">
                          <i className="fab fa-youtube text-red-500 text-xl"></i>
                          <h3 className="font-semibold">YouTube</h3>
                        </div>
                        <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border">
                          <p className="text-sm text-gray-600 mb-3">
                            Watch video portfolio and client testimonials
                          </p>
                          
                          {/* Scrollable YouTube Video Gallery with Arrows */}
                          <Carousel className="w-full">
                            <CarouselContent>
                              {vendor.images.filter((img: string) => img.includes('ytimg.com')).slice(0, 10).map((thumbnail: string, index: number) => {
                                const videoId = thumbnail.match(/\/vi\/([^\/]+)\//)?.[1];
                                return videoId ? (
                                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                    <div className="p-1">
                                      <iframe
                                        width="100%"
                                        height="200"
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="rounded-lg"
                                      ></iframe>
                                    </div>
                                  </CarouselItem>
                                ) : null;
                              })}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                          </Carousel>
                          
                          <a 
                            href={vendor.youtube.startsWith('http') ? vendor.youtube : vendor.youtube.startsWith('UC') ? `https://youtube.com/channel/${vendor.youtube}` : `https://youtube.com/${vendor.youtube}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all mt-4"
                          >
                            <i className="fab fa-youtube"></i>
                            View YouTube Channel
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* In the News Section */}
            {vendor.name && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <i className="fas fa-newspaper text-blue-600"></i>
                    In the News
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <NewsArticles vendorName={vendor.name} />
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Reviews & Ratings</CardTitle>
                  <Button onClick={() => setShowReviewForm(!showReviewForm)}>
                    Write a Review
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-slate-50 rounded-lg">
                    <h3 className="font-semibold mb-4">Write a Review</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          value={reviewForm.customerName}
                          onChange={(e) => setReviewForm({...reviewForm, customerName: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email (Optional)</Label>
                        <Input
                          id="email"
                          type="email"
                          value={reviewForm.customerEmail}
                          onChange={(e) => setReviewForm({...reviewForm, customerEmail: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Label>Rating</Label>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({...reviewForm, rating: star})}
                            className={`text-2xl ${star <= reviewForm.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                          >
                            <i className="fas fa-star"></i>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="comment">Your Review</Label>
                      <Textarea
                        id="comment"
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                        required
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        disabled={createReviewMutation.isPending}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                <div className="space-y-4">
                  {reviews?.map((review: Review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{review.customer_name || "Anonymous"}</h4>
                          <div className="flex text-yellow-500">
                            {[...Array(review.rating || 0)].map((_, i) => (
                              <i key={i} className="fas fa-star text-sm"></i>
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {review.created_at ? new Date(review.created_at).toLocaleDateString() : ""}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment || ""}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i} 
                        className={`fas fa-star ${i < Math.floor(Number(vendor.rating || 0)) ? '' : 'text-gray-300'}`}
                      ></i>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {vendor.rating || 0} ({vendor.reviewCount || 0} reviews)
                  </span>
                </div>

                <div className="flex items-center text-gray-600">
                  <i className="fas fa-map-marker-alt mr-3 text-red-500"></i>
                  <span>{vendor.location || ""}</span>
                </div>

                {vendor.address && (
                  <div className="flex items-start text-gray-600">
                    <i className="fas fa-home mr-3 text-red-500 mt-1"></i>
                    <span>{vendor.address}</span>
                  </div>
                )}

                {vendor.google_maps_place_id && (
                  <div className="pt-3 border-t">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${vendor.google_maps_place_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <i className="fas fa-map-marked-alt text-lg"></i>
                      <span>View on Google Maps</span>
                      <i className="fas fa-external-link-alt text-xs"></i>
                    </a>
                  </div>
                )}

                {vendor.priceRange && (
                  <div className="flex items-center text-gray-600">
                    <i className="fas fa-rupee-sign mr-3 text-red-500"></i>
                    <span>{vendor.priceRange}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Button 
                    onClick={handleWhatsApp}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <i className="fab fa-whatsapp mr-2"></i>WhatsApp
                  </Button>
                  
                  <Button 
                    onClick={handleCall}
                    className="w-full bg-red-500 hover:bg-red-600 text-white"
                  >
                    <i className="fas fa-phone mr-2"></i>Call Now
                  </Button>
                  
                  {vendor.email && (
                    <Button 
                      onClick={() => window.location.href = `mailto:${vendor.email}`}
                      variant="outline" 
                      className="w-full"
                    >
                      <i className="fas fa-envelope mr-2"></i>Send Email
                    </Button>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Share this Vendor</h4>
                  <SocialShare 
                    url={window.location.href}
                    title={vendor.name || ""}
                    description={vendor.description || ""}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}