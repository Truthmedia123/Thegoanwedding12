import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { 
  Activity, 
  Users, 
  Eye, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  BarChart3,
  Globe
} from 'lucide-react';
import { useAnalytics } from '../components/Performance/Analytics';

interface PerformanceMetrics {
  pageLoadTime: number;
  fcp: number;
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
}

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: Array<{ page: string; views: number }>;
  topReferrers: Array<{ source: string; visits: number }>;
  deviceTypes: Array<{ device: string; percentage: number }>;
  locations: Array<{ location: string; visitors: number }>;
}

interface ErrorData {
  javascriptErrors: number;
  networkErrors: number;
  apiErrors: number;
  recentErrors: Array<{ error: string; timestamp: string; count: number }>;
}

export const MonitoringDashboard: React.FC = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
  });

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    pageViews: 0,
    uniqueVisitors: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    topPages: [],
    topReferrers: [],
    deviceTypes: [],
    locations: [],
  });

  const [errorData, setErrorData] = useState<ErrorData>({
    javascriptErrors: 0,
    networkErrors: 0,
    apiErrors: 0,
    recentErrors: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { trackUserInteraction } = useAnalytics();

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from your analytics API
      // For now, we'll simulate data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPerformanceMetrics({
        pageLoadTime: Math.random() * 2000 + 500,
        fcp: Math.random() * 1500 + 300,
        lcp: Math.random() * 2500 + 800,
        fid: Math.random() * 100 + 10,
        cls: Math.random() * 0.2,
        ttfb: Math.random() * 500 + 100,
      });

      setAnalyticsData({
        pageViews: Math.floor(Math.random() * 10000) + 5000,
        uniqueVisitors: Math.floor(Math.random() * 5000) + 2000,
        bounceRate: Math.random() * 30 + 20,
        avgSessionDuration: Math.random() * 300 + 120,
        topPages: [
          { page: '/', views: 2500 },
          { page: '/vendors', views: 1800 },
          { page: '/vendors/photographers', views: 1200 },
          { page: '/blog', views: 800 },
          { page: '/about', views: 600 },
        ],
        topReferrers: [
          { source: 'Google', visits: 1500 },
          { source: 'Facebook', visits: 800 },
          { source: 'Instagram', visits: 600 },
          { source: 'Direct', visits: 1200 },
          { source: 'Other', visits: 400 },
        ],
        deviceTypes: [
          { device: 'Mobile', percentage: 65 },
          { device: 'Desktop', percentage: 30 },
          { device: 'Tablet', percentage: 5 },
        ],
        locations: [
          { location: 'Goa', visitors: 2000 },
          { location: 'Mumbai', visitors: 800 },
          { location: 'Delhi', visitors: 600 },
          { location: 'Bangalore', visitors: 500 },
          { location: 'Other', visitors: 300 },
        ],
      });

      setErrorData({
        javascriptErrors: Math.floor(Math.random() * 10),
        networkErrors: Math.floor(Math.random() * 5),
        apiErrors: Math.floor(Math.random() * 3),
        recentErrors: [
          { error: 'TypeError: Cannot read property', timestamp: '2 minutes ago', count: 3 },
          { error: 'Network request failed', timestamp: '5 minutes ago', count: 1 },
          { error: 'API timeout', timestamp: '10 minutes ago', count: 2 },
        ],
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPerformanceScore = (): number => {
    let score = 100;
    
    if (performanceMetrics.fcp > 1800) score -= 20;
    if (performanceMetrics.lcp > 2500) score -= 20;
    if (performanceMetrics.fid > 100) score -= 20;
    if (performanceMetrics.cls > 0.1) score -= 20;
    if (performanceMetrics.pageLoadTime > 3000) score -= 20;
    
    return Math.max(0, score);
  };

  const getPerformanceColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatTime = (ms: number): string => {
    return `${ms.toFixed(0)}ms`;
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Monitoring Dashboard</h1>
          <p className="text-gray-600">Real-time performance and analytics</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getPerformanceColor(getPerformanceScore())}`}>
              {getPerformanceScore()}
            </div>
            <p className="text-xs text-muted-foreground">
              Core Web Vitals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Load Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(performanceMetrics.pageLoadTime)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average load time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.pageViews.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.uniqueVisitors.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Core Web Vitals */}
      <Card>
        <CardHeader>
          <CardTitle>Core Web Vitals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold">FCP</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatTime(performanceMetrics.fcp)}
              </div>
              <div className="text-xs text-gray-500">First Contentful Paint</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">LCP</div>
              <div className="text-2xl font-bold text-green-600">
                {formatTime(performanceMetrics.lcp)}
              </div>
              <div className="text-xs text-gray-500">Largest Contentful Paint</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">FID</div>
              <div className="text-2xl font-bold text-yellow-600">
                {formatTime(performanceMetrics.fid)}
              </div>
              <div className="text-xs text-gray-500">First Input Delay</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">CLS</div>
              <div className="text-2xl font-bold text-purple-600">
                {performanceMetrics.cls.toFixed(3)}
              </div>
              <div className="text-xs text-gray-500">Cumulative Layout Shift</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">TTFB</div>
              <div className="text-2xl font-bold text-red-600">
                {formatTime(performanceMetrics.ttfb)}
              </div>
              <div className="text-xs text-gray-500">Time to First Byte</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{page.page}</span>
                  <Badge variant="secondary">{page.views.toLocaleString()}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.topReferrers.map((referrer, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{referrer.source}</span>
                  <Badge variant="secondary">{referrer.visits.toLocaleString()}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Types and Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.deviceTypes.map((device, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{device.device}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full" 
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{device.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.locations.map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{location.location}</span>
                  <Badge variant="secondary">{location.visitors.toLocaleString()}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
            Error Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {errorData.javascriptErrors}
              </div>
              <div className="text-sm text-gray-600">JavaScript Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {errorData.networkErrors}
              </div>
              <div className="text-sm text-gray-600">Network Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {errorData.apiErrors}
              </div>
              <div className="text-sm text-gray-600">API Errors</div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Recent Errors</h4>
            <div className="space-y-2">
              {errorData.recentErrors.map((error, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-red-800">{error.error}</div>
                    <div className="text-xs text-red-600">{error.timestamp}</div>
                  </div>
                  <Badge variant="destructive">{error.count}</Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};