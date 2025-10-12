import React from 'react';
import TestAllComponents from '@/components/TestAllComponents';

const TestAllFeatures: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">All Features Test</h1>
        <p className="text-gray-600 mt-2">Testing all newly implemented features</p>
      </div>
      <TestAllComponents />
    </div>
  );
};

export default TestAllFeatures;