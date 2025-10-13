import React, { useState } from 'react';
import { useParams } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Heart, Calendar, MapPin, Clock, Users, Check } from 'lucide-react';

const PublicWeddingPage: React.FC = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [showRSVPForm, setShowRSVPForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // RSVP Form Data
  const [rsvpData, setRsvpData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    total_guests: 1,
    message: '',
    event_responses: {} as Record<number, { attending: boolean; dietary_restrictions: string }>
  });

  // Fetch wedding data
  const { data: wedding, isLoading } = useQuery({
    queryKey: ['wedding', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weddings')
        .select(`
          *,
          events:wedding_events(*)
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;

      // Initialize event responses
      const initialResponses: Record<number, { attending: boolean; dietary_restrictions: string }> = {};
      data.events?.forEach((event: any) => {
        initialResponses[event.id] = { attending: true, dietary_restrictions: '' };
      });
      setRsvpData(prev => ({ ...prev, event_responses: initialResponses }));

      return data;
    }
  });

  // Submit RSVP
  const submitRSVPMutation = useMutation({
    mutationFn: async () => {
      // Create guest RSVP
      const { data: guestRsvp, error: rsvpError } = await supabase
        .from('guest_rsvps')
        .insert({
          wedding_id: wedding.id,
          guest_name: rsvpData.guest_name,
          guest_email: rsvpData.guest_email,
          guest_phone: rsvpData.guest_phone,
          total_guests: rsvpData.total_guests,
          message: rsvpData.message
        })
        .select()
        .single();

      if (rsvpError) throw rsvpError;

      // Create event responses
      const eventResponses = Object.entries(rsvpData.event_responses)
        .map(([eventId, response]) => ({
          rsvp_id: guestRsvp.id,
          event_id: parseInt(eventId),
          attending: response.attending,
          dietary_restrictions: response.dietary_restrictions
        }));

      const { error: responsesError } = await supabase
        .from('guest_event_responses')
        .insert(eventResponses);

      if (responsesError) throw responsesError;

      return guestRsvp;
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: 'Thank you!',
        description: 'Your RSVP has been submitted successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit RSVP. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const updateEventResponse = (eventId: number, field: 'attending' | 'dietary_restrictions', value: boolean | string) => {
    setRsvpData(prev => ({
      ...prev,
      event_responses: {
        ...prev.event_responses,
        [eventId]: {
          ...prev.event_responses[eventId],
          [field]: value
        }
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  if (!wedding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Wedding Not Found</CardTitle>
            <CardDescription>This wedding page doesn't exist or has been removed.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const themeColor = wedding.theme_color || '#FF6B9D';

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <div 
        className="relative h-[60vh] flex items-center justify-center text-white"
        style={{ 
          background: `linear-gradient(135deg, ${themeColor}dd 0%, ${themeColor}99 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center px-4">
          <Heart className="w-16 h-16 mx-auto mb-6 animate-pulse" />
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            {wedding.bride_name} & {wedding.groom_name}
          </h1>
          <p className="text-2xl md:text-3xl font-light">
            {new Date(wedding.wedding_date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 text-xl">
            <MapPin className="w-5 h-5" />
            <span>{wedding.venue}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* Custom Message */}
        {wedding.custom_message && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-lg text-gray-700 italic">
                "{wedding.custom_message}"
              </p>
            </CardContent>
          </Card>
        )}

        {/* Love Story */}
        {wedding.story && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" style={{ color: themeColor }} />
                Our Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-line">{wedding.story}</p>
            </CardContent>
          </Card>
        )}

        {/* Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" style={{ color: themeColor }} />
              Wedding Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {wedding.events?.sort((a: any, b: any) => a.order_index - b.order_index).map((event: any) => (
              <div key={event.id} className="border-l-4 pl-4 py-2" style={{ borderColor: themeColor }}>
                <h3 className="text-xl font-semibold">{event.name}</h3>
                {event.description && (
                  <p className="text-gray-600 mt-1">{event.description}</p>
                )}
                <div className="flex flex-col gap-2 mt-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {event.start_time} {event.end_time && `- ${event.end_time}`}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {event.venue}, {event.address}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* RSVP Section */}
        {!showRSVPForm && !submitted && (
          <Card>
            <CardContent className="pt-6 text-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                style={{ backgroundColor: themeColor }}
                onClick={() => setShowRSVPForm(true)}
              >
                <Heart className="w-5 h-5 mr-2" />
                RSVP Now
              </Button>
            </CardContent>
          </Card>
        )}

        {/* RSVP Form */}
        {showRSVPForm && !submitted && (
          <Card>
            <CardHeader>
              <CardTitle>Please RSVP</CardTitle>
              <CardDescription>We'd love to know if you can join us!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guest_name">Your Name *</Label>
                  <Input
                    id="guest_name"
                    value={rsvpData.guest_name}
                    onChange={(e) => setRsvpData({ ...rsvpData, guest_name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="guest_email">Email</Label>
                  <Input
                    id="guest_email"
                    type="email"
                    value={rsvpData.guest_email}
                    onChange={(e) => setRsvpData({ ...rsvpData, guest_email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guest_phone">Phone</Label>
                  <Input
                    id="guest_phone"
                    value={rsvpData.guest_phone}
                    onChange={(e) => setRsvpData({ ...rsvpData, guest_phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <Label htmlFor="total_guests">Total Guests (including you) *</Label>
                  <Input
                    id="total_guests"
                    type="number"
                    min="1"
                    value={rsvpData.total_guests}
                    onChange={(e) => setRsvpData({ ...rsvpData, total_guests: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>

              {/* Event Selection */}
              <div className="space-y-4">
                <Label className="text-lg">Which events will you attend?</Label>
                {wedding.events?.sort((a: any, b: any) => a.order_index - b.order_index).map((event: any) => (
                  <Card key={event.id} className="border-2">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={`event-${event.id}`}
                          checked={rsvpData.event_responses[event.id]?.attending}
                          onCheckedChange={(checked) => updateEventResponse(event.id, 'attending', checked as boolean)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={`event-${event.id}`} className="text-base font-semibold cursor-pointer">
                            {event.name}
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(event.date).toLocaleDateString()} at {event.start_time}
                          </p>
                        </div>
                      </div>

                      {rsvpData.event_responses[event.id]?.attending && (
                        <div>
                          <Label htmlFor={`dietary-${event.id}`} className="text-sm">
                            Dietary restrictions or special requests
                          </Label>
                          <Textarea
                            id={`dietary-${event.id}`}
                            value={rsvpData.event_responses[event.id]?.dietary_restrictions || ''}
                            onChange={(e) => updateEventResponse(event.id, 'dietary_restrictions', e.target.value)}
                            placeholder="Any dietary restrictions?"
                            rows={2}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div>
                <Label htmlFor="message">Message for the Couple (Optional)</Label>
                <Textarea
                  id="message"
                  value={rsvpData.message}
                  onChange={(e) => setRsvpData({ ...rsvpData, message: e.target.value })}
                  placeholder="Congratulations! We're so excited..."
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowRSVPForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => submitRSVPMutation.mutate()}
                  disabled={!rsvpData.guest_name || submitRSVPMutation.isPending}
                  className="flex-1"
                  style={{ backgroundColor: themeColor }}
                >
                  {submitRSVPMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit RSVP
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {submitted && (
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Thank You!</CardTitle>
              <CardDescription className="text-lg">
                Your RSVP has been received. We can't wait to celebrate with you!
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-gray-700">
              For any questions, please contact us at:
            </p>
            <p className="font-semibold">{wedding.contact_email}</p>
            {wedding.contact_phone && (
              <p className="font-semibold">{wedding.contact_phone}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicWeddingPage;