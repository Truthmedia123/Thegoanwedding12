import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BudgetCalculator from '@/components/BudgetCalculator';
import SeatingPlanner from '@/components/SeatingPlanner';
import CoupleSiteGenerator from '@/components/CoupleSiteGenerator';
import EnhancedVendorSearchFilters from '@/components/EnhancedVendorSearchFilters';
import VendorSpotlightCarousel from '@/components/VendorSpotlightCarousel';
import VendorSubscriptionManager from '@/components/vendor/VendorSubscriptionManager';
import VendorChatSystem from '@/components/communication/VendorChatSystem';
import GoanWeddingTimelinePlanner from '@/components/cultural/GoanWeddingTimelinePlanner';
import { Calculator, Users, Globe, Search, Sparkles, Smartphone, CreditCard, MessageSquare, Calendar } from 'lucide-react';

export default function WeddingTools() {
  const [activeTab, setActiveTab] = useState('budget');

  const tools = [
    {
      id: 'budget',
      title: 'Budget Calculator',
      description: 'Plan your wedding budget with interactive charts and breakdown',
      icon: Calculator,
      component: BudgetCalculator,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'timeline',
      title: 'Cultural Timeline',
      description: 'Plan authentic Goan wedding ceremonies and traditions',
      icon: Calendar,
      component: GoanWeddingTimelinePlanner,
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'seating',
      title: 'Seating Planner',
      description: 'Arrange your wedding seating with ease',
      icon: Users,
      component: SeatingPlanner,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'couple-site',
      title: 'Couple Site Generator',
      description: 'Create a beautiful wedding website in minutes',
      icon: Globe,
      component: CoupleSiteGenerator,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'vendor-search',
      title: 'Enhanced Vendor Search',
      description: 'Find the perfect vendors for your wedding',
      icon: Search,
      component: EnhancedVendorSearchFilters,
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'vendor-subscription',
      title: 'Vendor Subscription Manager',
      description: 'Manage your vendor subscriptions with ease',
      icon: CreditCard,
      component: VendorSubscriptionManager,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      id: 'vendor-chat',
      title: 'Vendor Chat System',
      description: 'Communicate with vendors in real-time',
      icon: MessageSquare,
      component: VendorChatSystem,
      color: 'from-blue-500 to-blue-600'
    }
  ];

  const currentTool = tools.find(tool => tool.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center py-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-yellow-500 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800">Wedding Planning Tools</h1>
            <Sparkles className="h-8 w-8 text-yellow-500 ml-3" />
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive suite of tools to plan your perfect Goan wedding
          </p>
        </div>

        {/* Tool Navigation Cards */}
        <div className="px-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card
                  key={tool.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    activeTab === tool.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setActiveTab(tool.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r ${tool.color} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{tool.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {tool.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tool Content */}
        <div className="px-6 pb-12">
          {currentTool && (
            <Card className="shadow-xl">
              <CardHeader className={`bg-gradient-to-r ${currentTool.color} text-white`}>
                <CardTitle className="flex items-center text-2xl">
                  <currentTool.icon className="h-6 w-6 mr-3" />
                  {currentTool.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <currentTool.component />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Features Overview */}
        <div className="px-6 pb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">Why Use Our Wedding Tools?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Calculator className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Comprehensive Planning</h3>
                  <p className="text-gray-600">
                    All-in-one suite covering budget, timeline, and more
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Real-time Collaboration</h3>
                  <p className="text-gray-600">
                    Share and collaborate with your partner and family
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Goan Wedding Focused</h3>
                  <p className="text-gray-600">
                    Tailored specifically for Goan wedding traditions and customs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Vendors */}
        <VendorSpotlightCarousel />
      </div>
    </div>
  );
}