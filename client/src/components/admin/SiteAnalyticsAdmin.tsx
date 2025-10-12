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
  Target
} from 'lucide-react';

interface AnalyticsData {
  overview: {
    totalVisits: number;
    uniqueVisitors: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: string;
    conversionRate: number;
  };
  timeSeriesData: Array<{
    date: string;
    visits: number;
    pageViews: number;
    uniqueVisitors: number;
  }>;
  topPages: Array<{
    page: string;
    visits: number;
    avgTimeOnPage: string;
    bounceRate: number;
  }>;
  geographicData: Array<{
    country: string;
    region: string;
    visits: number;
    percentage: number;
  }>;
  deviceData: Array<{
    device: string;
    visits: number;
    percentage: number;
    color: string;
  }>;
  sourceData: Array<{
    source: string;
    visits: number;
    conversions: number;
    conversionRate: number;
  }>;
  goalData: Array<{
    goal: string;
    completions: number;
    value: number;
    conversionRate: number;
  }>;
}

interface SiteAnalyticsAdminProps {
  matomoUrl?: string;
  siteId?: string;
  authToken?: string;
}

export default function SiteAnalyticsAdmin({ 
  matomoUrl = 'https://analytics.thegoanwedding.com',
  siteId = '1',
  authToken 
}: SiteAnalyticsAdminProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('last30days');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock data for demonstration - in real app this would come from Matomo API
  const mockAnalyticsData: AnalyticsData = {
    overview: {
      totalVisits: 15847,
      uniqueVisitors: 12356,
      pageViews: 34521,
      bounceRate: 42.5,
      avgSessionDuration: '3m 42s',
      conversionRate: 8.7
    },
    timeSeriesData: [
      { date: '2024-01-01', visits: 450, pageViews: 980, uniqueVisitors: 380 },
      { date: '2024-01-02', visits: 520, pageViews: 1150, uniqueVisitors: 420 },
      { date: '2024-01-03', visits: 480, pageViews: 1050, uniqueVisitors: 400 },
      { date: '2024-01-04', visits: 610, pageViews: 1320, uniqueVisitors: 510 },
      { date: '2024-01-05', visits: 580, pageViews: 1280, uniqueVisitors: 480 },
      { date: '2024-01-06', visits: 670, pageViews: 1450, uniqueVisitors: 550 },
      { date: '2024-01-07', visits: 720, pageViews: 1580, uniqueVisitors: 600 }
    ],
    topPages: [
      { page: '/', visits: 5430, avgTimeOnPage: '2m 15s', bounceRate: 35.2 },
      { page: '/vendors/all', visits: 3210, avgTimeOnPage: '4m 30s', bounceRate: 28.7 },
      { page: '/vendors/photographers', visits: 2890, avgTimeOnPage: '3m 45s', bounceRate: 31.4 },
      { page: '/search', visits: 2150, avgTimeOnPage: '5m 20s', bounceRate: 22.1 },
      { page: '/tools', visits: 1830, avgTimeOnPage: '6m 10s', bounceRate: 18.5 },
      { page: '/blog', visits: 1650, avgTimeOnPage: '3m 55s', bounceRate: 45.8 }
    ],
    geographicData: [
      { country: 'India', region: 'Goa', visits: 8450, percentage: 53.3 },
      { country: 'India', region: 'Maharashtra', visits: 2340, percentage: 14.8 },
      { country: 'India', region: 'Karnataka', visits: 1850, percentage: 11.7 },
      { country: 'India', region: 'Delhi', visits: 1230, percentage: 7.8 },
      { country: 'United States', region: 'California', visits: 890, percentage: 5.6 },
      { country: 'United Kingdom', region: 'London', visits: 560, percentage: 3.5 },
      { country: 'Others', region: '', visits: 527, percentage: 3.3 }
    ],
    deviceData: [
      { device: 'Mobile', visits: 9508, percentage: 60.0, color: '#8884d8' },
      { device: 'Desktop', visits: 4754, percentage: 30.0, color: '#82ca9d' },
      { device: 'Tablet', visits: 1585, percentage: 10.0, color: '#ffc658' }
    ],
    sourceData: [
      { source: 'Organic Search', visits: 6339, conversions: 87, conversionRate: 1.37 },
      { source: 'Direct', visits: 4754, conversions: 65, conversionRate: 1.37 },
      { source: 'Social Media', visits: 2218, conversions: 28, conversionRate: 1.26 },
      { source: 'Referral', visits: 1585, conversions: 19, conversionRate: 1.20 },
      { source: 'Email Campaign', visits: 951, conversions: 15, conversionRate: 1.58 }
    ],
    goalData: [
      { goal: 'Contact Form Submission', completions: 145, value: 2500, conversionRate: 0.91 },
      { goal: 'Vendor Inquiry', completions: 89, value: 1800, conversionRate: 0.56 },
      { goal: 'Newsletter Signup', completions: 234, value: 500, conversionRate: 1.48 },
    ]
  };

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin-jwt');
    if (!token) {
      setError('Admin authentication required');
      setIsLoading(false);
      return;
    }
    setIsAuthenticated(true);
    
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In real implementation, this would call Matomo API
      // const response = await fetch(`${matomoUrl}/index.php?module=API&method=VisitsSummary.get&idSite=${siteId}&period=day&date=${dateRange}&format=JSON&token_auth=${authToken}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalyticsData(mockAnalyticsData);
    } catch (err) {
      setError('Failed to fetch analytics data');
      console.error('Analytics fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async (format: 'csv' | 'json' | 'pdf') => {
    if (!analyticsData) return;
    
    const filename = `analytics-report-${new Date().toISOString().split('T')[0]}.${format}`;
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      // Convert top pages to CSV format
      const csvContent = [
        'Page,Visits,Avg Time On Page,Bounce Rate',
        ...analyticsData.topPages.map(page => 
          `"${page.page}",${page.visits},"${page.avgTimeOnPage}",${page.bounceRate}%`
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
            <p className="text-gray-600">Admin authentication required to view analytics dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-200 animate-pulse h-32 rounded-lg"></div>
          ))}
        </div>
        <div className="bg-gray-200 animate-pulse h-96 rounded-lg"></div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600 mb-4">{error || 'Failed to load analytics data'}</p>
            <Button onClick={fetchAnalyticsData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Analytics Dashboard</h1>
          <p className="text-gray-600">Site performance and visitor insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last3months">Last 3 Months</option>
          </select>
          <Button onClick={fetchAnalyticsData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => exportData('csv')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Visits</p>
                <p className="text-2xl font-bold text-blue-600">{analyticsData.overview.totalVisits.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                <p className="text-2xl font-bold text-green-600">{analyticsData.overview.uniqueVisitors.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Page Views</p>
                <p className="text-2xl font-bold text-purple-600">{analyticsData.overview.pageViews.toLocaleString()}</p>
              </div>
              <Globe className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                <p className="text-2xl font-bold text-orange-600">{analyticsData.overview.bounceRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Session</p>
                <p className="text-2xl font-bold text-indigo-600">{analyticsData.overview.avgSessionDuration}</p>
              </div>
              <Clock className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion</p>
                <p className="text-2xl font-bold text-red-600">{analyticsData.overview.conversionRate}%</p>
              </div>
              <Target className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="traffic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="traffic">Traffic Trends</TabsTrigger>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={analyticsData.timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="visits" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="uniqueVisitors" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Page</th>
                      <th className="text-left p-4">Visits</th>
                      <th className="text-left p-4">Avg Time</th>
                      <th className="text-left p-4">Bounce Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.topPages.map((page, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium">{page.page}</td>
                        <td className="p-4">{page.visits.toLocaleString()}</td>
                        <td className="p-4">{page.avgTimeOnPage}</td>
                        <td className="p-4">
                          <Badge variant={page.bounceRate < 30 ? "default" : page.bounceRate < 50 ? "secondary" : "destructive"}>
                            {page.bounceRate}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.geographicData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="visits"
                    >
                      {analyticsData.deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.sourceData.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{source.source}</div>
                        <div className="text-sm text-gray-600">{source.visits.toLocaleString()} visits</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{source.conversions}</div>
                        <div className="text-sm text-gray-600">{source.conversionRate}% conv.</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Goal Completions</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.goalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="goal" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completions" fill="#8884d8" />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}