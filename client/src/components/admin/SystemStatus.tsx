import React, { useState, useEffect } from 'react';
import config from '@/config/config';

interface SystemStatus {
  database: string;
  cms: string;
  connectionStatus: string;
  lastSyncTime: string | null;
}

const SystemStatus: React.FC = () => {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use the config for Directus URL
  const directusUrl = config.directus.url;

  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        setLoading(true);
        // Check if we're in a static environment (Cloudflare Pages)
        // In static environments, API calls won't work, so we show a different status
        if (typeof window !== 'undefined' && window.location.hostname.includes('localhost') && window.location.port === '8787') {
          // We're in Cloudflare Pages dev server, API won't be available
          setStatus({
            database: 'Static Site (No Database)',
            cms: 'Directus (External)',
            connectionStatus: 'static',
            lastSyncTime: null
          });
        } else {
          // Try to fetch from API
          const response = await fetch('/api/system/status');
          if (!response.ok) {
            throw new Error(`Failed to fetch system status: ${response.status} ${response.statusText}`);
          }
          
          // Check content type to ensure we're getting JSON
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Received non-JSON response from server');
          }
          
          const data = await response.json();
          setStatus(data);
        }
      } catch (err) {
        console.error('Error fetching system status:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        // Set fallback status
        setStatus({
          database: 'Unknown (API Unavailable)',
          cms: 'Directus (External)',
          connectionStatus: 'disconnected',
          lastSyncTime: null
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSystemStatus();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading system status...</span>
        </div>
      </div>
    );
  }

  if (error && status === null) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">System Status</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-database mr-2 text-blue-500"></i>
            Database Status
          </h3>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${status?.connectionStatus === 'connected' ? 'bg-green-500' : status?.connectionStatus === 'static' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
            <span>{status?.database}</span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Connection: {status?.connectionStatus === 'static' ? 'Static Site' : status?.connectionStatus}
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-crown mr-2 text-purple-500"></i>
            CMS Status
          </h3>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
            <span>{status?.cms}</span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Status: {status?.connectionStatus === 'static' ? 'Access via Directus URL' : 'Active'}
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <i className="fas fa-cloud mr-2 text-cyan-500"></i>
            Deployment Status
          </h3>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
            <span>Cloudflare Pages</span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Environment: {status?.connectionStatus === 'static' ? 'Static Preview' : 'Production'}
          </div>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t">
        <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <a 
            href={`${directusUrl}/admin`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <i className="fas fa-external-link-alt mr-2"></i>
            Open Directus Admin
          </a>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            <i className="fas fa-sync-alt mr-2"></i>
            Refresh Status
          </button>
        </div>
      </div>
      
      {status?.connectionStatus === 'static' && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">
            <i className="fas fa-info-circle mr-2"></i>
            You are viewing a static preview. API functionality is not available in this mode. 
            For full functionality, run the development server with <code className="bg-gray-100 px-1 rounded">npm run dev</code>.
          </p>
        </div>
      )}
    </div>
  );
};

export default SystemStatus;