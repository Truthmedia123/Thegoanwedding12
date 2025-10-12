import React, { useState, useEffect, useRef } from 'react';
import { vendorService } from '../lib/supabase-service';
import type { Vendor } from '@shared/schema';

const VendorAvailabilityTracker: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const websocketRef = useRef<WebSocket | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load vendors and set up WebSocket connection
  useEffect(() => {
    const loadVendors = async () => {
      try {
        const vendorData = await getVendors(20, 0);
        setVendors(vendorData);
        setLastUpdated(new Date());
        setLoading(false);
      } catch (error: any) {
        console.error('Error loading vendors:', error);
        setError('Failed to load vendor data');
        setLoading(false);
      }
    };

    // Load initial data
    loadVendors();

    // Set up WebSocket connection
    connectWebSocket();

    // Setup polling as fallback
    setupPollingFallback();

    // Cleanup function
    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Connect to WebSocket
  const connectWebSocket = () => {
    try {
      // Use a mock WebSocket URL for now - replace with actual WebSocket endpoint
      const wsUrl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8080/vendor-updates';
      websocketRef.current = new WebSocket(wsUrl);

      websocketRef.current.onopen = () => {
        console.log('WebSocket connection established');
        setIsConnected(true);
        setError(null);
      };

      websocketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'vendor_update') {
            // Update the specific vendor in the list
            setVendors(prevVendors => {
              return prevVendors.map(vendor => 
                vendor.id === data.vendor.id ? { ...vendor, ...data.vendor } : vendor
              );
            });
            setLastUpdated(new Date());
          } else if (data.type === 'vendor_list_update') {
            // Replace the entire vendor list
            setVendors(data.vendors);
            setLastUpdated(new Date());
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      websocketRef.current.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
        // Attempt to reconnect after 5 seconds
        retryTimeoutRef.current = setTimeout(connectWebSocket, 5000);
      };

      websocketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Error establishing WebSocket connection:', error);
      setError('Failed to establish WebSocket connection');
    }
  };

  // Fallback to polling if WebSocket fails
  const setupPollingFallback = () => {
    console.log('Setting up polling fallback...');
    pollingIntervalRef.current = setInterval(() => {
      loadVendorsSilently();
    }, 30000); // Poll every 30 seconds
  };

  // Load vendors without setting loading state
  const loadVendorsSilently = async () => {
    try {
      const vendorData = await getVendors(20, 0);
      setVendors(vendorData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading vendors:', error);
    }
  };

  // Format availability data for display
  const formatAvailability = (vendor: Vendor) => {
    if (!vendor.availability_calendar) return 'Availability not set';
    
    try {
      const availability = typeof vendor.availability_calendar === 'string' 
        ? JSON.parse(vendor.availability_calendar) 
        : vendor.availability_calendar;
      
      if (!availability || !Array.isArray(availability.dates)) {
        return 'Availability not set';
      }
      
      const today = new Date();
      const availableDates = availability.dates.filter((date: string) => 
        new Date(date) >= today
      );
      
      if (availableDates.length === 0) {
        return 'No upcoming availability';
      }
      
      const nextDate = new Date(availableDates[0]);
      return `Next available: ${nextDate.toLocaleDateString()}`;
    } catch (error) {
      return 'Availability data unavailable';
    }
  };

  // Get status badge class
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading vendor availability...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Vendor Availability Tracker</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
            <div className={`flex items-center text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`w-2 h-2 rounded-full mr-1 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{isConnected ? 'Live' : 'Disconnected'}</span>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {vendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors
              .filter(vendor => vendor.status === 'active')
              .map((vendor) => (
              <div 
                key={vendor.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{vendor.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(vendor.status || 'offline')}`}>
                    {vendor.status || 'offline'}
                  </span>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm text-gray-600">
                    {formatAvailability(vendor)}
                  </p>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>
                      Last updated: {vendor.updated_at 
                        ? new Date(vendor.updated_at).toLocaleTimeString() 
                        : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No vendors available at the moment.</p>
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-500">
          <p>This tracker shows real-time availability updates for wedding vendors.</p>
          <p className="mt-1">Status indicators: 
            <span className="ml-2 inline-flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span> Available
            </span>
            <span className="ml-2 inline-flex items-center">
              <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span> Busy
            </span>
            <span className="ml-2 inline-flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span> Offline
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorAvailabilityTracker;