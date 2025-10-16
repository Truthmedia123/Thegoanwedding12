import React, { useState, useEffect, useRef } from 'react';
import config from '@/config/config';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Edit, Trash2, Plus, FileText, BarChart2, Eye, Calendar, Upload } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import MobileAnalyticsDashboard from '@/components/MobileAnalyticsDashboard';

// MDX editor component (simplified for now)
const MDXEditor = ({ markdown, onChange }: { markdown: string; onChange: (content: string) => void }) => (
  <textarea
    value={markdown}
    onChange={(e) => onChange(e.target.value)}
    className="w-full h-64 p-2 border rounded"
    placeholder="Enter markdown content here..."
  />
);

// Type definitions
interface Vendor {
  id: string;
  name: string;
  category: string;
  location: string;
  priceRange: [number, number];
  rating: number;
  contactEmail: string;
  isVerified: boolean;
  // Social media fields
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  // Embed code field
  embedCode?: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: string;
  published: boolean;
}


const ADMIN_TOKENS: Record<string, string> = {
  'admin-2025-goa': 'full-access',
  'vendor-manager': 'vendor-only',
  'content-editor': 'blog-only'
};

// Implement role-based access
const checkPermissions = (token: string, action: string): boolean => {
  console.log('Checking permissions for token:', token, 'action:', action);
  const permissions = ADMIN_TOKENS[token];
  console.log('Permissions found:', permissions);
  
  if (!permissions) return false;
  
  const hasPermission = (
    permissions === 'full-access' ||
    (permissions === 'vendor-only' && action === 'vendors') ||
    (permissions === 'blog-only' && action === 'blog') ||
    (permissions === 'full-access' && (action === 'templates' || action === 'analytics'))
  );
  
  console.log('Has permission:', hasPermission);
  return hasPermission;
};

// Add error boundary to prevent blank pages
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: React.PropsWithChildren<{children: React.ReactNode}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AdminDashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Something went wrong</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">There was an error loading the admin dashboard.</p>
              <Button 
                className="mt-4" 
                onClick={() => {
                  sessionStorage.removeItem('adminToken');
                  window.location.reload();
                }}
              >
                Reload Page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function AdminDashboard() {
  // Use the config for Directus URL
  const directusUrl = config.directus.url;
  
  const [adminToken, setAdminToken] = useState('');
  const [userRole, setUserRole] = useState<'full-access' | 'vendor-only' | 'blog-only' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('vendors');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to?: Date | undefined }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  
  // Bulk import state
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
  const [isBulkImportPreviewOpen, setIsBulkImportPreviewOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Debug logging
  console.log('AdminDashboard rendering with:', { adminToken, isAuthenticated, userRole });
  
  // Simplified authentication - auto-login for testing
  useEffect(() => {
    console.log('Authentication useEffect triggered');
    
    // Auto-login with full access for testing
    const token = 'admin-2025-goa';
    sessionStorage.setItem('adminToken', token);
    setAdminToken(token);
    setIsAuthenticated(true);
    setUserRole('full-access');
    console.log('Auto-authentication successful with full access');
  }, []);

  // Headers for API requests
  const headers = {
    'Content-Type': 'application/json',
    'x-admin-token': adminToken,
  };

  // Query client for invalidating queries
  const queryClient = useQueryClient();

  // Enhanced data fetching with better error handling - using localStorage
  const { data: vendors, isLoading: vendorsLoading, error: vendorsError } = useQuery<Vendor[]>({
    queryKey: ['vendors'],
    queryFn: async () => {
      try {
        // Get vendors from localStorage
        const storedVendors = JSON.parse(localStorage.getItem('vendors') || '[]');
        console.log('Loaded vendors from localStorage:', storedVendors);
        return storedVendors.length > 0 ? storedVendors : mockVendors;
      } catch (error) {
        console.error('Error loading vendors from localStorage:', error);
        // Return mock data as fallback
        return mockVendors;
      }
    },
    enabled: isAuthenticated,
    retry: false,
    staleTime: 0,
  });

  const { data: posts, isLoading: postsLoading, error: postsError } = useQuery<BlogPost[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/blog', { headers });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Return mock data as fallback
        return mockPosts;
      }
    },
    enabled: isAuthenticated,
    retry: false,
    staleTime: 0,
  });


  // Mutations - using localStorage
  const createVendorMutation = useMutation({
    mutationFn: async (newVendor: Omit<Vendor, 'id'>) => {
      // Get existing vendors from localStorage
      const existingVendors = JSON.parse(localStorage.getItem('vendors') || '[]');
      
      // Create new vendor with ID
      const vendorWithId = {
        ...newVendor,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      
      // Add to existing vendors
      const allVendors = [...existingVendors, vendorWithId];
      localStorage.setItem('vendors', JSON.stringify(allVendors));
      
      return vendorWithId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vendors'] });
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({
        title: 'Success',
        description: 'Vendor created successfully',
      });
    },
    onError: (error: unknown) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create vendor',
      });
    },
  });

  const updateVendorMutation = useMutation({
    mutationFn: async (updatedVendor: Vendor) => {
      // Get existing vendors from localStorage
      const existingVendors = JSON.parse(localStorage.getItem('vendors') || '[]');
      
      // Update the vendor
      const updatedVendors = existingVendors.map((v: any) => 
        v.id === updatedVendor.id ? updatedVendor : v
      );
      
      localStorage.setItem('vendors', JSON.stringify(updatedVendors));
      return updatedVendor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vendors'] });
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({
        title: 'Success',
        description: 'Vendor updated successfully',
      });
    },
    onError: (error: unknown) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update vendor',
      });
    },
  });

  const deleteVendorMutation = useMutation({
    mutationFn: async (id: string) => {
      // Get existing vendors from localStorage
      const existingVendors = JSON.parse(localStorage.getItem('vendors') || '[]');
      
      // Remove the vendor
      const filteredVendors = existingVendors.filter((v: any) => v.id !== id);
      
      localStorage.setItem('vendors', JSON.stringify(filteredVendors));
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/vendors'] });
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast({
        title: 'Success',
        description: 'Vendor deleted successfully',
      });
    },
    onError: (error: unknown) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete vendor',
      });
    },
  });

  // Blog mutations
  const createPostMutation = useMutation({
    mutationFn: (newPost: Omit<BlogPost, 'id'>) => 
      fetch('/api/blog', {
        method: 'POST',
        headers,
        body: JSON.stringify(newPost),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: 'Success',
        description: 'Blog post created successfully',
      });
    },
    onError: (error: unknown) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create blog post',
      });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: (updatedPost: BlogPost) => 
      fetch(`/api/blog/${updatedPost.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedPost),
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: 'Success',
        description: 'Blog post updated successfully',
      });
    },
    onError: (error: unknown) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update blog post',
      });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (id: string) => 
      fetch(`/api/blog/${id}`, {
        method: 'DELETE',
        headers,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully',
      });
    },
    onError: (error: unknown) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete blog post',
      });
    },
  });


  // Export analytics
  const exportAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/export?start=${dateRange.from?.toISOString()}&end=${dateRange.to?.toISOString()}`, {
        headers,
      });
      
      if (!response.ok) throw new Error('Failed to export analytics');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: 'Success',
        description: 'Analytics exported successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to export analytics',
      });
    }
  };

  // Enhanced error handling
  useEffect(() => {
    if (vendorsError) {
      console.error('Vendors error:', vendorsError);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: vendorsError instanceof Error ? vendorsError.message : 'Failed to fetch vendors',
      });
    }
    
    if (postsError) {
      console.error('Posts error:', postsError);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: postsError instanceof Error ? postsError.message : 'Failed to fetch posts',
      });
    }
  }, [vendorsError, postsError]);

  // Mock data for initial state if API is unavailable
  const mockVendors: Vendor[] = [
    {
      id: '1',
      name: 'Goa Wedding Photography',
      category: 'Photography',
      location: 'North Goa',
      priceRange: [30000, 50000],
      rating: 4.8,
      contactEmail: 'info@goaweddingphoto.com',
      isVerified: true,
    },
    {
      id: '2',
      name: 'Beachside Venues',
      category: 'Venues',
      location: 'South Goa',
      priceRange: [100000, 200000],
      rating: 4.6,
      contactEmail: 'bookings@beachsidevenues.com',
      isVerified: true,
    },
    {
      id: '3',
      name: 'Goan Flavors Catering',
      category: 'Catering',
      location: 'Panjim',
      priceRange: [800, 1500],
      rating: 4.9,
      contactEmail: 'catering@goanflavors.com',
      isVerified: false,
    },
    {
      id: '4',
      name: 'Royal Makeup Artists',
      category: 'Makeup',
      location: 'Calangute',
      priceRange: [15000, 25000],
      rating: 4.7,
      contactEmail: 'royal@makeupartists.com',
      isVerified: true,
    },
    {
      id: '5',
      name: 'Floral Dreams Decor',
      category: 'Decoration',
      location: 'Margao',
      priceRange: [20000, 40000],
      rating: 4.5,
      contactEmail: 'floral@dreamsdecor.com',
      isVerified: false,
    },
  ];

  const mockPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Top 10 Wedding Venues in Goa',
      slug: 'top-10-wedding-venues-goa',
      date: '2024-01-15',
      category: 'Venues',
      published: true,
    },
    {
      id: '2',
      title: 'Traditional Goan Wedding Customs',
      slug: 'traditional-goa-wedding-customs',
      date: '2024-01-20',
      category: 'Traditions',
      published: true,
    },
    {
      id: '3',
      title: 'Planning Your Destination Wedding',
      slug: 'planning-destination-wedding',
      date: '2024-01-25',
      category: 'Planning',
      published: false,
    },
  ];


  // Vendor management state
  const [vendorForm, setVendorForm] = useState<Omit<Vendor, 'id'> & { id?: string }>({
    name: '',
    category: '',
    location: '',
    priceRange: [0, 0],
    rating: 0,
    contactEmail: '',
    isVerified: false,
    // Social media fields
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    // Embed code field
    embedCode: '',
  });
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);

  // Blog management state
  const [postForm, setPostForm] = useState<Omit<BlogPost, 'id'> & { id?: string }>({
    title: '',
    slug: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    published: false,
  });
  const [postContent, setPostContent] = useState('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Handle vendor form changes
  const handleVendorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setVendorForm(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'minPrice' || name === 'maxPrice') {
      const priceIndex = name === 'minPrice' ? 0 : 1;
      const newPriceRange = [...vendorForm.priceRange] as [number, number];
      newPriceRange[priceIndex] = Number(value);
      setVendorForm(prev => ({ ...prev, priceRange: newPriceRange }));
    } else {
      setVendorForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle post form changes
  const handlePostChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setPostForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setPostForm(prev => ({ ...prev, [name]: value }));
    }
  };


  // Handle vendor form submit
  const handleVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vendorForm.id) {
      updateVendorMutation.mutate({ ...vendorForm, id: vendorForm.id } as Vendor);
    } else {
      createVendorMutation.mutate(vendorForm);
    }
    setIsVendorModalOpen(false);
    setVendorForm({
      name: '',
      category: '',
      location: '',
      priceRange: [0, 0],
      rating: 0,
      contactEmail: '',
      isVerified: false,
      facebookUrl: '',
      instagramUrl: '',
      linkedinUrl: '',
      twitterUrl: '',
      embedCode: '',
    });
  };

  // Handle post form submit
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postForm.id) {
      updatePostMutation.mutate({ ...postForm, id: postForm.id } as BlogPost);
    } else {
      createPostMutation.mutate(postForm);
    }
    setIsPostModalOpen(false);
    setPostForm({
      title: '',
      slug: '',
      date: new Date().toISOString().split('T')[0],
      category: '',
      published: false,
    });
    setPostContent('');
  };


  // Open vendor modal for editing
  const openVendorEdit = (vendor: Vendor) => {
    setVendorForm(vendor);
    setIsVendorModalOpen(true);
  };

  // Open post modal for editing
  const openPostEdit = (post: BlogPost) => {
    setPostForm(post);
    setIsPostModalOpen(true);
  };


  // Confirm vendor deletion
  const confirmVendorDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete vendor "${name}"?`)) {
      deleteVendorMutation.mutate(id);
    }
  };

  // Confirm post deletion
  const confirmPostDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete post "${title}"?`)) {
      deletePostMutation.mutate(id);
    }
  };


  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCsvFile(file);
      parseCSV(file);
    }
  };

  // Parse CSV file
  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split('\n');
      const headers = lines[0].split(',').map(header => header.trim().replace(/['"]+/g, ''));
      
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(value => value.trim().replace(/['"]+/g, ''));
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        return obj;
      }).filter(row => Object.values(row).some(val => val !== '')); // Filter out empty rows
      
      setParsedData(data);
    };
    reader.readAsText(file);
  };

  // Handle bulk vendor import
  const handleBulkImport = async () => {
    if (parsedData.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No data to import',
      });
      return;
    }

    const bulkImportMutation = useMutation({
      mutationFn: async (vendors: any[]) => {
        // Get existing vendors from localStorage
        const existingVendors = JSON.parse(localStorage.getItem('vendors') || '[]');
        
        // Add new vendors with IDs
        const newVendors = vendors.map(vendor => ({
          ...vendor,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
        }));
        
        // Combine and save
        const allVendors = [...existingVendors, ...newVendors];
        localStorage.setItem('vendors', JSON.stringify(allVendors));
        
        return { vendors: newVendors, imported: newVendors.length };
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/vendors'] });
        toast({
          title: "Success",
          description: "Vendors imported successfully",
        });
        setParsedData([]);
        setIsBulkImportModalOpen(false);
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.message || "Failed to import vendors",
          variant: "destructive",
        });
      },
    });

    try {
      const response = await bulkImportMutation.mutate(parsedData);
      toast({
        title: 'Success',
        description: `Imported ${response.imported} vendors successfully`,
      });

      // Refresh vendors list
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      
      // Reset state
      setIsBulkImportModalOpen(false);
      setIsBulkImportPreviewOpen(false);
      setCsvFile(null);
      setParsedData([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to import vendors',
      });
    }
  };


  // Enhanced rendering with error boundary
  console.log('Rendering dashboard, authenticated:', isAuthenticated, 'token:', adminToken);
  
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage vendors and blog posts</p>
            <div className="mt-2 text-sm text-gray-500">
              Token: {adminToken} | Role: {userRole} | Authenticated: {isAuthenticated ? 'Yes' : 'No'}
            </div>
          </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                {checkPermissions(adminToken, 'vendors') && (
                  <TabsTrigger value="vendors">Vendors</TabsTrigger>
                )}
                {checkPermissions(adminToken, 'blog') && (
                  <TabsTrigger value="blog">Blog</TabsTrigger>
                )}
                {ADMIN_TOKENS[adminToken] === 'full-access' && (
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                )}
              </TabsList>

              {/* Vendor Management Tab */}
              <TabsContent value="vendors" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex flex-row items-center justify-between">
                      <CardTitle>Vendor Management</CardTitle>
                      {checkPermissions(adminToken, 'vendors') && (
                        <div className="flex gap-2">
                          <Dialog open={isBulkImportModalOpen} onOpenChange={setIsBulkImportModalOpen}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline"
                                onClick={() => {
                                  console.log('Bulk Import button clicked');
                                  setIsBulkImportModalOpen(true);
                                }}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Bulk Import
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Bulk Import Vendors</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm text-gray-600 mb-2">
                                    Download the <a 
                                      href="/vendor-import-template.csv" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline"
                                    >
                                      CSV template
                                    </a> to see the required format.
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Upload CSV File</label>
                                  <Input
                                    type="file"
                                    accept=".csv"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                  />
                                </div>
                              
                              {parsedData.length > 0 && (
                                <div>
                                  <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm font-medium">Preview ({parsedData.length} records)</h3>
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => setIsBulkImportPreviewOpen(true)}
                                    >
                                      View All
                                    </Button>
                                  </div>
                                  <div className="border rounded-md max-h-60 overflow-y-auto">
                                    <Table>
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>Name</TableCell>
                                          <TableCell>Category</TableCell>
                                          <TableCell>Location</TableCell>
                                          <TableCell>Facebook</TableCell>
                                          <TableCell>Instagram</TableCell>
                                          <TableCell>Embed Code</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {parsedData.slice(0, 5).map((row, index) => (
                                          <TableRow key={index}>
                                            <TableCell className="text-xs">{row.name}</TableCell>
                                            <TableCell className="text-xs">{row.category}</TableCell>
                                            <TableCell className="text-xs">{row.location}</TableCell>
                                            <TableCell className="text-xs">{row.facebookUrl || ''}</TableCell>
                                            <TableCell className="text-xs">{row.instagramUrl || ''}</TableCell>
                                            <TableCell className="text-xs">{row.embedCode ? 'Yes' : 'No'}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              )}
                            </div>
                            <DialogFooter>
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsBulkImportModalOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                type="button" 
                                onClick={handleBulkImport}
                                disabled={parsedData.length === 0}
                              >
                                Import Vendors
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        {/* Bulk Import Preview Dialog */}
                        <Dialog open={isBulkImportPreviewOpen} onOpenChange={setIsBulkImportPreviewOpen}>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Bulk Import Preview</DialogTitle>
                            </DialogHeader>
                            <div className="border rounded-md max-h-[60vh] overflow-y-auto">
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Price Range</TableCell>
                                    <TableCell>Rating</TableCell>
                                    <TableCell>Contact Email</TableCell>
                                    <TableCell>Verified</TableCell>
                                    <TableCell>Facebook</TableCell>
                                    <TableCell>Instagram</TableCell>
                                    <TableCell>LinkedIn</TableCell>
                                    <TableCell>Twitter</TableCell>
                                    <TableCell>Embed Code</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {parsedData.map((row, index) => (
                                    <TableRow key={index}>
                                      <TableCell className="text-xs">{row.name}</TableCell>
                                      <TableCell className="text-xs">{row.category}</TableCell>
                                      <TableCell className="text-xs">{row.location}</TableCell>
                                      <TableCell className="text-xs">{row.priceRange}</TableCell>
                                      <TableCell className="text-xs">{row.rating}</TableCell>
                                      <TableCell className="text-xs">{row.contactEmail}</TableCell>
                                      <TableCell className="text-xs">{row.isVerified ? 'Yes' : 'No'}</TableCell>
                                      <TableCell className="text-xs">{row.facebookUrl || ''}</TableCell>
                                      <TableCell className="text-xs">{row.instagramUrl || ''}</TableCell>
                                      <TableCell className="text-xs">{row.linkedinUrl || ''}</TableCell>
                                      <TableCell className="text-xs">{row.twitterUrl || ''}</TableCell>
                                      <TableCell className="text-xs">{row.embedCode ? 'Yes' : 'No'}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                            <DialogFooter>
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setIsBulkImportPreviewOpen(false)}
                              >
                                Close
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <Dialog open={isVendorModalOpen} onOpenChange={setIsVendorModalOpen}>
                          <DialogTrigger asChild>
                            <Button onClick={() => setVendorForm({
                              name: '',
                              category: '',
                              location: '',
                              priceRange: [0, 0],
                              rating: 0,
                              contactEmail: '',
                              isVerified: false,
                              facebookUrl: '',
                              instagramUrl: '',
                              linkedinUrl: '',
                              twitterUrl: '',
                              embedCode: '',
                            })}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Vendor
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{vendorForm.id ? 'Edit Vendor' : 'Add Vendor'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleVendorSubmit} className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Name</label>
                                  <Input
                                    name="name"
                                    value={vendorForm.name}
                                    onChange={handleVendorChange}
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Category</label>
                                  <Input
                                    name="category"
                                    value={vendorForm.category}
                                    onChange={handleVendorChange}
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Location</label>
                                  <Input
                                    name="location"
                                    value={vendorForm.location}
                                    onChange={handleVendorChange}
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Contact Email</label>
                                  <Input
                                    name="contactEmail"
                                    type="email"
                                    value={vendorForm.contactEmail}
                                    onChange={handleVendorChange}
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Min Price</label>
                                  <Input
                                    name="minPrice"
                                    type="number"
                                    value={vendorForm.priceRange[0]}
                                    onChange={handleVendorChange}
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Max Price</label>
                                  <Input
                                    name="maxPrice"
                                    type="number"
                                    value={vendorForm.priceRange[1]}
                                    onChange={handleVendorChange}
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Rating</label>
                                  <Input
                                    name="rating"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    value={vendorForm.rating}
                                    onChange={handleVendorChange}
                                    required
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="isVerified"
                                    name="isVerified"
                                    checked={vendorForm.isVerified}
                                    onChange={handleVendorChange}
                                    className="h-4 w-4"
                                  />
                                  <label htmlFor="isVerified" className="text-sm font-medium">Verified</label>
                                </div>
                              </div>
                              
                              {/* Social Media Fields */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                  <label htmlFor="facebookUrl" className="text-sm font-medium">Facebook URL</label>
                                  <Input
                                    id="facebookUrl"
                                    name="facebookUrl"
                                    value={vendorForm.facebookUrl || ''}
                                    onChange={handleVendorChange}
                                    placeholder="https://facebook.com/vendor"
                                  />
                                </div>
                                <div>
                                  <label htmlFor="instagramUrl" className="text-sm font-medium">Instagram URL</label>
                                  <Input
                                    id="instagramUrl"
                                    name="instagramUrl"
                                    value={vendorForm.instagramUrl || ''}
                                    onChange={handleVendorChange}
                                    placeholder="https://instagram.com/vendor"
                                  />
                                </div>
                                <div>
                                  <label htmlFor="linkedinUrl" className="text-sm font-medium">LinkedIn URL</label>
                                  <Input
                                    id="linkedinUrl"
                                    name="linkedinUrl"
                                    value={vendorForm.linkedinUrl || ''}
                                    onChange={handleVendorChange}
                                    placeholder="https://linkedin.com/in/vendor"
                                  />
                                </div>
                                <div>
                                  <label htmlFor="twitterUrl" className="text-sm font-medium">Twitter URL</label>
                                  <Input
                                    id="twitterUrl"
                                    name="twitterUrl"
                                    value={vendorForm.twitterUrl || ''}
                                    onChange={handleVendorChange}
                                    placeholder="https://twitter.com/vendor"
                                  />
                                </div>
                              </div>

                              {/* Embed Code Field */}
                              <div className="mt-4">
                                <label htmlFor="embedCode" className="text-sm font-medium">Embed Code</label>
                                <textarea
                                  id="embedCode"
                                  name="embedCode"
                                  value={vendorForm.embedCode || ''}
                                  onChange={handleVendorChange}
                                  placeholder="<blockquote class='instagram-media' data-instgrm-permalink='https://www.instagram.com/p/POST_ID/' data-instgrm-version='14'></blockquote>"
                                  rows={4}
                                  className="w-full font-mono text-sm border rounded-md p-2"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                  Paste any valid embed snippet (Instagram, Facebook, YouTube).
                                </p>
                              </div>

                              <div>
                                <label className="text-sm font-medium">Image</label>
                                <Input type="file" accept="image/*" />
                              </div>
                              <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsVendorModalOpen(false)}>
                                  Cancel
                                </Button>
                                <Button type="submit">
                                  {vendorForm.id ? 'Update Vendor' : 'Add Vendor'}
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {vendorsLoading ? (
                      <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                      </div>
                    ) : (
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Location</TableCell>
                            <TableCell>Price Range</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Verified</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(vendors || mockVendors).map((vendor: Vendor) => (
                            <TableRow key={vendor.id}>
                              <TableCell className="font-medium">{vendor.name}</TableCell>
                              <TableCell>{vendor.category}</TableCell>
                              <TableCell>{vendor.location}</TableCell>
                              <TableCell>₹{vendor.priceRange[0]} - ₹{vendor.priceRange[1]}</TableCell>
                              <TableCell>{vendor.rating}</TableCell>
                              <TableCell>
                                {vendor.isVerified ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Verified
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Pending
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  {checkPermissions(adminToken, 'vendors') ? (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openVendorEdit(vendor)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => confirmVendorDelete(vendor.id, vendor.name)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </>
                                  ) : (
                                    <span className="text-muted-foreground">No access</span>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Blog Management Tab */}
              <TabsContent value="blog" className="space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Blog Management</CardTitle>
                    {checkPermissions(adminToken, 'blog') && (
                      <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
                        <DialogTrigger asChild>
                          <Button onClick={() => setPostForm({
                            title: '',
                            slug: '',
                            date: new Date().toISOString().split('T')[0],
                            category: '',
                            published: false,
                          })}>
                            <Plus className="h-4 w-4 mr-2" />
                            New Post
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{postForm.id ? 'Edit Post' : 'New Post'}</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handlePostSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                  name="title"
                                  value={postForm.title}
                                  onChange={handlePostChange}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Slug</label>
                                <Input
                                  name="slug"
                                  value={postForm.slug}
                                  onChange={handlePostChange}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Date</label>
                                <Input
                                  name="date"
                                  type="date"
                                  value={postForm.date}
                                  onChange={handlePostChange}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium">Category</label>
                                <Input
                                  name="category"
                                  value={postForm.category}
                                  onChange={handlePostChange}
                                  required
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id="published"
                                  name="published"
                                  checked={postForm.published}
                                  onChange={handlePostChange}
                                  className="h-4 w-4"
                                />
                                <label htmlFor="published" className="text-sm font-medium">Published</label>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Content</label>
                              {typeof window !== 'undefined' && (
                                <MDXEditor
                                  markdown={postContent}
                                  onChange={setPostContent}
                                />
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button type="button" variant="outline" onClick={() => setIsPreviewOpen(true)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                            </div>
                            <DialogFooter>
                              <Button type="button" variant="outline" onClick={() => setIsPostModalOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit">
                                {postForm.id ? 'Update Post' : 'Create Post'}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardHeader>
                  <CardContent>
                    {postsLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                      </div>
                    ) : (
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(posts || mockPosts).map((post: BlogPost) => (
                            <TableRow key={post.id}>
                              <TableCell className="font-medium">{post.title}</TableCell>
                              <TableCell>{post.category}</TableCell>
                              <TableCell>{post.date}</TableCell>
                              <TableCell>
                                {post.published ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Published
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Draft
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  {checkPermissions(adminToken, 'blog') ? (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openPostEdit(post)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => confirmPostDelete(post.id, post.title)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </>
                                  ) : (
                                    <span className="text-muted-foreground">No access</span>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>


              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 mb-6">
                      <div className="flex items-center space-x-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !dateRange.from && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateRange.from ? (
                                dateRange.to ? (
                                  <>
                                    {format(dateRange.from, "LLL dd, y")} -{" "}
                                    {format(dateRange.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(dateRange.from, "LLL dd, y")
                                )
                              ) : (
                                <span>Pick a date range</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              initialFocus
                              mode="range"
                              defaultMonth={dateRange.from}
                              selected={{ from: dateRange.from, to: dateRange.to } as any}
                              onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                              numberOfMonths={2}
                            />
                          </PopoverContent>
                        </Popover>
                        <Button onClick={exportAnalytics} variant="outline">
                          <FileText className="h-4 w-4 mr-2" />
                          Export CSV
                        </Button>
                      </div>
                    </div>
                    <MobileAnalyticsDashboard />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
        </div>
      </div>
    </ErrorBoundary>
  );
}