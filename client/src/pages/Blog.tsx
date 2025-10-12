import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { BlogPost } from "@shared/schema";
import NewsletterSignup from "@/components/engagement/NewsletterSignup";

export default function Blog() {
  const [search, setSearch] = useState("");
  
  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const filteredPosts = blogPosts?.filter((post: BlogPost) => 
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Wedding Blog & Inspiration
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Discover the latest wedding trends, planning tips, and Goan traditions to make your special day unforgettable
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="mb-8">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Blog Posts */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-300 h-48 rounded-t-lg"></div>
                    <div className="bg-white p-6 rounded-b-lg">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded mb-4"></div>
                      <div className="h-8 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredPosts?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.map((post: BlogPost) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="group cursor-pointer hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden">
                      <img 
                        src={post.featuredImage || "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"} 
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
                          <span>{new Date(post.createdAt!).toLocaleDateString()}</span>
                          <span>5 min read</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No articles found</h3>
                <p className="text-gray-500">Try adjusting your search query</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Popular Categories</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Wedding Trends</span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Planning Tips</span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Goan Culture</span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">6</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Vendor Guides</span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">4</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Recent Posts</h3>
                <div className="space-y-4">
                  {blogPosts?.slice(0, 3).map((post: BlogPost) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <div className="flex gap-3 group cursor-pointer">
                        <img 
                          src={post.featuredImage || "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=80"} 
                          alt={post.title}
                          className="w-16 h-12 object-cover rounded" 
                        />
                        <div>
                          <h4 className="text-sm font-medium text-slate-800 group-hover:text-red-500 transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(post.createdAt!).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
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
