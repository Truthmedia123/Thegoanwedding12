import { useEffect, useState } from "react";

export default function HomeDebug() {
  const [status, setStatus] = useState("Initializing...");
  const [apiStatus, setApiStatus] = useState("Unknown");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStatus("Component mounted, checking API...");
    
    // Test API connection
    fetch("/api/health")
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      })
      .then(data => {
        setApiStatus(data.status === "ok" ? "✅ Working" : "⚠️ Unexpected response");
        setStatus("API test completed");
      })
      .catch(err => {
        setApiStatus("❌ Failed");
        setError(`API Error: ${err.message}`);
        setStatus("API test completed with error");
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Debug Information</h1>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="font-semibold text-blue-800">Status</h2>
            <p className="text-blue-600">{status}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="font-semibold text-green-800">API Status</h2>
            <p className="text-green-600">{apiStatus}</p>
          </div>
          
          {error && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h2 className="font-semibold text-red-800">Error Details</h2>
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h2 className="font-semibold text-yellow-800">Next Steps</h2>
            <ul className="list-disc pl-5 text-yellow-700 space-y-1">
              <li>Check browser console for JavaScript errors (F12)</li>
              <li>Verify all required assets are loading</li>
              <li>Ensure the development server is still running</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full transition-colors"
          >
            Try Main Page Again
          </a>
        </div>
      </div>
    </div>
  );
}