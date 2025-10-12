import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { RefreshCw, X } from 'lucide-react';

export const UpdatePrompt: React.FC = () => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setShowUpdatePrompt(true);
      });
    }
  }, []);

  const handleUpdate = () => {
    setIsUpdating(true);
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
  };

  if (!showUpdatePrompt) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold text-gray-900">Update Available</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="h-6 w-6 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-gray-600 mb-3">
        A new version of the app is available. Update now for the latest features and improvements.
      </p>
      <div className="flex space-x-2">
        <Button 
          onClick={handleUpdate} 
          disabled={isUpdating}
          className="flex-1"
        >
          {isUpdating ? 'Updating...' : 'Update Now'}
        </Button>
        <Button variant="outline" onClick={handleDismiss}>
          Later
        </Button>
      </div>
    </div>
  );
};