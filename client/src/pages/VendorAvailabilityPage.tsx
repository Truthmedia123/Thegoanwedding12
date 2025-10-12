import React from 'react';
import VendorAvailabilityTracker from '@/components/VendorAvailabilityTracker';

const VendorAvailabilityPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Vendor Availability Tracker</h1>
        <p className="text-gray-600 mt-2">Real-time updates on vendor availability</p>
      </div>
      <VendorAvailabilityTracker />
    </div>
  );
};

export default VendorAvailabilityPage;