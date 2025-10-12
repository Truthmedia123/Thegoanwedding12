import React from 'react';
import InvitationEditor from './InvitationEditor';
import SupabaseSearch from './SupabaseSearch';
import VendorAvailabilityTracker from './VendorAvailabilityTracker';

const TestAllComponents: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Component Integration Test</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Invitation Editor</h2>
        <div className="border rounded-lg p-4">
          <InvitationEditor />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Supabase Search</h2>
        <div className="border rounded-lg p-4">
          <SupabaseSearch />
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Vendor Availability Tracker</h2>
        <div className="border rounded-lg p-4">
          <VendorAvailabilityTracker />
        </div>
      </div>
    </div>
  );
};

export default TestAllComponents;