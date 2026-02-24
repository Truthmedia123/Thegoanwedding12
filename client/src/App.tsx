import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
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
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/AdminDashboard";
import VendorsPage from "@/pages/admin/VendorsPage";
import AnalyticsPage from "@/pages/admin/AnalyticsPage";
import BlogsPage from "@/pages/admin/BlogsPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import WeddingTools from "@/pages/WeddingTools";
import VendorSubscription from "@/pages/VendorSubscription";
import VendorChat from "@/pages/VendorChat";
import GoanWeddingTimeline from "@/pages/GoanWeddingTimeline";
import MobileAnalytics from "@/pages/MobileAnalytics";
import NotFound from "@/pages/not-found";
import FavoritesPage from "@/pages/Favorites";
import GuestRSVP from "@/pages/GuestRSVP";
import RSVPCreator from "@/pages/RSVPCreator";
import PublicWeddingPage from "@/pages/PublicWeddingPage";
import WeddingAdmin from "@/pages/WeddingAdmin";
import SupabaseSearch from "@/components/SupabaseSearch";
import VendorAvailabilityPage from "@/pages/VendorAvailabilityPage";


function Router() {
  const [location] = useLocation();
  
  try {
    return (
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
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
          <Route path="/login" component={Login} />
          <Route path="/admin/dashboard" component={() => (
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          )} />
          <Route path="/admin/vendors" component={() => (
            <ProtectedRoute requireAdmin>
              <VendorsPage />
            </ProtectedRoute>
          )} />
          <Route path="/admin/analytics" component={() => (
            <ProtectedRoute requireAdmin>
              <AnalyticsPage />
            </ProtectedRoute>
          )} />
          <Route path="/admin/blogs" component={() => (
            <ProtectedRoute requireAdmin>
              <BlogsPage />
            </ProtectedRoute>
          )} />
          <Route path="/admin/settings" component={() => (
            <ProtectedRoute requireAdmin>
              <SettingsPage />
            </ProtectedRoute>
          )} />
          <Route path="/favorites" component={FavoritesPage} />
          <Route path="/rsvp" component={GuestRSVP} />
          <Route path="/tools/rsvp-creator" component={RSVPCreator} />
          <Route path="/wedding/:slug/admin" component={WeddingAdmin} />
          <Route path="/wedding/:slug" component={PublicWeddingPage} />
          // Add routes for the new components
          <Route path="/enhanced-search" component={SupabaseSearch} />
          <Route path="/vendor-availability" component={VendorAvailabilityPage} />
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
  try {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
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