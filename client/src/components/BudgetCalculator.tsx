import React, { useState } from 'react';

const BudgetCalculator: React.FC = () => {
  const [budget, setBudget] = useState({
    venue: 0,
    catering: 0,
    photography: 0,
    decor: 0,
    attire: 0,
    entertainment: 0,
    miscellaneous: 0
  });

  const total = Object.values(budget).reduce((sum, value) => sum + value, 0);

  const handleChange = (field: string, value: string) => {
    setBudget(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Wedding Budget Calculator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(budget).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              min="0"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <div className="text-xl font-bold">
          Total Budget: ₹{total.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default BudgetCalculator;