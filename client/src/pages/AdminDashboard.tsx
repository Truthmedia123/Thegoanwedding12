import React from 'react';
import config from '@/config/config';
import SystemStatus from '@/components/admin/SystemStatus';

const AdminDashboard: React.FC = () => {
  // Use the config for Directus URL
  const directusUrl = config.directus.url;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your wedding vendor directory with Directus CMS</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SystemStatus />
          
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Data Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <i className="fas fa-store mr-2 text-green-500"></i>
                  Vendors
                </h3>
                <p className="text-gray-600 text-sm mb-3">Manage wedding vendor listings</p>
                <a 
                  href={`${directusUrl}/admin/content/vendors`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  Manage Vendors →
                </a>
              </div>
              
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <i className="fas fa-envelope mr-2 text-pink-500"></i>
                  Invitations
                </h3>
                <p className="text-gray-600 text-sm mb-3">Manage wedding invitation templates</p>
                <a 
                  href={`${directusUrl}/admin/content/invitation_templates`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  Manage Templates →
                </a>
              </div>
              
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <i className="fas fa-file-alt mr-2 text-indigo-500"></i>
                  Blog Posts
                </h3>
                <p className="text-gray-600 text-sm mb-3">Manage blog content and articles</p>
                <a 
                  href={`${directusUrl}/admin/content/blog_posts`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  Manage Blog →
                </a>
              </div>
              
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <i className="fas fa-users mr-2 text-yellow-500"></i>
                  Categories
                </h3>
                <p className="text-gray-600 text-sm mb-3">Manage vendor categories</p>
                <a 
                  href={`${directusUrl}/admin/content/categories`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  Manage Categories →
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">System Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700">Platform</h3>
                <p className="text-gray-600">TheGoanWedding.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Version</h3>
                <p className="text-gray-600">v2.0.0</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Deployment</h3>
                <p className="text-gray-600">Cloudflare Pages</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">CMS</h3>
                <p className="text-gray-600">Directus</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Migration Status</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Data Migration</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Database Connection</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Content Sync</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span>Backup Available</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t">
              <button className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">
                <i className="fas fa-download mr-2"></i>
                Download Migration Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
