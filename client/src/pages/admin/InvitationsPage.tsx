import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Download, 
  Filter,
  Mail,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface Invitation {
  id: number;
  wedding_id: string;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string | null;
  plus_ones: number;
  dietary_requirements: string | null;
  rsvp_status: string | null;
  rsvp_date: string | null;
  created_at: string;
  updated_at: string;
}

const InvitationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [weddingFilter, setWeddingFilter] = useState('');

  // Fetch invitations
  const { data: invitations, isLoading } = useQuery({
    queryKey: ['invitations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Invitation[];
    }
  });

  // Get unique wedding IDs for filter
  const weddingIds = React.useMemo(() => {
    if (!invitations) return [];
    return [...new Set(invitations.map(inv => inv.wedding_id))];
  }, [invitations]);

  // Filter invitations
  const filteredInvitations = invitations?.filter(invitation => {
    const matchesSearch = invitation.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          invitation.guest_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          invitation.wedding_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || invitation.rsvp_status === statusFilter;
    const matchesWedding = !weddingFilter || invitation.wedding_id === weddingFilter;
    return matchesSearch && matchesStatus && matchesWedding;
  });

  // Export to CSV
  const exportToCSV = () => {
    if (!filteredInvitations) return;
    
    const csv = [
      ['Wedding ID', 'Guest Name', 'Email', 'Phone', 'Plus Ones', 'Dietary Requirements', 'RSVP Status', 'RSVP Date', 'Created'],
      ...filteredInvitations.map(invitation => [
        invitation.wedding_id,
        invitation.guest_name,
        invitation.guest_email || '',
        invitation.guest_phone || '',
        invitation.plus_ones.toString(),
        invitation.dietary_requirements || '',
        invitation.rsvp_status || 'Pending',
        invitation.rsvp_date || '',
        new Date(invitation.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invitations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Get status badge
  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Accepted</Badge>;
      case 'declined':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Declined</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="secondary">No Response</Badge>;
    }
  };

  // Get stats
  const stats = React.useMemo(() => {
    if (!filteredInvitations) return { total: 0, accepted: 0, declined: 0, pending: 0 };
    
    const total = filteredInvitations.length;
    const accepted = filteredInvitations.filter(inv => inv.rsvp_status === 'accepted').length;
    const declined = filteredInvitations.filter(inv => inv.rsvp_status === 'declined').length;
    const pending = filteredInvitations.filter(inv => !inv.rsvp_status || inv.rsvp_status === 'pending').length;
    
    return { total, accepted, declined, pending };
  }, [filteredInvitations]);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invitations Management</h1>
            <p className="text-gray-600 mt-2">View and manage wedding invitations</p>
          </div>
          <Button onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Invitations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Accepted</p>
                  <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Declined</p>
                  <p className="text-2xl font-bold text-red-600">{stats.declined}</p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search invitations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="status">RSVP Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="wedding">Wedding ID</Label>
                <Select value={weddingFilter} onValueChange={setWeddingFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All weddings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All weddings</SelectItem>
                    {weddingIds.map((weddingId) => (
                      <SelectItem key={weddingId} value={weddingId}>
                        {weddingId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invitations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Invitations ({filteredInvitations?.length || 0})</CardTitle>
            <CardDescription>Manage wedding invitations and RSVPs</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wedding ID</TableHead>
                  <TableHead>Guest Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Plus Ones</TableHead>
                  <TableHead>RSVP Status</TableHead>
                  <TableHead>RSVP Date</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvitations?.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">
                      <Badge variant="outline">{invitation.wedding_id}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{invitation.guest_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {invitation.guest_email && (
                          <p className="text-sm text-gray-900">{invitation.guest_email}</p>
                        )}
                        {invitation.guest_phone && (
                          <p className="text-sm text-gray-500">{invitation.guest_phone}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{invitation.plus_ones}</span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(invitation.rsvp_status)}
                    </TableCell>
                    <TableCell>
                      {invitation.rsvp_date ? (
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {new Date(invitation.rsvp_date).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(invitation.created_at).toLocaleDateString()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default InvitationsPage;
