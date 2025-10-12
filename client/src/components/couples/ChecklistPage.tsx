import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle, 
  Clock, 
  Users, 
  Search, 
  Filter,
  ChevronRight,
  Calendar,
  Star,
  TrendingUp,
  FileText
} from 'lucide-react';

interface ChecklistStep {
  title: string;
  details: string;
  priority: 'high' | 'medium' | 'low';
  timeline?: string;
  estimatedCost?: string;
  tips?: string[];
  relatedVendors?: string[];
}

interface Checklist {
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  featuredImage?: string;
  introduction?: string;
  steps: ChecklistStep[];
  conclusion?: string;
  tags?: string[];
  published: boolean;
  createdDate: string;
  lastUpdated: string;
}

interface ChecklistPageProps {
  category?: string;
}

export default function ChecklistPage({ category }: ChecklistPageProps) {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [filteredChecklists, setFilteredChecklists] = useState<Checklist[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - in real app this would come from Netlify CMS
  const mockChecklists: Checklist[] = [
    {
      slug: 'complete-wedding-planning-checklist',
      title: 'Complete Wedding Planning Checklist: 12-Month Timeline',
      description: 'A comprehensive month-by-month wedding planning checklist to ensure nothing is forgotten for your perfect Goan wedding.',
      category: 'wedding-planning',
      difficulty: 'beginner',
      estimatedTime: '12 months',
      featuredImage: '/api/placeholder/400/250',
      introduction: 'Planning a wedding can feel overwhelming, but with this comprehensive 12-month timeline, you\'ll stay organized and stress-free.',
      steps: [
        {
          title: 'Set Your Budget (12 months before)',
          details: 'Determine your overall wedding budget and allocate funds to different categories like venue, catering, photography, etc.',
          priority: 'high',
          timeline: '12 months before',
          estimatedCost: '₹0 (planning only)',
          tips: ['Be realistic about costs', 'Include a 10% buffer for unexpected expenses'],
          relatedVendors: ['wedding-planners']
        },
        {
          title: 'Choose Your Wedding Date (11 months before)',
          details: 'Select 2-3 preferred dates considering weather, holidays, and venue availability in Goa.',
          priority: 'high',
          timeline: '11 months before',
          tips: ['Avoid monsoon season in Goa', 'Consider guest travel time'],
          relatedVendors: ['venues']
        }
      ],
      tags: ['wedding planning', 'timeline', 'organization'],
      published: true,
      createdDate: '2024-01-10',
      lastUpdated: '2024-02-15'
    },
    {
      slug: 'vendor-selection-guide',
      title: 'How to Choose the Right Wedding Vendors',
      description: 'Essential guide for selecting and evaluating wedding vendors including photographers, caterers, decorators, and more.',
      category: 'vendor-selection',
      difficulty: 'intermediate',
      estimatedTime: '2-3 months',
      featuredImage: '/api/placeholder/400/250',
      steps: [
        {
          title: 'Research and Create Vendor Lists',
          details: 'Research potential vendors online, read reviews, and create shortlists for each category.',
          priority: 'high',
          timeline: '8-10 months before',
          tips: ['Check multiple review sources', 'Ask for recent work samples'],
          relatedVendors: ['photographers', 'caterers', 'decorators']
        },
        {
          title: 'Schedule Meetings and Interviews',
          details: 'Meet with shortlisted vendors to discuss your vision, check availability, and get detailed quotes.',
          priority: 'high',
          timeline: '6-8 months before',
          tips: ['Prepare a list of questions', 'Bring inspiration photos']
        }
      ],
      tags: ['vendor selection', 'interviews', 'planning'],
      published: true,
      createdDate: '2024-01-15',
      lastUpdated: '2024-02-10'
    },
    {
      slug: 'goan-beach-wedding-checklist',
      title: 'Beach Wedding Planning Checklist for Goa',
      description: 'Specialized checklist for planning a beautiful beach wedding in Goa, including permits, weather considerations, and logistics.',
      category: 'venue-selection',
      difficulty: 'advanced',
      estimatedTime: '8-10 months',
      featuredImage: '/api/placeholder/400/250',
      steps: [
        {
          title: 'Obtain Beach Wedding Permits',
          details: 'Research and apply for necessary permits for beach wedding ceremonies in Goa.',
          priority: 'high',
          timeline: '8-10 months before',
          estimatedCost: '₹5,000 - ₹15,000',
          tips: ['Start permit process early', 'Check local regulations'],
          relatedVendors: ['wedding-planners', 'venues']
        }
      ],
      tags: ['beach wedding', 'Goa', 'permits', 'outdoor'],
      published: true,
      createdDate: '2024-01-20',
      lastUpdated: '2024-02-05'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'wedding-planning', label: 'Wedding Planning' },
    { value: 'vendor-selection', label: 'Vendor Selection' },
    { value: 'budget-management', label: 'Budget Management' },
    { value: 'venue-selection', label: 'Venue Selection' },
    { value: 'traditional-ceremonies', label: 'Traditional Ceremonies' }
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  useEffect(() => {
    // Simulate loading from CMS
    setTimeout(() => {
      setChecklists(mockChecklists);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = checklists.filter(checklist => checklist.published);

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(checklist => checklist.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(checklist => checklist.difficulty === selectedDifficulty);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(checklist => 
        checklist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        checklist.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        checklist.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort by last updated
    filtered.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

    setFilteredChecklists(filtered);
  }, [checklists, selectedCategory, selectedDifficulty, searchQuery]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-200 h-80 rounded-lg"></div>
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
          Wedding Planning Checklists & Guides
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive guides and checklists to help you plan your perfect Goan wedding. 
          Stay organized and never miss important details with our expert-curated resources.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{checklists.length}</div>
            <div className="text-sm text-gray-600">Total Checklists</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">
              {checklists.filter(c => c.category === 'wedding-planning').length}
            </div>
            <div className="text-sm text-gray-600">Planning Guides</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {checklists.filter(c => c.category === 'vendor-selection').length}
            </div>
            <div className="text-sm text-gray-600">Vendor Guides</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {checklists.filter(c => c.difficulty === 'beginner').length}
            </div>
            <div className="text-sm text-gray-600">Beginner Friendly</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search checklists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              variant="outline"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredChecklists.length} checklist{filteredChecklists.length !== 1 ? 's' : ''}
          {selectedCategory !== 'all' && ` in "${getCategoryLabel(selectedCategory)}"`}
          {selectedDifficulty !== 'all' && ` for ${selectedDifficulty} level`}
        </p>
      </div>

      {/* Checklists Grid */}
      {filteredChecklists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredChecklists.map((checklist) => (
            <Card key={checklist.slug} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Featured Image */}
              {checklist.featuredImage && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={checklist.featuredImage}
                    alt={checklist.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={getDifficultyColor(checklist.difficulty)}>
                      {checklist.difficulty}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-white/90 text-gray-700">
                      <Clock className="h-3 w-3 mr-1" />
                      {checklist.estimatedTime}
                    </Badge>
                  </div>
                </div>
              )}

              <CardContent className="p-6">
                {/* Category */}
                <div className="mb-3">
                  <Badge className="bg-red-100 text-red-800">
                    {getCategoryLabel(checklist.category)}
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors">
                  {checklist.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {checklist.description}
                </p>

                {/* Steps Count */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {checklist.steps.length} steps
                  <Calendar className="h-4 w-4 ml-4 mr-1" />
                  Updated {new Date(checklist.lastUpdated).toLocaleDateString()}
                </div>

                {/* Tags */}
                {checklist.tags && checklist.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {checklist.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {checklist.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{checklist.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Action Button */}
                <Link href={`/checklists/${checklist.slug}`}>
                  <Button className="w-full bg-red-500 hover:bg-red-600 text-white group">
                    View Checklist
                    <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Checklists Found</h3>
            <p className="text-gray-500 mb-6">
              We couldn't find any checklists matching your criteria. Try adjusting your filters.
            </p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              variant="outline"
            >
              Clear All Filters
            </Button>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg p-8 text-center text-white">
        <h3 className="text-2xl font-bold mb-4">Need Personalized Planning Help?</h3>
        <p className="text-red-100 mb-6 max-w-2xl mx-auto">
          While our checklists provide comprehensive guidance, every wedding is unique. 
          Connect with our featured wedding planners for personalized assistance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/vendors/wedding-planners">
            <Button className="bg-white text-red-600 hover:bg-red-50">
              Find Wedding Planners
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}