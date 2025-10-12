import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  Crown, 
  Star, 
  Zap, 
  Check, 
  X, 
  Calendar,
  Download,
  CreditCard,
  BarChart3,
  Users,
  TrendingUp,
  Camera,
  Eye,
  MessageSquare,
  Smartphone,
  Shield
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import { useToast } from '../../hooks/use-toast';

// TypeScript Interfaces
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: 'monthly' | 'yearly';
  features: string[];
  maxPhotos: number;
  priorityListing: boolean;
  analytics: boolean;
  leadGeneration: boolean;
  icon: React.ReactNode;
  color: string;
  popular?: boolean;
}

interface VendorSubscription {
  vendorId: string;
  planId: string;
  status: 'active' | 'expired' | 'cancelled';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  usage: {
    photosUsed: number;
    inquiriesReceived: number;
    profileViews: number;
    leadGenerated: number;
  };
}

interface PaymentHistory {
  id: string;
  date: Date;
  amount: number;
  plan: string;
  status: 'success' | 'pending' | 'failed';
  invoiceUrl: string;
}

interface RevenueData {
  month: string;
  revenue: number;
  subscriptions: number;
}

// Mock Data
const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    duration: 'monthly',
    features: [
      'Basic business listing',
      'Up to 5 photos',
      'Contact information display',
      'Basic customer reviews',
      'Email support'
    ],
    maxPhotos: 5,
    priorityListing: false,
    analytics: false,
    leadGeneration: false,
    icon: <Shield className="h-6 w-6" />,
    color: 'from-gray-500 to-gray-600'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 2999,
    duration: 'monthly',
    features: [
      'Unlimited photos & videos',
      'Priority search placement',
      'Advanced analytics dashboard',
      'Customer inquiry management',
      'Social media integration',
      'Phone & WhatsApp support',
      'Featured in newsletters'
    ],
    maxPhotos: -1, // unlimited
    priorityListing: true,
    analytics: true,
    leadGeneration: false,
    icon: <Star className="h-6 w-6" />,
    color: 'from-blue-500 to-blue-600',
    popular: true
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 4999,
    duration: 'monthly',
    features: [
      'Everything in Premium',
      'Featured listings on homepage',
      'Lead generation & referrals',
      'Marketing campaign inclusion',
      'Dedicated account manager',
      '24/7 priority support',
      'Custom branding options',
      'Exclusive vendor badge',
      'Industry networking events'
    ],
    maxPhotos: -1,
    priorityListing: true,
    analytics: true,
    leadGeneration: true,
    icon: <Crown className="h-6 w-6" />,
    color: 'from-purple-500 to-pink-500'
  }
];

const mockCurrentSubscription: VendorSubscription = {
  vendorId: 'vendor-123',
  planId: 'premium',
  status: 'active',
  startDate: new Date('2024-01-15'),
  endDate: new Date('2024-12-15'),
  autoRenew: true,
  usage: {
    photosUsed: 47,
    inquiriesReceived: 156,
    profileViews: 2847,
    leadGenerated: 23
  }
};

const mockPaymentHistory: PaymentHistory[] = [
  {
    id: 'pay-001',
    date: new Date('2024-01-15'),
    amount: 2999,
    plan: 'Premium Monthly',
    status: 'success',
    invoiceUrl: '/invoices/pay-001.pdf'
  },
  {
    id: 'pay-002',
    date: new Date('2023-12-15'),
    amount: 2999,
    plan: 'Premium Monthly',
    status: 'success',
    invoiceUrl: '/invoices/pay-002.pdf'
  },
  {
    id: 'pay-003',
    date: new Date('2023-11-15'),
    amount: 2999,
    plan: 'Premium Monthly',
    status: 'success',
    invoiceUrl: '/invoices/pay-003.pdf'
  }
];

const mockRevenueData: RevenueData[] = [
  { month: 'Jan', revenue: 145000, subscriptions: 52 },
  { month: 'Feb', revenue: 178000, subscriptions: 63 },
  { month: 'Mar', revenue: 203000, subscriptions: 71 },
  { month: 'Apr', revenue: 189000, subscriptions: 67 },
  { month: 'May', revenue: 234000, subscriptions: 82 },
  { month: 'Jun', revenue: 267000, subscriptions: 91 }
];

const VendorSubscriptionManager: React.FC = () => {
  const [currentSubscription, setCurrentSubscription] = useState<VendorSubscription>(mockCurrentSubscription);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Toggle for admin view
  const { toast } = useToast();

  const currentPlan = useMemo(() => 
    subscriptionPlans.find(plan => plan.id === currentSubscription.planId),
    [currentSubscription.planId]
  );

  const daysUntilRenewal = useMemo(() => {
    const today = new Date();
    const endDate = currentSubscription.endDate;
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [currentSubscription.endDate]);

  const usageData = [
    { name: 'Photos Used', value: currentSubscription.usage.photosUsed, max: currentPlan?.maxPhotos === -1 ? 100 : currentPlan?.maxPhotos || 5, color: '#8884d8' },
    { name: 'Profile Views', value: currentSubscription.usage.profileViews, max: 5000, color: '#82ca9d' },
    { name: 'Inquiries', value: currentSubscription.usage.inquiriesReceived, max: 200, color: '#ffc658' },
    { name: 'Leads Generated', value: currentSubscription.usage.leadGenerated, max: 50, color: '#ff7c7c' }
  ];

  const subscriptionDistribution = [
    { name: 'Free', value: 45, fill: '#9ca3af' },
    { name: 'Premium', value: 35, fill: '#3b82f6' },
    { name: 'Elite', value: 20, fill: '#a855f7' }
  ];

  const handleUpgrade = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentLoading(false);
      setShowPaymentModal(false);
      
      if (selectedPlan) {
        setCurrentSubscription(prev => ({
          ...prev,
          planId: selectedPlan.id,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        }));
        
        toast({
          title: 'Subscription Updated!',
          description: `Successfully upgraded to ${selectedPlan.name} plan.`,
        });
      }
    }, 3000);
  };

  const toggleAutoRenewal = () => {
    setCurrentSubscription(prev => ({
      ...prev,
      autoRenew: !prev.autoRenew
    }));
    
    toast({
      title: 'Auto-renewal Updated',
      description: `Auto-renewal has been ${currentSubscription.autoRenew ? 'disabled' : 'enabled'}.`,
    });
  };

  const downloadInvoice = (invoiceUrl: string) => {
    // Simulate invoice download
    toast({
      title: 'Download Started',
      description: 'Your invoice is being downloaded.',
    });
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Subscription Management
          </h1>
          <p className="text-gray-600 mt-2">Manage your vendor listing subscription and billing</p>
        </div>
        
        {/* Admin Toggle (for demo purposes) */}
        <div className="flex items-center space-x-2">
          <Label htmlFor="admin-toggle">Admin View</Label>
          <input
            id="admin-toggle"
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="toggle"
          />
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-fit">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Current Plan Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {currentPlan?.icon}
                <span>Current Plan: {currentPlan?.name}</span>
                {currentPlan?.popular && <Badge className="bg-blue-500">Popular</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge className="bg-green-500">{currentSubscription.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Next Renewal</span>
                    <span className="font-medium">{daysUntilRenewal} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Auto-renewal</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleAutoRenewal}
                    >
                      {currentSubscription.autoRenew ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Usage Statistics</h4>
                  {usageData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>{item.value}{item.max !== -1 ? ` / ${item.max}` : ''}</span>
                      </div>
                      <Progress 
                        value={item.max === -1 ? 50 : (item.value / item.max) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Public Profile
                    </Button>
                    <Button className="w-full" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics Dashboard
                    </Button>
                    <Button className="w-full" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Manage Inquiries
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 px-3 py-1">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${plan.color}`}>
                      {React.cloneElement(plan.icon as React.ReactElement, { className: 'h-6 w-6 text-white' })}
                    </div>
                    <span>{plan.name}</span>
                  </CardTitle>
                  <div className="text-3xl font-bold">
                    ₹{plan.price.toLocaleString()}
                    <span className="text-sm text-gray-600 font-normal">/{plan.duration}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className="w-full"
                    variant={plan.id === currentSubscription.planId ? "outline" : "default"}
                    onClick={() => plan.id !== currentSubscription.planId && handleUpgrade(plan)}
                    disabled={plan.id === currentSubscription.planId}
                  >
                    {plan.id === currentSubscription.planId ? 'Current Plan' : 'Upgrade Now'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPaymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${
                        payment.status === 'success' ? 'bg-green-100 text-green-600' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{payment.plan}</p>
                        <p className="text-sm text-gray-600">{payment.date.toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">₹{payment.amount.toLocaleString()}</p>
                        <Badge className={
                          payment.status === 'success' ? 'bg-green-500' :
                          payment.status === 'pending' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }>
                          {payment.status}
                        </Badge>
                      </div>
                      
                      {payment.status === 'success' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadInvoice(payment.invoiceUrl)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Invoice
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Tab */}
        {isAdmin && (
          <TabsContent value="admin" className="space-y-6">
            {/* Revenue Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Subscription Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={subscriptionDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {subscriptionDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold">₹12.4L</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Subscribers</p>
                      <p className="text-2xl font-bold">267</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Conversion Rate</p>
                      <p className="text-2xl font-bold">23.5%</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Churn Rate</p>
                      <p className="text-2xl font-bold">8.2%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade to {selectedPlan?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedPlan && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{selectedPlan.name} Plan</span>
                  <span className="text-xl font-bold">₹{selectedPlan.price.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-600">Billed {selectedPlan.duration}</p>
              </div>
            )}

            {/* Mock Payment Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="card-number">Card Number</Label>
                <Input id="card-number" placeholder="1234 5678 9012 3456" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="name">Cardholder Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handlePayment}
              disabled={paymentLoading}
            >
              {paymentLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay ₹{selectedPlan?.price.toLocaleString()}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorSubscriptionManager;