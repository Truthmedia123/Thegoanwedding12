import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Globe, 
  Eye, 
  Clock, 
  MapPin, 
  Smartphone, 
  Monitor,
  RefreshCw,
  Download,
  Settings,
  Calendar,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle
} from 'lucide-react';

interface MobileDiscoveryMetrics {
  swipeToContactConversion: {
    photographers: number;
    venues: number;
    caterers: number;
    bandsDjs: number;
    makeupArtists: number;
    decorFlorists: number;
  };
  geographicData: Array<{
    city: string;
    users: number;
    percentage: number;
    trend: 'up' | 'down';
  }>;
  peakUsageTimes: Array<{
    hour: string;
    usage: number;
    percentage: number;
  }>;
  voiceSearchAnalytics: Array<{
    query: string;
    count: number;
    percentage: number;
  }>;
}

interface VendorPerformanceInsights {
  platformComparison: {
    mobileInquiries: number;
    desktopInquiries: number;
    mobileEngagement: number;
    desktopEngagement: number;
  };
  swipeEngagement: {
    vendorId: string;
    vendorName: string;
    swipeRate: number;
    avg: number;
  }[];
  seasonalTrends: Array<{
    category: string;
    season: string;
    swipeIncrease: number;
    inquiries: number;
  }>;
  competitiveAnalysis: Array<{
    category: string;
    avgInquiries: number;
    yourInquiries: number;
    difference: number;
  }>;
}

interface RevenueAnalytics {
  subscriptionUpgrades: {
    fromMobile: number;
    totalUpgrades: number;
    conversionRate: number;
  };
  chatToBooking: {
    mobileConversions: number;
    desktopConversions: number;
    mobileConversionRate: number;
    desktopConversionRate: number;
  };
  commissionRevenue: {
    mobileInitiated: number;
    totalRevenue: number;
    percentage: number;
  };
  roiAnalysis: {
    developmentInvestment: number;
    revenueGenerated: number;
    roi: number;
    paybackPeriod: string;
  };
}

interface BusinessIntelligence {
  marketOpportunities: Array<{
    category: string;
    opportunityScore: number;
    growthPotential: 'high' | 'medium' | 'low';
  }>;
  pricingOptimization: Array<{
    category: string;
    currentAvgPrice: string;
    suggestedPrice: string;
    potentialRevenueIncrease: number;
  }>;
  vendorRecruitment: Array<{
    location: string;
    category: string;
    demand: number;
    currentSupply: number;
    gap: number;
  }>;
  userAcquisition: {
    topChannels: Array<{
      channel: string;
      spend: number;
      conversions: number;
      costPerConversion: number;
    }>;
    recommendedSpend: Array<{
      channel: string;
      recommendedSpend: number;
      expectedRoas: number;
    }>;
  };
}

interface AnalyticsData {
  mobileDiscovery: MobileDiscoveryMetrics;
  vendorPerformance: VendorPerformanceInsights;
  revenue: RevenueAnalytics;
  businessIntelligence: BusinessIntelligence;
  lastUpdated: string;
}

export default function MobileAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('last30days');

  // Mock data for demonstration
  const mockAnalyticsData: AnalyticsData = {
    mobileDiscovery: {
      swipeToContactConversion: {
        photographers: 12.5,
        venues: 8.3,
        caterers: 15.2,
        bandsDjs: 9.7,
        makeupArtists: 18.4,
        decorFlorists: 11.8
      },
      geographicData: [
        { city: 'Mumbai', users: 2450, percentage: 28.5, trend: 'up' },
        { city: 'Delhi', users: 1870, percentage: 21.8, trend: 'up' },
        { city: 'Bangalore', users: 1230, percentage: 14.3, trend: 'down' },
        { city: 'Goa', users: 980, percentage: 11.4, trend: 'up' },
        { city: 'Pune', users: 760, percentage: 8.9, trend: 'up' },
        { city: 'Chennai', users: 620, percentage: 7.2, trend: 'down' },
        { city: 'Hyderabad', users: 540, percentage: 6.3, trend: 'up' },
        { city: 'Others', users: 140, percentage: 1.6, trend: 'down' }
      ],
      peakUsageTimes: [
        { hour: '6 AM', usage: 120, percentage: 3.2 },
        { hour: '7 AM', usage: 210, percentage: 5.6 },
        { hour: '8 AM', usage: 340, percentage: 9.1 },
        { hour: '9 AM', usage: 420, percentage: 11.2 },
        { hour: '10 AM', usage: 380, percentage: 10.1 },
        { hour: '11 AM', usage: 310, percentage: 8.3 },
        { hour: '12 PM', usage: 280, percentage: 7.5 },
        { hour: '1 PM', usage: 220, percentage: 5.9 },
        { hour: '2 PM', usage: 190, percentage: 5.1 },
        { hour: '3 PM', usage: 250, percentage: 6.7 },
        { hour: '4 PM', usage: 310, percentage: 8.3 },
        { hour: '5 PM', usage: 420, percentage: 11.2 },
        { hour: '6 PM', usage: 510, percentage: 13.6 },
        { hour: '7 PM', usage: 680, percentage: 18.1 },
        { hour: '8 PM', usage: 750, percentage: 20.0 },
        { hour: '9 PM', usage: 690, percentage: 18.4 },
        { hour: '10 PM', usage: 580, percentage: 15.5 },
        { hour: '11 PM', usage: 320, percentage: 8.5 }
      ],
      voiceSearchAnalytics: [
        { query: 'photographers under 50000', count: 142, percentage: 22.4 },
        { query: 'venues in north goa', count: 98, percentage: 15.5 },
        { query: 'caterers for 100 guests', count: 87, percentage: 13.7 },
        { query: 'wedding planners', count: 76, percentage: 12.0 },
        { query: 'makeup artists', count: 65, percentage: 10.3 },
        { query: 'bands and djs', count: 54, percentage: 8.5 },
        { query: 'floral decorators', count: 48, percentage: 7.6 },
        { query: 'mehndi artists', count: 32, percentage: 5.1 },
        { query: 'wedding cakes', count: 31, percentage: 4.9 }
      ]
    },
    vendorPerformance: {
      platformComparison: {
        mobileInquiries: 1247,
        desktopInquiries: 834,
        mobileEngagement: 24.5,
        desktopEngagement: 18.7
      },
      swipeEngagement: [
        { vendorId: '1', vendorName: 'Goa Wedding Photography', swipeRate: 15.2, avg: 12.4 },
        { vendorId: '2', vendorName: 'Beachside Venues', swipeRate: 18.7, avg: 14.2 },
        { vendorId: '3', vendorName: 'Goan Flavors Catering', swipeRate: 22.1, avg: 16.8 },
        { vendorId: '4', vendorName: 'Bollywood Beats DJ', swipeRate: 9.8, avg: 11.5 },
        { vendorId: '5', vendorName: 'Royal Makeup Artists', swipeRate: 25.4, avg: 19.3 },
        { vendorId: '6', vendorName: 'Floral Dreams Decor', swipeRate: 14.6, avg: 13.7 }
      ],
      seasonalTrends: [
        { category: 'Beach Photographers', season: 'Winter', swipeIncrease: 200, inquiries: 87 },
        { category: 'Beach Photographers', season: 'Summer', swipeIncrease: 0, inquiries: 29 },
        { category: 'Caterers', season: 'Winter', swipeIncrease: 45, inquiries: 56 },
        { category: 'Caterers', season: 'Summer', swipeIncrease: 15, inquiries: 48 },
        { category: 'Venues', season: 'Winter', swipeIncrease: 80, inquiries: 64 },
        { category: 'Venues', season: 'Summer', swipeIncrease: 30, inquiries: 42 }
      ],
      competitiveAnalysis: [
        { category: 'Photographers', avgInquiries: 25, yourInquiries: 32, difference: 7 },
        { category: 'Venues', avgInquiries: 18, yourInquiries: 22, difference: 4 },
        { category: 'Caterers', avgInquiries: 28, yourInquiries: 24, difference: -4 },
        { category: 'Makeup Artists', avgInquiries: 35, yourInquiries: 41, difference: 6 },
        { category: 'Decor & Florists', avgInquiries: 22, yourInquiries: 19, difference: -3 }
      ]
    },
    revenue: {
      subscriptionUpgrades: {
        fromMobile: 67,
        totalUpgrades: 124,
        conversionRate: 54.0
      },
      chatToBooking: {
        mobileConversions: 89,
        desktopConversions: 42,
        mobileConversionRate: 18.7,
        desktopConversionRate: 9.2
      },
      commissionRevenue: {
        mobileInitiated: 125000,
        totalRevenue: 187000,
        percentage: 66.8
      },
      roiAnalysis: {
        developmentInvestment: 250000,
        revenueGenerated: 487000,
        roi: 94.8,
        paybackPeriod: '8 months'
      }
    },
    businessIntelligence: {
      marketOpportunities: [
        { category: 'Wedding Planners', opportunityScore: 92, growthPotential: 'high' },
        { category: 'Mehndi Artists', opportunityScore: 87, growthPotential: 'high' },
        { category: 'Wedding Cakes', opportunityScore: 78, growthPotential: 'medium' },
        { category: 'Transportation', opportunityScore: 71, growthPotential: 'medium' },
        { category: 'Jewelry', opportunityScore: 65, growthPotential: 'medium' },
        { category: 'Mehndi Artists', opportunityScore: 87, growthPotential: 'high' }
      ],
      pricingOptimization: [
        { category: 'Photographers', currentAvgPrice: '₹45,000', suggestedPrice: '₹52,000', potentialRevenueIncrease: 15.6 },
        { category: 'Venues', currentAvgPrice: '₹2,50,000', suggestedPrice: '₹2,85,000', potentialRevenueIncrease: 14.0 },
        { category: 'Caterers', currentAvgPrice: '₹1,200/pp', suggestedPrice: '₹1,350/pp', potentialRevenueIncrease: 12.5 },
        { category: 'Makeup Artists', currentAvgPrice: '₹25,000', suggestedPrice: '₹28,500', potentialRevenueIncrease: 14.0 }
      ],
      vendorRecruitment: [
        { location: 'Mumbai', category: 'Photographers', demand: 120, currentSupply: 45, gap: 75 },
        { location: 'Delhi', category: 'Venues', demand: 85, currentSupply: 32, gap: 53 },
        { location: 'Bangalore', category: 'Caterers', demand: 95, currentSupply: 41, gap: 54 },
        { location: 'Pune', category: 'Makeup Artists', demand: 67, currentSupply: 28, gap: 39 },
        { location: 'Chennai', category: 'Decor & Florists', demand: 58, currentSupply: 22, gap: 36 }
      ],
      userAcquisition: {
        topChannels: [
          { channel: 'Google Ads', spend: 15000, conversions: 87, costPerConversion: 172 },
          { channel: 'Facebook Ads', spend: 12000, conversions: 64, costPerConversion: 188 },
          { channel: 'Instagram Ads', spend: 10000, conversions: 72, costPerConversion: 139 },
          { channel: 'Influencer Marketing', spend: 8000, conversions: 45, costPerConversion: 178 },
          { channel: 'Email Marketing', spend: 3000, conversions: 38, costPerConversion: 79 }
        ],
        recommendedSpend: [
          { channel: 'Google Ads', recommendedSpend: 18000, expectedRoas: 4.2 },
          { channel: 'Instagram Ads', recommendedSpend: 12000, expectedRoas: 4.8 },
          { channel: 'Email Marketing', recommendedSpend: 4000, expectedRoas: 6.1 },
          { channel: 'Influencer Marketing', recommendedSpend: 9000, expectedRoas: 3.9 }
        ]
      }
    },
    lastUpdated: new Date().toISOString()
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setAnalyticsData(mockAnalyticsData);
    } catch (err) {
      console.error('Analytics fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async (format: 'csv' | 'json' | 'pdf') => {
    if (!analyticsData) return;
    
    const filename = `mobile-analytics-report-${new Date().toISOString().split('T')[0]}.${format}`;
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center p-4">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold mb-2">Error loading analytics</h3>
          <p className="text-gray-600 mb-4">
            Failed to load analytics data. Please try again.
          </p>
          <Button onClick={fetchAnalyticsData}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Mobile Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Business intelligence for mobile vendor discovery</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="last7days">Last 7 days</option>
            <option value="last30days">Last 30 days</option>
            <option value="last90days">Last 90 days</option>
            <option value="lastYear">Last year</option>
          </select>
          <Button onClick={() => exportData('json')} variant="outline" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={fetchAnalyticsData} variant="outline" className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="mobile-discovery">Mobile Discovery</TabsTrigger>
          <TabsTrigger value="vendor-performance">Vendor Performance</TabsTrigger>
          <TabsTrigger value="business-intel">Business Intelligence</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mobile Conversion Rate</CardTitle>
                <Smartphone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.7%</div>
                <p className="text-xs text-muted-foreground">
                  +2.3% from last period
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mobile Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹1.25L</div>
                <p className="text-xs text-muted-foreground">
                  66.8% of total revenue
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Location</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Mumbai</div>
                <p className="text-xs text-muted-foreground">
                  28.5% of mobile users
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Peak Usage</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8-10 PM</div>
                <p className="text-xs text-muted-foreground">
                  Highest engagement hours
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mobile vs Desktop Inquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Mobile', inquiries: analyticsData.vendorPerformance.platformComparison.mobileInquiries },
                        { name: 'Desktop', inquiries: analyticsData.vendorPerformance.platformComparison.desktopInquiries }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="inquiries" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.mobileDiscovery.geographicData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="users"
                        nameKey="city"
                        label={({ city, percentage }) => `${city}: ${percentage}%`}
                      >
                        {analyticsData.mobileDiscovery.geographicData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7f50'][index % 8]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Users']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mobile-discovery" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Swipe-to-Contact Conversion Rates */}
            <Card>
              <CardHeader>
                <CardTitle>Swipe-to-Contact Conversion Rates</CardTitle>
                <p className="text-sm text-muted-foreground">By vendor category</p>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={Object.entries(analyticsData.mobileDiscovery.swipeToContactConversion).map(([category, rate]) => ({
                        name: category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                        rate
                      }))}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 25]} />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="rate" fill="#8884d8">
                        {Object.entries(analyticsData.mobileDiscovery.swipeToContactConversion).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'][index % 6]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Geographic Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Geographic Analysis</CardTitle>
                <p className="text-sm text-muted-foreground">Mobile user distribution</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.mobileDiscovery.geographicData.slice(0, 5).map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium">{location.city}</span>
                        {location.trend === 'up' ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500 ml-2" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500 ml-2" />
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">{location.users}</span>
                        <span className="text-muted-foreground">({location.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Peak Usage Times */}
            <Card>
              <CardHeader>
                <CardTitle>Peak Usage Times</CardTitle>
                <p className="text-sm text-muted-foreground">Mobile discovery engagement</p>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analyticsData.mobileDiscovery.peakUsageTimes}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="usage" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Voice Search Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Voice Search Analytics</CardTitle>
                <p className="text-sm text-muted-foreground">Top voice queries</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.mobileDiscovery.voiceSearchAnalytics.map((query, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{query.query}</span>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">{query.count}</span>
                        <span className="text-muted-foreground">({query.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendor-performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Platform Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Comparison</CardTitle>
                <p className="text-sm text-muted-foreground">Mobile vs Desktop performance</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {analyticsData.vendorPerformance.platformComparison.mobileInquiries}
                    </div>
                    <p className="text-sm text-muted-foreground">Mobile Inquiries</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {analyticsData.vendorPerformance.platformComparison.desktopInquiries}
                    </div>
                    <p className="text-sm text-muted-foreground">Desktop Inquiries</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {analyticsData.vendorPerformance.platformComparison.mobileEngagement}%
                    </div>
                    <p className="text-sm text-muted-foreground">Mobile Engagement</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {analyticsData.vendorPerformance.platformComparison.desktopEngagement}%
                    </div>
                    <p className="text-sm text-muted-foreground">Desktop Engagement</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Swipe Engagement Rates */}
            <Card>
              <CardHeader>
                <CardTitle>Swipe Engagement Rates</CardTitle>
                <p className="text-sm text-muted-foreground">Vendor performance comparison</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.vendorPerformance.swipeEngagement.map((vendor, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{vendor.vendorName}</span>
                        {vendor.swipeRate > vendor.avg && (
                          <Badge className="ml-2 bg-green-100 text-green-800">Above Avg</Badge>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">{vendor.swipeRate}%</span>
                        <span className="text-muted-foreground">(Avg: {vendor.avg}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Seasonal Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Trends</CardTitle>
                <p className="text-sm text-muted-foreground">Category performance by season</p>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analyticsData.vendorPerformance.seasonalTrends}
                      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="swipeIncrease" name="Swipe Increase (%)" fill="#8884d8" />
                      <Bar dataKey="inquiries" name="Inquiries" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Competitive Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Competitive Analysis</CardTitle>
                <p className="text-sm text-muted-foreground">Inquiry comparison by category</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.vendorPerformance.competitiveAnalysis.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{category.category}</span>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">{category.yourInquiries}</span>
                        <span className="text-muted-foreground mr-2">(Avg: {category.avgInquiries})</span>
                        {category.difference > 0 ? (
                          <span className="text-green-600 font-medium">+{category.difference}</span>
                        ) : (
                          <span className="text-red-600 font-medium">{category.difference}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business-intel" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
                <p className="text-sm text-muted-foreground">Mobile-driven financial metrics</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Subscription Upgrades</h4>
                        <p className="text-sm text-muted-foreground">From mobile users</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{analyticsData.revenue.subscriptionUpgrades.fromMobile}</div>
                        <p className="text-sm text-muted-foreground">{analyticsData.revenue.subscriptionUpgrades.conversionRate}% conversion</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Chat-to-Booking Conversion</h4>
                        <p className="text-sm text-muted-foreground">Mobile vs Desktop</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{analyticsData.revenue.chatToBooking.mobileConversionRate}%</div>
                        <p className="text-sm text-muted-foreground">vs {analyticsData.revenue.chatToBooking.desktopConversionRate}% desktop</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Commission Revenue</h4>
                        <p className="text-sm text-muted-foreground">Mobile-initiated bookings</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">₹{analyticsData.revenue.commissionRevenue.mobileInitiated.toLocaleString()}</div>
                        <p className="text-sm text-muted-foreground">{analyticsData.revenue.commissionRevenue.percentage}% of total</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">ROI Analysis</h4>
                        <p className="text-sm text-muted-foreground">Mobile development investment</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{analyticsData.revenue.roiAnalysis.roi}%</div>
                        <p className="text-sm text-muted-foreground">Payback in {analyticsData.revenue.roiAnalysis.paybackPeriod}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Market Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle>Market Opportunities</CardTitle>
                <p className="text-sm text-muted-foreground">High-potential vendor categories</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.businessIntelligence.marketOpportunities.map((opportunity, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{opportunity.category}</span>
                        <Badge 
                          className={`ml-2 ${
                            opportunity.growthPotential === 'high' 
                              ? 'bg-green-100 text-green-800' 
                              : opportunity.growthPotential === 'medium' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {opportunity.growthPotential}
                        </Badge>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">{opportunity.opportunityScore}</span>
                        <span className="text-muted-foreground">score</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Pricing Optimization */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing Optimization</CardTitle>
                <p className="text-sm text-muted-foreground">Revenue improvement suggestions</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.businessIntelligence.pricingOptimization.map((pricing, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{pricing.category}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Current: {pricing.currentAvgPrice} → Suggested: {pricing.suggestedPrice}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          +{pricing.potentialRevenueIncrease}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Vendor Recruitment */}
            <Card>
              <CardHeader>
                <CardTitle>Vendor Recruitment Targeting</CardTitle>
                <p className="text-sm text-muted-foreground">Supply-demand gaps by location</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.businessIntelligence.vendorRecruitment.slice(0, 4).map((target, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{target.location}</span>
                        <p className="text-sm text-muted-foreground">{target.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{target.gap} vendors</div>
                        <p className="text-sm text-muted-foreground">gap</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}