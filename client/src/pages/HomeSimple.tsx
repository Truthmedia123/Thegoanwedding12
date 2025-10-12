export default function HomeSimple() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">TheGoanWedding.com</h1>
        <p className="text-gray-600 mb-6">Premium Wedding Vendor Directory</p>
        
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p>✅ React is working correctly!</p>
        </div>
        
        <div className="space-y-4 text-left">
          <h2 className="text-xl font-semibold text-gray-800">Next Steps:</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-600">
            <li>Check your browser's developer console for any JavaScript errors (F12)</li>
            <li>Verify that all CSS files are loading properly</li>
            <li>Ensure all required assets are accessible</li>
            <li>Check if API endpoints are responding correctly</li>
          </ol>
        </div>
        
        <div className="mt-8">
          <a 
            href="/debug" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full transition-colors mr-4"
          >
            Debug Info
          </a>
          <a 
            href="/" 
            className="inline-block bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-full transition-colors"
          >
            Try Main Page Again
          </a>
        </div>
      </div>
    </div>
  );
}