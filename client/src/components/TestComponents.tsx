import React from 'react';
import VendorAvailabilityTracker from './VendorAvailabilityTracker';

const TestComponents: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Component Tests</h1>
      
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Vendor Availability Tracker</h2>
        <VendorAvailabilityTracker />
      </div>
    </div>
  );
};

export default TestComponents;