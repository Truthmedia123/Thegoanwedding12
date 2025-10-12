import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@shared/schema";

export default function BlogPostPage() {
  const { slug } = useParams();
  
  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: [`/api/blog/${slug}`],
  });

  const { data: recentPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
            <p className="text-gray-600 mb-4">The article you're looking for doesn't exist.</p>
            <Link href="/blog">
              <Button className="bg-red-500 hover:bg-red-600">Back to Blog</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Create sample content for demonstration
  const sampleContent = post.title.includes("Top 10 Goan Wedding Trends") ? `
    <p>Goa's wedding scene is evolving beautifully, blending traditional customs with modern Indian celebrations. Here are the top 10 trends that are defining Goan weddings this year:</p>
    
    <h2>1. Beach Ceremony with Cultural Fusion</h2>
    <p>Couples are increasingly choosing beachfront ceremonies that incorporate both Christian and Hindu traditions, creating a unique spiritual experience against Goa's stunning coastline.</p>
    
    <h2>2. Sustainable Wedding Practices</h2>
    <p>Eco-conscious couples are opting for biodegradable decorations, locally-sourced flowers, and minimal waste celebrations that respect Goa's natural beauty.</p>
    
    <h2>3. Traditional Goan Cuisine</h2>
    <p>From bebinca to sorpotel, couples are bringing authentic Goan flavors to their wedding menus, often featuring live cooking stations with local chefs.</p>
    
    <h2>4. Heritage-Inspired Decor</h2>
    <p>Traditional tiles, colonial arches, and vintage elements are being incorporated into wedding decor for that authentic Goan aesthetic.</p>
    
    <h2>5. Intimate Destination Weddings</h2>
    <p>Smaller, more intimate celebrations are trending, with couples choosing boutique venues that offer personalized experiences for their close family and friends.</p>
  ` : `
    <p>${post.excerpt}</p>
    <p>This comprehensive guide covers everything you need to know about planning your perfect wedding celebration in Goa. From vendor selection to cultural considerations, we'll walk you through each step of the process.</p>
    <p>Goa offers a unique blend of Indian cultures, creating the perfect backdrop for unforgettable wedding celebrations. Whether you're planning an intimate beach ceremony or a grand celebration, this guide will help you navigate the process with confidence.</p>
  `;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-96">
        <img 
          src={post.featuredImage || "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&h=800"} 
          alt={post.title}
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute bottom-8 left-8 text-white max-w-4xl">
          <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4 inline-block uppercase">
            {post.category}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          <p className="text-lg opacity-90">{post.excerpt}</p>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <span>{new Date(post.createdAt!).toLocaleDateString()}</span>
            <span>•</span>
            <span>5 min read</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: sampleContent }}
                />
                
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 pt-8 border-t">
                    <h3 className="font-semibold mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-slate-100 px-3 py-1 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Share */}
                <div className="mt-8 pt-8 border-t">
                  <h3 className="font-semibold mb-3">Share this article</h3>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
                      size="sm" 
                      variant="outline"
                    >
                      <i className="fab fa-facebook mr-2"></i>Facebook
                    </Button>
                    <Button 
                      onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=${post.title}`, '_blank')}
                      size="sm" 
                      variant="outline"
                    >
                      <i className="fab fa-twitter mr-2"></i>Twitter
                    </Button>
                    <Button 
                      onClick={() => window.open(`https://wa.me/?text=${post.title} ${window.location.href}`, '_blank')}
                      size="sm" 
                      variant="outline"
                    >
                      <i className="fab fa-whatsapp mr-2"></i>WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">More Articles</h3>
                <div className="space-y-4">
                  {recentPosts?.filter(p => p.id !== post.id).slice(0, 3).map((relatedPost) => (
                    <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                      <div className="flex gap-3 group cursor-pointer">
                        <img 
                          src={relatedPost.featuredImage || "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=80"} 
                          alt={relatedPost.title}
                          className="w-16 h-12 object-cover rounded" 
                        />
                        <div>
                          <h4 className="text-sm font-medium text-slate-800 group-hover:text-red-500 transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(relatedPost.createdAt!).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Need Wedding Vendors?</h3>
                <p className="text-gray-600 mb-4">
                  Find the perfect vendors for your Goan wedding from our curated directory.
                </p>
                <Link href="/vendors/all">
                  <Button className="w-full bg-red-500 hover:bg-red-600">
                    Browse Vendors
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
