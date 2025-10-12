import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Eye, 
  MessageSquare, 
  Mail, 
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('views');

  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_analytics')
        .select(`
          *,
          vendors(name)
        `)
        .gte('created_at', getDateRange(timeRange));
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch vendor stats
  const { data: vendorStats } = useQuery({
    queryKey: ['vendor-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('id, name, category, location');
      
      if (error) throw error;
      return data;
    }
  });

  const getDateRange = (range: string) => {
    const now = new Date();
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return startDate.toISOString();
  };

  // Process analytics data
  const processedData = React.useMemo(() => {
    if (!analytics) return { chartData: [], topVendors: [], eventTypes: [] };

    // Group by date
    const dateGroups = analytics.reduce((acc: any, item: any) => {
      const date = new Date(item.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, views: 0, contacts: 0, reviews: 0, invitations: 0 };
      }
      acc[date][item.event_type] = (acc[date][item.event_type] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.values(dateGroups).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Top vendors by views
    const vendorViews = analytics.reduce((acc: any, item: any) => {
      if (item.event_type === 'view') {
        const vendorId = item.vendor_id;
        acc[vendorId] = (acc[vendorId] || 0) + 1;
      }
      return acc;
    }, {});

    const topVendors = Object.entries(vendorViews)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([vendorId, views]) => {
        const vendor = vendorStats?.find(v => v.id === parseInt(vendorId));
        return {
          name: vendor?.name || 'Unknown',
          views: views as number,
          category: vendor?.category || 'Unknown'
        };
      });

    // Event types distribution
    const eventTypes = analytics.reduce((acc: any, item: any) => {
      acc[item.event_type] = (acc[item.event_type] || 0) + 1;
      return acc;
    }, {});

    return { chartData, topVendors, eventTypes };
  }, [analytics, vendorStats]);

  const colors = ['#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  const exportData = () => {
    if (!analytics) return;
    
    const csv = [
      ['Date', 'Event Type', 'Vendor', 'User ID', 'Session ID'],
      ...analytics.map(item => [
        new Date(item.created_at).toISOString(),
        item.event_type,
        item.vendors?.name || 'Unknown',
        item.user_id || '',
        item.session_id || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${timeRange}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Track user engagement and vendor performance</p>
          </div>
          <div className="flex space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics?.filter(a => a.event_type === 'view').length || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Contact Clicks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics?.filter(a => a.event_type === 'contact_click').length || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics?.filter(a => a.event_type === 'review_submit').length || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Invitations</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics?.filter(a => a.event_type === 'invitation_send').length || 0}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-pink-100">
                  <Mail className="w-6 h-6 text-pink-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Activity Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Over Time</CardTitle>
              <CardDescription>User engagement trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={processedData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke="#ec4899" strokeWidth={2} />
                    <Line type="monotone" dataKey="contacts" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="reviews" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Event Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Event Types Distribution</CardTitle>
              <CardDescription>Breakdown of user actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(processedData.eventTypes).map(([name, value]) => ({ name, value }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {Object.entries(processedData.eventTypes).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Vendors */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Vendors</CardTitle>
            <CardDescription>Most viewed vendors in the selected time period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processedData.topVendors.map((vendor, index) => (
                <div key={vendor.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{vendor.name}</p>
                      <p className="text-sm text-gray-500">{vendor.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{vendor.views}</p>
                    <p className="text-sm text-gray-500">views</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* GA4 and Clarity Integration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Google Analytics 4</CardTitle>
              <CardDescription>Advanced analytics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 mb-2">GA4 Dashboard</p>
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Open GA4
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Microsoft Clarity</CardTitle>
              <CardDescription>User behavior and heatmaps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 mb-2">Clarity Dashboard</p>
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Open Clarity
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AnalyticsPage;
