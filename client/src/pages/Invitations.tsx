import React from 'react';
import InvitationEditor from '@/components/InvitationEditor';

const InvitationsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Wedding Invitation Editor</h1>
        <p className="text-gray-600 mt-2">Create beautiful wedding invitations with our easy-to-use editor</p>
      </div>
      <InvitationEditor />
    </div>
  );
};

export default InvitationsPage;