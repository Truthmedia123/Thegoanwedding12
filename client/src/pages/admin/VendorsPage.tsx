import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Upload, 
  Download,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { mockVendors as defaultMockVendors } from '@/data/mockVendors';

interface Vendor {
  id: string;
  name: string;
  description?: string;
  category?: string;
  location?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  price_range?: string;
  availability?: string;
  isVerified?: boolean;
  created_at?: string;
  updated_at?: string;
}

const VendorsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [pendingCsvData, setPendingCsvData] = useState<any[]>([]);
  const [isClearing, setIsClearing] = useState(false);

  const queryClient = useQueryClient();

  const STORAGE_KEY = 'vendors';
  const toVendorId = (value: unknown) => String(value ?? Date.now().toString());

  // Debug: Log mounting and check authentication
  useEffect(() => {
    console.log('VendorsPage mounted');
    console.log('Supabase configured:', isSupabaseConfigured);
    
    // Check authentication status (silent check - only log to console)
    const checkAuth = async () => {
      if (isSupabaseConfigured) {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth check error:', error);
          return;
        }
        
        if (!session) {
          console.warn('⚠️ Not authenticated - vendor operations may fail');
          console.log('   Please log in to manage vendors');
          // Don't show toast on mount - only show errors when operations fail
        } else {
          console.log('✅ Authenticated as:', session.user.email);
          
          // Check if user has admin profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.warn('⚠️ Profile not found:', profileError.message);
            console.log('   Some operations may require a profile record');
          } else if (profile.role !== 'admin') {
            console.warn('⚠️ User role is not admin:', profile.role);
            console.log('   Some operations may be restricted');
          } else {
            console.log('✅ Admin role confirmed');
          }
        }
      }
    };
    
    checkAuth();
  }, []);

  // Fetch vendors with consistent query key
  const { data: vendors, isLoading, isError, error: queryError, refetch } = useQuery({
    queryKey: ['vendors'], // Use same key as public pages
    queryFn: async () => {
      if (isSupabaseConfigured) {
        console.log('Loading vendors from Supabase...');
        const { data, error } = await supabase
          .from('vendors')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Supabase error:', error);
          throw new Error(`Failed to fetch vendors: ${error.message}`);
        }
        
        const normalized = (data || []).map((vendor: any) => ({
          ...vendor,
          id: toVendorId(vendor.id),
          rating: typeof vendor.rating === 'number' ? vendor.rating : Number(vendor.rating) || undefined,
        })) as Vendor[];
        
        console.log('Vendors loaded from Supabase:', normalized.length);
        return normalized;
      } else {
        console.log('Supabase not configured, using localStorage + mock data...');
        const storedVendors = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const combined = [...defaultMockVendors, ...storedVendors];
        const normalized = combined.map((vendor: any) => ({
          ...vendor,
          id: toVendorId(vendor.id),
          rating: typeof vendor.rating === 'number' ? vendor.rating : Number(vendor.rating) || undefined,
          price_range: vendor.price_range || (Array.isArray(vendor.priceRange) ? `${vendor.priceRange[0]} - ${vendor.priceRange[1]}` : vendor.priceRange),
        })) as Vendor[];
        console.log('Vendors loaded (mock + stored):', normalized.length);
        return normalized;
      }
    },
    retry: 1,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });

  const categories = useMemo(() => {
    if (!vendors) return [];
    const unique = new Set<string>();
    vendors.forEach((vendor) => {
      if (vendor.category) {
        unique.add(vendor.category);
      }
    });
    return Array.from(unique).sort();
  }, [vendors]);

  // Add vendor mutation
  const addVendorMutation = useMutation({
    mutationFn: async (vendorData: Partial<Vendor>) => {
      console.log('➕ Adding vendor:', vendorData);
      
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('vendors')
          .insert([vendorData])
          .select()
          .single();
        
        if (error) {
          console.error('❌ Supabase insert error:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          });
          throw new Error(`Failed to add vendor: ${error.message}`);
        }
        
        console.log('✅ Vendor added successfully:', data);
        return data;
      } else {
        const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const newVendor: Vendor = {
          ...vendorData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Vendor;
        localStorage.setItem(STORAGE_KEY, JSON.stringify([newVendor, ...existing]));
        console.log('✅ Vendor added to localStorage:', newVendor);
        return newVendor;
      }
    },
    onSuccess: () => {
      // Invalidate all vendor-related queries
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['/api/vendors'] });
      setIsAddDialogOpen(false);
      refetch(); // Force immediate refetch
      toast({
        title: 'Success',
        description: 'Vendor added successfully',
      });
    },
    onError: (error: any) => {
      console.error('❌ Add mutation error:', {
        message: error.message,
        stack: error.stack,
        isSupabaseConfigured,
      });
      
      toast({
        title: 'Add Failed',
        description: error.message || 'Failed to add vendor. Check console for details.',
        variant: 'destructive',
      });
    }
  });

  // Update vendor mutation
  const updateVendorMutation = useMutation({
    mutationFn: async ({ id, ...vendorData }: Partial<Vendor> & { id: string }) => {
      console.log('✏️ Updating vendor:', { id, vendorData });
      
      if (isSupabaseConfigured) {
        const numericId = parseInt(id, 10);
        
        if (isNaN(numericId)) {
          throw new Error(`Invalid vendor ID: ${id}`);
        }
        
        const { data, error } = await supabase
          .from('vendors')
          .update(vendorData)
          .eq('id', numericId)
          .select()
          .single();
        
        if (error) {
          console.error('❌ Supabase update error:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          });
          throw new Error(`Failed to update vendor: ${error.message}`);
        }
        
        console.log('✅ Vendor updated successfully:', data);
        return data;
      } else {
        const existing: Vendor[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const updated = existing.map((vendor) =>
          vendor.id === id
            ? {
                ...vendor,
                ...vendorData,
                updated_at: new Date().toISOString(),
              }
            : vendor
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        console.log('✅ Vendor updated in localStorage');
        return { id, ...vendorData };
      }
    },
    onSuccess: () => {
      // Invalidate all vendor-related queries
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['/api/vendors'] });
      setEditingVendor(null);
      refetch(); // Force immediate refetch
      toast({
        title: 'Success',
        description: 'Vendor updated successfully',
      });
    },
    onError: (error: any) => {
      console.error('❌ Update mutation error:', {
        message: error.message,
        stack: error.stack,
        isSupabaseConfigured,
      });
      
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update vendor. Check console for details.',
        variant: 'destructive',
      });
    }
  });

  // Delete vendor mutation
  const deleteVendorMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('🗑️ Deleting vendor:', { id, type: typeof id });
      
      if (isSupabaseConfigured) {
        // Convert to number for Supabase (vendors table uses integer IDs)
        const numericId = parseInt(id, 10);
        
        if (isNaN(numericId)) {
          throw new Error(`Invalid vendor ID: ${id}`);
        }
        
        console.log('Attempting delete with numeric ID:', numericId);
        
        const { data: deletedData, error } = await supabase
          .from('vendors')
          .delete()
          .eq('id', numericId)
          .select();
        
        console.log('Delete response:', { deletedData, error });
        
        if (error) {
          console.error('❌ Supabase delete error:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          });
          throw new Error(`Failed to delete vendor: ${error.message}`);
        }
        
        if (!deletedData || deletedData.length === 0) {
          console.warn('⚠️ No vendor was deleted - ID might not exist:', numericId);
          throw new Error('Vendor not found or already deleted');
        }
        
        console.log('✅ Vendor deleted successfully:', deletedData[0]);
        return deletedData;
      } else {
        const existing: Vendor[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const remaining = existing.filter((vendor) => vendor.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
        console.log('✅ Vendor deleted from localStorage');
      }
    },
    onSuccess: (deletedData) => {
      console.log('Delete mutation successful:', deletedData);
      // Invalidate all vendor-related queries
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      queryClient.invalidateQueries({ queryKey: ['/api/vendors'] });
      // Force immediate refetch with a small delay to ensure DB consistency
      setTimeout(() => {
        refetch();
      }, 100);
      toast({
        title: 'Success',
        description: 'Vendor deleted successfully',
      });
    },
    onError: (error: any) => {
      console.error('❌ Delete mutation error:', {
        message: error.message,
        stack: error.stack,
        isSupabaseConfigured,
      });
      
      toast({
        title: 'Delete Failed',
        description: error.message || 'Failed to delete vendor. Check console for details.',
        variant: 'destructive',
      });
    }
  });

  // Filter vendors
  const filteredVendors = vendors?.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vendor.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || vendor.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sync YouTube gallery
  const syncYouTubeGallery = async (vendorId: string, channelId: string) => {
    try {
      console.log(`📺 Syncing YouTube gallery for vendor ${vendorId}, channel: ${channelId}`);
      
      const response = await fetch(`/api/vendors/${vendorId}/sync-youtube`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('adminToken')}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to sync YouTube gallery');
      }

      const result = await response.json();
      
      console.log(`✅ YouTube sync successful:`, result);
      
      toast({
        title: 'YouTube Gallery Synced',
        description: `Added ${result.thumbnailsAdded} video thumbnails from ${result.videosFound} videos`,
      });

      // Refresh vendors list
      refetch();
    } catch (error: any) {
      console.error('❌ YouTube sync error:', error);
      toast({
        title: 'Sync Failed',
        description: error.message || 'Failed to sync YouTube gallery. Check console for details.',
        variant: 'destructive',
      });
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedVendors.length === 0) {
      console.warn('⚠️ Bulk action called with no action or no vendors selected');
      return;
    }

    console.log(`🔄 Starting bulk action: ${bulkAction} for ${selectedVendors.length} vendors`);

    try {
      if (bulkAction === 'delete') {
        let successCount = 0;
        let errorCount = 0;
        const errors: string[] = [];

        for (const id of selectedVendors) {
          try {
            await deleteVendorMutation.mutateAsync(id);
            successCount++;
            console.log(`✅ Deleted vendor ${id} (${successCount}/${selectedVendors.length})`);
          } catch (error: any) {
            errorCount++;
            const errorMsg = `Vendor ${id}: ${error.message}`;
            errors.push(errorMsg);
            console.error(`❌ Failed to delete vendor ${id}:`, error);
          }
        }

        setSelectedVendors([]);

        if (errorCount === 0) {
          toast({
            title: 'Success',
            description: `${successCount} vendors deleted successfully`,
          });
        } else if (successCount > 0) {
          toast({
            title: 'Partial Success',
            description: `${successCount} deleted, ${errorCount} failed. Check console for details.`,
            variant: 'default',
          });
          console.error('❌ Bulk delete errors:', errors);
        } else {
          throw new Error(`All ${errorCount} deletions failed. ${errors[0]}`);
        }
      }
    } catch (error: any) {
      console.error('❌ Bulk action error:', error);
      toast({
        title: 'Bulk Action Failed',
        description: error.message || 'Failed to perform bulk action. Check console for details.',
        variant: 'destructive',
      });
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('CSV file must have at least a header and one data row');
      }
      
      const headers = lines[0].split(',').map(h => h.trim());
      const vendorRows = lines.slice(1);
      
      const vendors = vendorRows.map(line => {
        const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const vendor: any = {};
        
        headers.forEach((header, index) => {
          const value = values[index] || null;
          const cleanHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '_');
          vendor[cleanHeader] = value;
        });
        
        return vendor;
      });
      
      console.log('Parsed CSV vendors:', vendors);
      setPendingCsvData(vendors);
      setShowImportDialog(true);
      
      // Clear the file input
      event.target.value = '';
      
    } catch (error: any) {
      console.error('CSV parsing error:', error);
      toast({
        title: 'CSV Parse Failed',
        description: error.message || 'Failed to parse CSV file',
        variant: 'destructive',
      });
    }
  };

  const handleImportConfirm = async (replaceAll: boolean) => {
    setIsImporting(true);
    setShowImportDialog(false);
    
    console.log(`📥 Starting CSV import: ${pendingCsvData.length} vendors, replaceAll: ${replaceAll}`);
    
    try {
      let successCount = 0;
      let errorCount = 0;
      const errors: string[] = [];
      
      // If replacing all, delete existing vendors first
      if (replaceAll && isSupabaseConfigured) {
        console.log('🗑️ Deleting all existing vendors...');
        
        // First, get all vendor IDs
        const { data: existingVendors, error: fetchError } = await supabase
          .from('vendors')
          .select('id');
        
        if (fetchError) {
          console.error('❌ Failed to fetch existing vendors:', fetchError);
          throw new Error(`Failed to fetch existing vendors: ${fetchError.message}`);
        }
        
        console.log(`Found ${existingVendors?.length || 0} vendors to delete`);
        
        if (existingVendors && existingVendors.length > 0) {
          // Delete all vendors using a proper condition
          const { data: deletedData, error: deleteError } = await supabase
            .from('vendors')
            .delete()
            .gte('id', 0) // Delete all records where id >= 0 (should catch all)
            .select();
          
          if (deleteError) {
            console.error('❌ Failed to delete existing vendors:', {
              message: deleteError.message,
              code: deleteError.code,
              details: deleteError.details,
              hint: deleteError.hint,
            });
            throw new Error(`Failed to clear existing vendors: ${deleteError.message}`);
          }
          
          console.log(`✅ Successfully deleted ${deletedData?.length || 0} existing vendors`);
        } else {
          console.log('No existing vendors to delete');
        }
      }
      
      // Import new vendors
      console.log(`📤 Importing ${pendingCsvData.length} vendors...`);
      for (let i = 0; i < pendingCsvData.length; i++) {
        const vendor = pendingCsvData[i];
        try {
          await addVendorMutation.mutateAsync(vendor);
          successCount++;
          console.log(`✅ Imported vendor ${i + 1}/${pendingCsvData.length}: ${vendor.name || 'Unnamed'}`);
        } catch (error: any) {
          errorCount++;
          const errorMsg = `Row ${i + 2}: ${vendor.name || 'Unnamed'} - ${error.message}`;
          errors.push(errorMsg);
          console.error(`❌ Failed to import vendor ${i + 1}:`, vendor, error);
        }
      }
      
      console.log(`📊 Import complete: ${successCount} success, ${errorCount} failed`);
      
      if (errorCount > 0) {
        console.error('❌ Import errors:', errors);
      }
      
      if (successCount === 0 && errorCount > 0) {
        throw new Error(`All ${errorCount} vendors failed to import. First error: ${errors[0]}`);
      }
      
      toast({
        title: replaceAll ? 'Vendors Replaced' : 'Vendors Added',
        description: `${successCount} vendors imported successfully${errorCount > 0 ? `, ${errorCount} failed. Check console for details.` : ''}${replaceAll ? ' (Previous vendors removed)' : ''}`,
        variant: errorCount > 0 ? 'default' : 'default',
      });
      
    } catch (error: any) {
      console.error('❌ CSV import error:', {
        message: error.message,
        stack: error.stack,
      });
      toast({
        title: 'Import Failed',
        description: error.message || 'Failed to import vendors. Check console for details.',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
      setPendingCsvData([]);
    }
  };

  // Clear all vendors function for debugging
  const handleClearAllVendors = async () => {
    if (!confirm('⚠️ This will DELETE ALL VENDORS permanently. Are you sure?')) {
      return;
    }
    
    setIsClearing(true);
    
    try {
      if (isSupabaseConfigured) {
        console.log('🗑️ Clearing all vendors from Supabase...');
        
        // Get count first
        const { count } = await supabase
          .from('vendors')
          .select('*', { count: 'exact', head: true });
        
        console.log('Vendors to delete:', count);
        
        // Delete all
        const { data: deletedData, error } = await supabase
          .from('vendors')
          .delete()
          .gte('id', 0)
          .select();
        
        console.log('Clear all result:', { deletedCount: deletedData?.length, error });
        
        if (error) {
          throw new Error(`Failed to clear vendors: ${error.message}`);
        }
        
        // Force refresh
        queryClient.invalidateQueries({ queryKey: ['vendors'] });
        queryClient.invalidateQueries({ queryKey: ['/api/vendors'] });
        setTimeout(() => refetch(), 100);
        
        toast({
          title: 'All Vendors Cleared',
          description: `Successfully deleted ${deletedData?.length || 0} vendors`,
        });
      }
    } catch (error: any) {
      console.error('Clear all error:', error);
      toast({
        title: 'Clear Failed',
        description: error.message || 'Failed to clear vendors',
        variant: 'destructive',
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
            <p className="text-gray-600 mt-2">Manage your wedding vendor directory</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Vendor
            </Button>
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('csv-upload')?.click()}
              disabled={isImporting}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isImporting ? 'Importing...' : 'Import CSV'}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleClearAllVendors}
              disabled={isClearing}
              size="sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isClearing ? 'Clearing...' : 'Clear All'}
            </Button>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="min-w-48">
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedVendors.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedVendors.length} vendor(s) selected
                </span>
                <div className="flex space-x-2">
                  <Select value={bulkAction} onValueChange={setBulkAction}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Bulk action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delete">Delete</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleBulkAction}
                    disabled={!bulkAction}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vendors Table */}
        <Card>
          <CardHeader>
            <CardTitle>Vendors ({filteredVendors?.length || 0})</CardTitle>
            <CardDescription>Manage your vendor listings</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <span className="ml-2">Loading vendors...</span>
              </div>
            )}
            {isError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 font-semibold">Error loading vendors</p>
                <p className="text-red-600 text-sm mt-1">{queryError?.message || 'Unknown error'}</p>
              </div>
            )}
            {!isLoading && !isError && filteredVendors?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No vendors found. Click "Add Vendor" to get started.
              </div>
            )}
            {!isLoading && !isError && filteredVendors && filteredVendors.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedVendors(filteredVendors?.map(v => v.id) || []);
                        } else {
                          setSelectedVendors([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors?.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedVendors.includes(vendor.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedVendors([...selectedVendors, vendor.id]);
                          } else {
                            setSelectedVendors(selectedVendors.filter(id => id !== vendor.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{vendor.category}</Badge>
                    </TableCell>
                    <TableCell>{vendor.location}</TableCell>
                    <TableCell>{vendor.rating ?? 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">Active</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {vendor.youtube && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => syncYouTubeGallery(vendor.id.toString(), vendor.youtube!)}
                            title="Sync YouTube gallery"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingVendor(vendor)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteVendorMutation.mutate(vendor.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>

        {/* Add Vendor Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
              <DialogDescription>
                Create a new vendor listing for your directory
              </DialogDescription>
            </DialogHeader>
            <VendorForm
              vendor={null}
              onSubmit={(data) => addVendorMutation.mutate(data)}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Vendor Dialog */}
        <Dialog open={!!editingVendor} onOpenChange={() => setEditingVendor(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Vendor</DialogTitle>
              <DialogDescription>
                Update vendor information
              </DialogDescription>
            </DialogHeader>
            <VendorForm
              vendor={editingVendor}
              onSubmit={(data) => editingVendor && updateVendorMutation.mutate({ id: editingVendor.id, ...data })}
              onCancel={() => setEditingVendor(null)}
            />
          </DialogContent>
        </Dialog>

        {/* CSV Import Confirmation Dialog */}
        <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import CSV Vendors</DialogTitle>
              <DialogDescription>
                Found {pendingCsvData.length} vendors in your CSV file. How would you like to import them?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Current vendors:</strong> {vendors?.length || 0} in database
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Choose import method:</p>
                <div className="grid grid-cols-1 gap-2">
                  <Button 
                    variant="destructive" 
                    onClick={() => handleImportConfirm(true)}
                    disabled={isImporting}
                  >
                    🗑️ Replace All Vendors
                    <span className="text-xs ml-2">(Delete existing + import new)</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleImportConfirm(false)}
                    disabled={isImporting}
                  >
                    ➕ Add to Existing Vendors
                    <span className="text-xs ml-2">(Keep existing + add new)</span>
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setShowImportDialog(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

// Vendor Form Component
interface VendorFormProps {
  vendor: Vendor | null;
  onSubmit: (data: Partial<Vendor>) => void;
  onCancel: () => void;
}

const VendorForm: React.FC<VendorFormProps> = ({ vendor, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: vendor?.name || '',
    description: vendor?.description || '',
    category: vendor?.category || '',
    location: vendor?.location || '',
    address: vendor?.address || '',
    phone: vendor?.phone || '',
    email: vendor?.email || '',
    website: vendor?.website || '',
    price_range: vendor?.price_range || '',
    availability: vendor?.availability || '',
    youtube: vendor?.youtube || '',
    instagram: vendor?.instagram || '',
    facebook: vendor?.facebook || '',
    google_maps_place_id: vendor?.google_maps_place_id || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="price_range">Price Range</Label>
          <Input
            id="price_range"
            value={formData.price_range}
            onChange={(e) => setFormData({ ...formData, price_range: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={2}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <h3 className="text-sm font-semibold text-gray-700">Social Media & Gallery Sync</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="youtube">YouTube Channel ID</Label>
            <Input
              id="youtube"
              value={formData.youtube || ''}
              onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
              placeholder="UCxxxxxxxxxxxxxxxxxx"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter channel ID (starts with UC) to auto-sync video thumbnails to gallery
            </p>
          </div>
          <div>
            <Label htmlFor="instagram">Instagram Username</Label>
            <Input
              id="instagram"
              value={formData.instagram || ''}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              placeholder="@username"
            />
            <p className="text-xs text-gray-500 mt-1">
              Instagram username for social media links
            </p>
          </div>
        </div>

        {/* Facebook & Google Maps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="facebook">Facebook Page ID</Label>
            <Input
              id="facebook"
              value={formData.facebook || ''}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              placeholder="Page ID or username"
            />
            <p className="text-xs text-gray-500 mt-1">
              Facebook Page ID for auto-syncing public photos
            </p>
          </div>
          <div>
            <Label htmlFor="google_maps_place_id">Google Maps Place ID</Label>
            <Input
              id="google_maps_place_id"
              value={formData.google_maps_place_id || ''}
              onChange={(e) => setFormData({ ...formData, google_maps_place_id: e.target.value })}
              placeholder="ChIJ..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Google Maps Place ID for auto-syncing location photos
            </p>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {vendor ? 'Update' : 'Create'} Vendor
        </Button>
      </DialogFooter>
    </form>
  );
};

export default VendorsPage;
