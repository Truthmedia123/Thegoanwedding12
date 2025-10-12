import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Search, Tag, ArrowRight, Heart } from 'lucide-react';

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  categories: string[];
  featuredImage: string;
  author: string;
  excerpt: string;
  tags: string[];
  readingTime: number;
}

interface BlogListProps {
  category?: string;
  tag?: string;
}

export default function BlogList({ category, tag }: BlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [selectedTag, setSelectedTag] = useState(tag || '');
  const [isLoading, setIsLoading] = useState(true);

  // Mock blog posts data - in real app this would come from MDX files or API
  const mockPosts: BlogPost[] = [
    {
      slug: 'roce-ceremony-goan-weddings',
      title: 'The Beautiful Tradition of Roce Ceremony in Goan Weddings',
      date: '2024-01-15',
      categories: ['Roce', 'Traditions', 'Goan Wedding'],
      featuredImage: '/api/placeholder/600/400',
      author: 'Maria Fernandes',
      excerpt: 'Discover the significance and rituals of the traditional Roce ceremony, a beautiful pre-wedding tradition that brings families together in Goan Catholic weddings.',
      tags: ['Goan traditions', 'Pre-wedding rituals', 'Catholic wedding', 'Family traditions'],
      readingTime: 8
    },
    {
      slug: 'chuddo-ceremony-goan-hindu-weddings',
      title: 'Chuddo Ceremony: The Sacred Thread Blessing in Goan Hindu Weddings',
      date: '2024-01-20',
      categories: ['Chuddo', 'Hindu Traditions', 'Goan Wedding'],
      featuredImage: '/api/placeholder/600/400',
      author: 'Priya Kamat',
      excerpt: 'Explore the sacred Chuddo ceremony, a beautiful Hindu tradition where the bride receives blessed threads and bangles, symbolizing marital bliss and prosperity.',
      tags: ['Hindu wedding', 'Goan traditions', 'Sacred threads', 'Bridal ceremonies'],
      readingTime: 6
    },
    {
      slug: 'portonem-traditional-engagement',
      title: 'Portonem: The Traditional Goan Engagement Ceremony',
      date: '2024-01-25',
      categories: ['Portonem', 'Engagement', 'Goan Wedding'],
      featuredImage: '/api/placeholder/600/400',
      author: 'Antonio Silva',
      excerpt: 'Learn about the Portonem ceremony, a formal engagement tradition in Goan Catholic families where the couple exchanges rings in the presence of both families.',
      tags: ['Engagement ceremony', 'Catholic traditions', 'Family gathering', 'Ring ceremony'],
      readingTime: 5
    },
    {
      slug: 'konkani-wedding-songs-traditions',
      title: 'Melodious Konkani Wedding Songs: Preserving Musical Heritage',
      date: '2024-01-30',
      categories: ['Music', 'Songs', 'Cultural Heritage'],
      featuredImage: '/api/placeholder/600/400',
      author: 'Sunita Borkar',
      excerpt: 'Explore the rich tradition of Konkani wedding songs, from soulful Mandos to joyful Dulpods, and their role in Goan wedding celebrations.',
      tags: ['Konkani music', 'Wedding songs', 'Cultural heritage', 'Traditional music'],
      readingTime: 7
    },
    {
      slug: 'goan-wedding-cuisine-traditional-feast',
      title: 'Traditional Goan Wedding Feast: A Culinary Journey',
      date: '2024-02-05',
      categories: ['Food', 'Cuisine', 'Wedding Planning'],
      featuredImage: '/api/placeholder/600/400',
      author: 'Chef Miguel D\'Costa',
      excerpt: 'Discover the authentic flavors of traditional Goan wedding feasts, featuring classic dishes that have been served at celebrations for generations.',
      tags: ['Goan cuisine', 'Wedding food', 'Traditional recipes', 'Feast planning'],
      readingTime: 9
    },
    {
      slug: 'beach-wedding-planning-goa',
      title: 'Beach Wedding Planning in Goa: Complete Guide',
      date: '2024-02-10',
      categories: ['Beach Wedding', 'Planning Tips', 'Venue'],
      featuredImage: '/api/placeholder/600/400',
      author: 'Isabella Pereira',
      excerpt: 'Everything you need to know about planning a stunning beach wedding in Goa, from legal requirements to decor ideas and vendor selection.',
      tags: ['Beach wedding', 'Wedding planning', 'Goa venues', 'Destination wedding'],
      readingTime: 10
    }
  ];

  const allCategories = ['all', 'Traditions', 'Planning Tips', 'Music', 'Food', 'Venue', 'Real Weddings'];
  const allTags = Array.from(new Set(mockPosts.flatMap(post => post.tags)));

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPosts(mockPosts);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => 
        post.categories.some(cat => cat.toLowerCase().includes(selectedCategory.toLowerCase()))
      );
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(post => 
        post.tags.some(tag => tag.toLowerCase().includes(selectedTag.toLowerCase()))
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredPosts(filtered);
  }, [posts, selectedCategory, selectedTag, searchQuery]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-200 h-96 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Goan Wedding Traditions Blog
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover the rich heritage of Goan weddings, from ancient ceremonies to modern celebrations. 
          Learn about traditions, get planning tips, and celebrate the beauty of Goan culture.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-12">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search blog posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-8">
        <p className="text-gray-600">
          Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
          {selectedCategory !== 'all' && ` in "${selectedCategory}"`}
          {selectedTag && ` tagged with "${selectedTag}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Blog Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Card key={post.slug} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Featured Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-red-500 text-white">
                    {post.categories[0]}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-white/90 text-gray-700">
                    <Clock className="h-3 w-3 mr-1" />
                    {post.readingTime} min read
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Title */}
                <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                  {post.title}
                </h3>

                {/* Meta Information */}
                <div className="flex items-center text-sm text-gray-600 mb-3 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(post.date)}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.author}
                  </div>
                </div>

                {/* Excerpt */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                  {post.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{post.tags.length - 2} more
                    </Badge>
                  )}
                </div>

                {/* Read More Button */}
                <Link href={`/blog/${post.slug}`}>
                  <Button className="w-full bg-red-500 hover:bg-red-600 text-white group">
                    Read Article
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // No Results
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Posts Found</h3>
            <p className="text-gray-500 mb-6">
              We couldn't find any blog posts matching your criteria. Try adjusting your filters or search terms.
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedTag('');
              }}
              variant="outline"
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      )}

      {/* Load More Button */}
      {filteredPosts.length > 0 && filteredPosts.length >= 6 && (
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Posts
          </Button>
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="mt-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-4">Stay Updated with Goan Wedding Traditions</h3>
        <p className="text-red-100 mb-6 max-w-2xl mx-auto">
          Subscribe to our newsletter and get the latest articles about Goan wedding traditions, 
          planning tips, and cultural insights delivered to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <Input 
            placeholder="Enter your email address" 
            className="bg-white text-gray-900 flex-1"
          />
          <Button className="bg-white text-red-600 hover:bg-red-50">
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
}