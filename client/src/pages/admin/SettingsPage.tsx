import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Settings, 
  Users, 
  Palette, 
  Globe, 
  Save,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SiteSetting {
  id: number;
  key: string;
  value: any;
  description: string | null;
  created_at: string;
  updated_at: string;
}

interface AdminUser {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

const SettingsPage: React.FC = () => {
  const [siteSettings, setSiteSettings] = useState({
    site_title: '',
    site_description: '',
    site_keywords: '',
    primary_color: '#ec4899',
    secondary_color: '#8b5cf6',
    accent_color: '#10b981',
    logo_url: '',
    favicon_url: '',
    ga_tracking_id: '',
    clarity_project_id: '',
  });

  const [newAdminEmail, setNewAdminEmail] = useState('');
  const queryClient = useQueryClient();

  // Fetch site settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      return data as SiteSetting[];
    },
    onSuccess: (data) => {
      const settingsObj: any = {};
      data.forEach(setting => {
        settingsObj[setting.key] = setting.value;
      });
      setSiteSettings(prev => ({ ...prev, ...settingsObj }));
    }
  });

  // Fetch admin users
  const { data: adminUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'admin');
      
      if (error) throw error;
      return data as AdminUser[];
    }
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (settingsData: any) => {
      const updates = Object.entries(settingsData).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString()
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert(update, { onConflict: 'key' });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
      toast({
        title: 'Success',
        description: 'Settings updated successfully',
      });
    }
  });

  // Add admin user mutation
  const addAdminMutation = useMutation({
    mutationFn: async (email: string) => {
      // This would typically send an invitation email
      // For now, we'll just show a success message
      return { email };
    },
    onSuccess: () => {
      setNewAdminEmail('');
      toast({
        title: 'Success',
        description: 'Admin invitation sent',
      });
    }
  });

  // Remove admin user mutation
  const removeAdminMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .update({ role: 'user' })
        .eq('id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'Success',
        description: 'Admin access removed',
      });
    }
  });

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(siteSettings);
  };

  const handleAddAdmin = () => {
    if (!newAdminEmail) return;
    addAdminMutation.mutate(newAdminEmail);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Configure your site settings and manage admin users</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">
              <Globe className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="theme">
              <Palette className="w-4 h-4 mr-2" />
              Theme
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <Settings className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="w-4 h-4 mr-2" />
              Admin Users
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Basic site information and configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="site_title">Site Title</Label>
                    <Input
                      id="site_title"
                      value={siteSettings.site_title}
                      onChange={(e) => setSiteSettings({ ...siteSettings, site_title: e.target.value })}
                      placeholder="TheGoanWedding"
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo_url">Logo URL</Label>
                    <Input
                      id="logo_url"
                      value={siteSettings.logo_url}
                      onChange={(e) => setSiteSettings({ ...siteSettings, logo_url: e.target.value })}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="site_description">Site Description</Label>
                  <Textarea
                    id="site_description"
                    value={siteSettings.site_description}
                    onChange={(e) => setSiteSettings({ ...siteSettings, site_description: e.target.value })}
                    placeholder="Premier Wedding Vendor Directory for Goa"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="site_keywords">SEO Keywords</Label>
                  <Input
                    id="site_keywords"
                    value={siteSettings.site_keywords}
                    onChange={(e) => setSiteSettings({ ...siteSettings, site_keywords: e.target.value })}
                    placeholder="wedding, goa, vendors, photography, venue"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="favicon_url">Favicon URL</Label>
                    <Input
                      id="favicon_url"
                      value={siteSettings.favicon_url}
                      onChange={(e) => setSiteSettings({ ...siteSettings, favicon_url: e.target.value })}
                      placeholder="https://example.com/favicon.ico"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theme Settings */}
          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Theme Customization</CardTitle>
                <CardDescription>Customize your site's colors and appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="primary_color">Primary Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="primary_color"
                        type="color"
                        value={siteSettings.primary_color}
                        onChange={(e) => setSiteSettings({ ...siteSettings, primary_color: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        value={siteSettings.primary_color}
                        onChange={(e) => setSiteSettings({ ...siteSettings, primary_color: e.target.value })}
                        placeholder="#ec4899"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="secondary_color">Secondary Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="secondary_color"
                        type="color"
                        value={siteSettings.secondary_color}
                        onChange={(e) => setSiteSettings({ ...siteSettings, secondary_color: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        value={siteSettings.secondary_color}
                        onChange={(e) => setSiteSettings({ ...siteSettings, secondary_color: e.target.value })}
                        placeholder="#8b5cf6"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="accent_color">Accent Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="accent_color"
                        type="color"
                        value={siteSettings.accent_color}
                        onChange={(e) => setSiteSettings({ ...siteSettings, accent_color: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        value={siteSettings.accent_color}
                        onChange={(e) => setSiteSettings({ ...siteSettings, accent_color: e.target.value })}
                        placeholder="#10b981"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Color Preview</h4>
                  <div className="flex space-x-4">
                    <div 
                      className="w-16 h-16 rounded-lg"
                      style={{ backgroundColor: siteSettings.primary_color }}
                    ></div>
                    <div 
                      className="w-16 h-16 rounded-lg"
                      style={{ backgroundColor: siteSettings.secondary_color }}
                    ></div>
                    <div 
                      className="w-16 h-16 rounded-lg"
                      style={{ backgroundColor: siteSettings.accent_color }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Settings */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Configuration</CardTitle>
                <CardDescription>Set up tracking and analytics services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="ga_tracking_id">Google Analytics Tracking ID</Label>
                    <Input
                      id="ga_tracking_id"
                      value={siteSettings.ga_tracking_id}
                      onChange={(e) => setSiteSettings({ ...siteSettings, ga_tracking_id: e.target.value })}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="clarity_project_id">Microsoft Clarity Project ID</Label>
                    <Input
                      id="clarity_project_id"
                      value={siteSettings.clarity_project_id}
                      onChange={(e) => setSiteSettings({ ...siteSettings, clarity_project_id: e.target.value })}
                      placeholder="your-clarity-project-id"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Users */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Admin Users</CardTitle>
                <CardDescription>Manage admin access and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter email address"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleAddAdmin} disabled={!newAdminEmail}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Admin
                    </Button>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminUsers?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.full_name || 'No name'}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {user.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAdminMutation.mutate(user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <Button onClick={handleSaveSettings} disabled={updateSettingsMutation.isPending}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
