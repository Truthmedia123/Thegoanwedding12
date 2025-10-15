import React from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Store, 
  BarChart3, 
  FileText, 
  Mail, 
  TrendingUp,
  Eye,
  MessageSquare,
  Calendar
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [, setLocation] = useLocation();

  // Fetch real data from API
  const { data: vendors } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const response = await fetch('/api/vendors');
      if (!response.ok) return [];
      return response.json();
    }
  });

  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/summary');
      if (!response.ok) return { pageViews: 0, contactClicks: 0 };
      return response.json();
    }
  });

  const { data: weddings } = useQuery({
    queryKey: ['weddings'],
    queryFn: async () => {
      const response = await fetch('/api/weddings');
      if (!response.ok) return [];
      return response.json();
    }
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['recentActivity'],
    queryFn: async () => {
      const response = await fetch('/api/admin/recent-activity');
      if (!response.ok) return [];
      return response.json();
    }
  });

  const stats = [
    {
      title: 'Total Vendors',
      value: vendors?.length || 0,
      description: 'Wedding professionals',
      icon: Store,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Page Views',
      value: analytics?.pageViews || 0,
      description: 'This month',
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Contact Clicks',
      value: analytics?.contactClicks || 0,
      description: 'Vendor inquiries',
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Invitations',
      value: weddings?.length || 0,
      description: 'Wedding invitations sent',
      icon: Mail,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Vendors',
      description: 'Add, edit, or remove vendor listings',
      icon: Store,
      href: '/admin/vendors',
      color: 'hover:bg-green-50'
    },
    {
      title: 'View Analytics',
      description: 'Track user engagement and conversions',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'hover:bg-blue-50'
    },
    {
      title: 'Blog Management',
      description: 'Create and manage blog posts',
      icon: FileText,
      href: '/admin/blogs',
      color: 'hover:bg-purple-50'
    },
    {
      title: 'Invitations',
      description: 'View and manage wedding invitations',
      icon: Mail,
      href: '/admin/invitations',
      color: 'hover:bg-pink-50'
    }
  ];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Welcome to your admin control panel</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-xs text-gray-500">{stat.description}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`justify-start h-auto p-4 ${action.color}`}
                      onClick={() => setLocation(action.href)}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-gray-600" />
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{action.title}</p>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system events</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.slice(0, 5).map((activity: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${activity.color || 'bg-gray-500'}`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent activity</p>
                  <p className="text-sm mt-2">Activity will appear here as you use the system</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
