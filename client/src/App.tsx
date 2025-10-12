import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import VendorCategory from "@/pages/VendorCategory";
import VendorProfile from "@/pages/VendorProfile";
import ListBusiness from "@/pages/ListBusiness";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Couples from "@/pages/Couples";
import Search from "@/pages/Search";
import AdminDashboard from "@/pages/AdminDashboard";
import WeddingTools from "@/pages/WeddingTools";
import VendorSubscription from "@/pages/VendorSubscription";
import VendorChat from "@/pages/VendorChat";
import GoanWeddingTimeline from "@/pages/GoanWeddingTimeline";
import MobileAnalytics from "@/pages/MobileAnalytics";
import NotFound from "@/pages/not-found";
import FavoritesPage from "@/pages/Favorites";
import HomeDebug from "@/pages/HomeDebug";

// Import the new page components
import InvitationsPage from "@/pages/Invitations";
import SupabaseSearch from "@/components/SupabaseSearch";
import VendorAvailabilityPage from "@/pages/VendorAvailabilityPage";
import TestImportsPage from "@/pages/TestImportsPage";
import TestAllFeatures from "@/pages/TestAllFeatures";

console.log("App module loaded");

function Router() {
  console.log("Router component rendering");
  const [location] = useLocation();
  console.log("Current location:", location);
  
  try {
    return (
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/debug" component={HomeDebug} />
          <Route path="/vendors/:category" component={VendorCategory} />
          <Route path="/vendor/:id" component={VendorProfile} />
          <Route path="/list-business" component={ListBusiness} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/couples/:slug" component={Couples} />
          <Route path="/search" component={Search} />
          <Route path="/tools" component={WeddingTools} />
          <Route path="/vendor/subscription" component={VendorSubscription} />
          <Route path="/vendor/chat" component={VendorChat} />
          <Route path="/timeline" component={GoanWeddingTimeline} />
          <Route path="/mobile-analytics" component={MobileAnalytics} />
          <Route path="/admin" component={() => <div className="p-8"><h1 className="text-2xl">Admin Dashboard</h1><p>Token: admin-secret-2024</p></div>} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/favorites" component={FavoritesPage} />
          // Add routes for the new components
          <Route path="/invitations" component={InvitationsPage} />
          <Route path="/enhanced-search" component={SupabaseSearch} />
          <Route path="/vendor-availability" component={VendorAvailabilityPage} />
          <Route path="/test-imports" component={TestImportsPage} />
          <Route path="/test-all-features" component={TestAllFeatures} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    );
  } catch (error) {
    console.error("Error in Router component:", error);
    throw error;
  }
}

function App() {
  console.log("App component rendering");
  
  // Add error boundary
  try {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    );
  } catch (error) {
    console.error("Error in App component:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
          <p className="text-gray-700 mb-4">Something went wrong while rendering the application.</p>
          <p className="text-sm text-gray-500">Check the browser console for more details.</p>
          <details className="mt-4 text-left bg-gray-100 p-4 rounded">
            <summary className="cursor-pointer font-medium">Error details</summary>
            <pre className="mt-2 text-xs overflow-auto">{error instanceof Error ? error.message : String(error)}</pre>
          </details>
        </div>
      </div>
    );
  }
}

export default App;