import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Plus, AlertTriangle } from 'lucide-react';

interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  category: string;
}

interface BudgetBreakdown {
  venue: number;
  catering: number;
  decor: number;
  photography: number;
  misc: number;
}

interface BudgetSummary {
  totalBudget: number;
  breakdown: BudgetBreakdown;
  lineItems: BudgetItem[];
  totalAllocated: number;
  remainingBudget: number;
  isOverBudget: boolean;
}

interface BudgetCalculatorProps {
  onBudgetChange?: (summary: BudgetSummary) => void;
  initialBudget?: number;
}

const COLORS = {
  venue: '#dc2626',
  catering: '#ea580c', 
  decor: '#16a34a',
  photography: '#2563eb',
  misc: '#7c3aed'
};

const CATEGORY_LABELS = {
  venue: 'Venue',
  catering: 'Catering',
  decor: 'Décor & Flowers',
  photography: 'Photography',
  misc: 'Miscellaneous'
};

export default function BudgetCalculator({ onBudgetChange, initialBudget = 500000 }: BudgetCalculatorProps) {
  const [totalBudget, setTotalBudget] = useState(initialBudget);
  const [breakdown, setBreakdown] = useState<BudgetBreakdown>({
    venue: 40,
    catering: 30,
    decor: 15,
    photography: 10,
    misc: 5
  });
  const [lineItems, setLineItems] = useState<BudgetItem[]>([
    { id: '1', name: 'Wedding Venue Booking', amount: 200000, category: 'venue' },
    { id: '2', name: 'Catering Services', amount: 150000, category: 'catering' },
    { id: '3', name: 'Floral Decorations', amount: 75000, category: 'decor' },
    { id: '4', name: 'Wedding Photography', amount: 50000, category: 'photography' }
  ]);

  // Calculate totals
  const totalAllocated = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const remainingBudget = totalBudget - totalAllocated;
  const isOverBudget = totalAllocated > totalBudget;

  // Calculate actual amounts from percentages
  const actualAmounts = {
    venue: (totalBudget * breakdown.venue) / 100,
    catering: (totalBudget * breakdown.catering) / 100,
    decor: (totalBudget * breakdown.decor) / 100,
    photography: (totalBudget * breakdown.photography) / 100,
    misc: (totalBudget * breakdown.misc) / 100
  };

  // Data for pie chart
  const chartData = Object.entries(actualAmounts).map(([key, value]) => ({
    name: CATEGORY_LABELS[key as keyof typeof CATEGORY_LABELS],
    value,
    color: COLORS[key as keyof typeof COLORS]
  }));

  // Handle percentage change
  const handlePercentageChange = (category: keyof BudgetBreakdown, value: number[]) => {
    const newValue = value[0];
    const oldValue = breakdown[category];
    const difference = newValue - oldValue;
    
    // Distribute the difference among other categories
    const otherCategories = (Object.keys(breakdown) as Array<keyof BudgetBreakdown>)
      .filter(key => key !== category);
    
    const redistributeAmount = -difference / otherCategories.length;
    
    const newBreakdown = { ...breakdown };
    newBreakdown[category] = newValue;
    
    otherCategories.forEach(cat => {
      newBreakdown[cat] = Math.max(0, newBreakdown[cat] + redistributeAmount);
    });
    
    // Ensure total equals 100
    const total = Object.values(newBreakdown).reduce((sum, val) => sum + val, 0);
    if (Math.abs(total - 100) > 0.1) {
      const adjustment = (100 - total) / otherCategories.length;
      otherCategories.forEach(cat => {
        newBreakdown[cat] += adjustment;
      });
    }
    
    setBreakdown(newBreakdown);
  };

  // Add new line item
  const addLineItem = () => {
    const newItem: BudgetItem = {
      id: Date.now().toString(),
      name: 'New Item',
      amount: 0,
      category: 'misc'
    };
    setLineItems([...lineItems, newItem]);
  };

  // Remove line item
  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  // Update line item
  const updateLineItem = (id: string, field: keyof BudgetItem, value: string | number) => {
    setLineItems(lineItems.map(item => 
      item.id === id ? { 
        ...item, 
        [field]: field === 'amount' ? Number(value) || 0 : value 
      } : item
    ));
  };

  // Create budget summary
  const budgetSummary: BudgetSummary = {
    totalBudget,
    breakdown,
    lineItems,
    totalAllocated,
    remainingBudget,
    isOverBudget
  };

  // Notify parent component of changes
  useEffect(() => {
    onBudgetChange?.(budgetSummary);
  }, [totalBudget, breakdown, lineItems]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Wedding Budget Calculator</h2>
        <p className="text-gray-600">Plan your perfect wedding within budget</p>
      </div>

      {/* Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Total Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="totalBudget">Total Wedding Budget (₹)</Label>
              <Input
                id="totalBudget"
                type="number"
                value={totalBudget || ''}
                onChange={(e) => setTotalBudget(e.target.value === '' ? 0 : Number(e.target.value))}
                className="text-2xl font-bold"
              />
            </div>
            
            {isOverBudget && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  Budget exceeded by ₹{(totalAllocated - totalBudget).toLocaleString()}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  ₹{totalBudget.toLocaleString()}
                </div>
                <div className="text-sm text-blue-600">Total Budget</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  ₹{totalAllocated.toLocaleString()}
                </div>
                <div className="text-sm text-green-600">Allocated</div>
              </div>
              <div className={`p-4 rounded-lg ${remainingBudget >= 0 ? 'bg-gray-50' : 'bg-red-50'}`}>
                <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-gray-600' : 'text-red-600'}`}>
                  ₹{Math.abs(remainingBudget).toLocaleString()}
                </div>
                <div className={`text-sm ${remainingBudget >= 0 ? 'text-gray-600' : 'text-red-600'}`}>
                  {remainingBudget >= 0 ? 'Remaining' : 'Over Budget'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {(Object.keys(breakdown) as Array<keyof BudgetBreakdown>).map(category => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between">
                    <Label className="font-medium">
                      {CATEGORY_LABELS[category]}
                    </Label>
                    <span className="text-sm font-medium">
                      {breakdown[category].toFixed(1)}% (₹{actualAmounts[category].toLocaleString()})
                    </span>
                  </div>
                  <Slider
                    value={[breakdown[category]]}
                    onValueChange={(value) => handlePercentageChange(category, value)}
                    max={80}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Visual Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Line Items Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Detailed Line Items</CardTitle>
            <Button onClick={addLineItem} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Item Name</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Amount (₹)</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">
                      <Input
                        value={item.name}
                        onChange={(e) => updateLineItem(item.id, 'name', e.target.value)}
                        className="w-full"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={item.category}
                        onChange={(e) => updateLineItem(item.id, 'category', e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={item.amount}
                        onChange={(e) => updateLineItem(item.id, 'amount', Number(e.target.value))}
                        className="w-full"
                      />
                    </td>
                    <td className="p-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeLineItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}