import React from 'react';
import { useVendorComparison } from '@/hooks/useVendorComparison';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';
import { X, Scale } from 'lucide-react';

export default function VendorComparison() {
  const { comparisonList, removeFromComparison, clearComparison } = useVendorComparison();

  const handleRemoveVendor = (vendorId: string) => {
    removeFromComparison(vendorId);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all vendors from comparison?')) {
      clearComparison();
    }
  };

  if (comparisonList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Vendor Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Scale className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No vendors to compare</h3>
                <p className="text-gray-600 mb-6">
                  Add vendors to compare by clicking the "Compare" button on vendor profiles.
                </p>
                <Link to="/search">
                  <Button>Browse Vendors</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Vendor Comparison</h1>
            <Button variant="outline" onClick={handleClearAll}>
              Clear All
            </Button>
          </div>
          <p className="mt-2 text-gray-600">
            Comparing {comparisonList.length} vendor{comparisonList.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-left">Vendor</th>
                {comparisonList.map((vendor) => (
                  <th key={vendor.id} className="p-4 text-center relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveVendor(vendor.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="font-medium">{vendor.name}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-4 font-medium">Category</td>
                {comparisonList.map((vendor) => (
                  <td key={vendor.id} className="p-4 text-center">
                    {vendor.category.replace('-', ' ')}
                  </td>
                ))}
              </tr>
              <tr className="border-t bg-gray-50">
                <td className="p-4 font-medium">Rating</td>
                {comparisonList.map((vendor) => (
                  <td key={vendor.id} className="p-4 text-center">
                    <div className="flex items-center justify-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      {vendor.rating}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="border-t">
                <td className="p-4 font-medium">Location</td>
                {comparisonList.map((vendor) => (
                  <td key={vendor.id} className="p-4 text-center">
                    {vendor.location}
                  </td>
                ))}
              </tr>
              <tr className="border-t bg-gray-50">
                <td className="p-4 font-medium">Price Range</td>
                {comparisonList.map((vendor) => (
                  <td key={vendor.id} className="p-4 text-center">
                    {vendor.priceRange || 'N/A'}
                  </td>
                ))}
              </tr>
              <tr className="border-t">
                <td className="p-4 font-medium">Verified</td>
                {comparisonList.map((vendor) => (
                  <td key={vendor.id} className="p-4 text-center">
                    {vendor.verified ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Not Verified
                      </span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-t bg-gray-50">
                <td className="p-4 font-medium">Services</td>
                {comparisonList.map((vendor) => (
                  <td key={vendor.id} className="p-4 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {vendor.services && vendor.services.length > 0 ? (
                        vendor.services.slice(0, 3).map((service, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {service}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                      {vendor.services && vendor.services.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{vendor.services.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-center">
          <Link to="/search">
            <Button variant="outline" className="mr-4">
              Add More Vendors
            </Button>
          </Link>
          <Button onClick={handleClearAll}>
            Clear Comparison
          </Button>
        </div>
      </div>
    </div>
  );
}