import React, { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Calendar, Download, Mail, Phone, MessageSquare, Check, X } from 'lucide-react';

const WeddingAdmin: React.FC = () => {
  const { slug } = useParams();
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const key = searchParams.get('key');

  // Fetch wedding data with admin verification
  const { data: wedding, isLoading, error } = useQuery({
    queryKey: ['wedding-admin', slug, key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weddings')
        .select(`
          *,
          events:wedding_events(*),
          rsvps:guest_rsvps(
            *,
            event_responses:guest_event_responses(
              *,
              event:wedding_events(*)
            )
          )
        `)
        .eq('slug', slug)
        .eq('admin_secret_key', key)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug && !!key
  });

  const downloadCSV = () => {
    if (!wedding?.rsvps) return;

    const headers = ['Name', 'Email', 'Phone', 'Total Guests', 'Events Attending', 'Dietary Restrictions', 'Message', 'RSVP Date'];
    const rows = wedding.rsvps.map((rsvp: any) => {
      const attendingEvents = rsvp.event_responses
        ?.filter((er: any) => er.attending)
        .map((er: any) => er.event?.name)
        .join('; ') || '';
      
      const dietaryRestrictions = rsvp.event_responses
        ?.filter((er: any) => er.attending && er.dietary_restrictions)
        .map((er: any) => `${er.event?.name}: ${er.dietary_restrictions}`)
        .join('; ') || '';

      return [
        rsvp.guest_name,
        rsvp.guest_email || '',
        rsvp.guest_phone || '',
        rsvp.total_guests,
        attendingEvents,
        dietaryRestrictions,
        rsvp.message || '',
        new Date(rsvp.created_at).toLocaleDateString()
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${wedding.bride_name}-${wedding.groom_name}-rsvps.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  if (error || !wedding) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Invalid admin link. Please check your link and try again.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const totalGuests = wedding.rsvps?.reduce((sum: number, rsvp: any) => sum + (rsvp.total_guests || 0), 0) || 0;
  const totalRSVPs = wedding.rsvps?.length || 0;

  // Calculate attendance per event
  const eventStats = wedding.events?.map((event: any) => {
    const attending = wedding.rsvps?.reduce((count: number, rsvp: any) => {
      const eventResponse = rsvp.event_responses?.find((er: any) => er.event_id === event.id);
      return count + (eventResponse?.attending ? rsvp.total_guests : 0);
    }, 0) || 0;

    return {
      ...event,
      attendingCount: attending
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {wedding.bride_name} & {wedding.groom_name}
          </h1>
          <p className="text-gray-600">Wedding RSVP Dashboard</p>
          <p className="text-sm text-gray-500 mt-2">
            {new Date(wedding.wedding_date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total RSVPs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-600" />
                <span className="text-3xl font-bold">{totalRSVPs}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Guests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-600" />
                <span className="text-3xl font-bold">{totalGuests}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={downloadCSV} variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Event Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Event Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventStats?.map((event: any) => (
                <div key={event.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">{event.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {new Date(event.date).toLocaleDateString()} at {event.start_time}
                  </p>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-2xl font-bold text-pink-600">{event.attendingCount}</span>
                    <span className="text-gray-600">guests attending</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* RSVP List */}
        <Card>
          <CardHeader>
            <CardTitle>Guest RSVPs</CardTitle>
            <CardDescription>All responses from your guests</CardDescription>
          </CardHeader>
          <CardContent>
            {wedding.rsvps && wedding.rsvps.length > 0 ? (
              <div className="space-y-4">
                {wedding.rsvps.map((rsvp: any) => (
                  <Card key={rsvp.id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">{rsvp.guest_name}</h3>
                          
                          <div className="space-y-2 text-sm">
                            {rsvp.guest_email && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-4 h-4" />
                                <span>{rsvp.guest_email}</span>
                              </div>
                            )}
                            {rsvp.guest_phone && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{rsvp.guest_phone}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="w-4 h-4" />
                              <span>{rsvp.total_guests} guest{rsvp.total_guests !== 1 ? 's' : ''}</span>
                            </div>
                          </div>

                          {/* Event Attendance */}
                          <div className="mt-4">
                            <p className="text-sm font-semibold mb-2">Attending:</p>
                            <div className="flex flex-wrap gap-2">
                              {rsvp.event_responses?.map((er: any) => (
                                <Badge 
                                  key={er.id} 
                                  variant={er.attending ? "default" : "secondary"}
                                  className="flex items-center gap-1"
                                >
                                  {er.attending ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                  {er.event?.name}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Dietary Restrictions */}
                          {rsvp.event_responses?.some((er: any) => er.dietary_restrictions) && (
                            <div className="mt-4">
                              <p className="text-sm font-semibold mb-2">Dietary Restrictions:</p>
                              <div className="space-y-1">
                                {rsvp.event_responses
                                  ?.filter((er: any) => er.dietary_restrictions)
                                  .map((er: any) => (
                                    <p key={er.id} className="text-sm text-gray-600">
                                      <span className="font-medium">{er.event?.name}:</span> {er.dietary_restrictions}
                                    </p>
                                  ))}
                              </div>
                            </div>
                          )}

                          {/* Message */}
                          {rsvp.message && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-start gap-2">
                                <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                                <p className="text-sm text-gray-700 italic">"{rsvp.message}"</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="text-sm text-gray-500">
                          {new Date(rsvp.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No RSVPs yet. Share your wedding page with guests!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Public Link */}
        <Card>
          <CardHeader>
            <CardTitle>Share Your Wedding Page</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input
                type="text"
                value={`${window.location.origin}/wedding/${wedding.slug}`}
                readOnly
                className="flex-1 px-3 py-2 border rounded-md bg-gray-50"
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/wedding/${wedding.slug}`);
                }}
              >
                Copy Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeddingAdmin;
