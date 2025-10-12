import React from 'react';
import EnhancedSearch from '@/components/EnhancedSearch';

const EnhancedSearchPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Enhanced Vendor Search</h1>
        <p className="text-gray-600 mt-2">Find the perfect wedding vendors with our powerful search</p>
      </div>
      <EnhancedSearch />
    </div>
  );
};

export default EnhancedSearchPage;