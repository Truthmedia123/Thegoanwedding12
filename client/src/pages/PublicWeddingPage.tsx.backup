import React, { useState, useEffect } from 'react';
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
import { Loader2, Heart, Calendar, MapPin, Clock, Users, Check, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-white">
      {/* Elegant Hero Section */}
      <div 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${themeColor}15 0%, ${themeColor}05 100%)`,
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full opacity-20" 
               style={{ background: `radial-gradient(circle, ${themeColor} 0%, transparent 70%)` }}></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full opacity-20" 
               style={{ background: `radial-gradient(circle, ${themeColor} 0%, transparent 70%)` }}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full opacity-10" 
               style={{ background: `radial-gradient(circle, ${themeColor} 0%, transparent 70%)` }}></div>
        </div>

        <div className="relative z-10 text-center px-4 py-20">
          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-px" style={{ backgroundColor: themeColor }}></div>
            <Sparkles className="w-6 h-6" style={{ color: themeColor }} />
            <div className="w-16 h-px" style={{ backgroundColor: themeColor }}></div>
          </div>

          {/* Save the Date */}
          <p className="text-sm tracking-[0.3em] uppercase mb-6" style={{ color: themeColor }}>
            Save the Date
          </p>

          {/* Names */}
          <h1 className="font-serif text-6xl md:text-8xl mb-6 text-gray-800" style={{ 
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontWeight: 400,
            letterSpacing: '0.02em'
          }}>
            {wedding.bride_name}
          </h1>
          
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="w-12 h-px bg-gray-300"></div>
            <Heart className="w-8 h-8 animate-pulse" style={{ color: themeColor }} />
            <div className="w-12 h-px bg-gray-300"></div>
          </div>

          <h1 className="font-serif text-6xl md:text-8xl mb-12 text-gray-800" style={{ 
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontWeight: 400,
            letterSpacing: '0.02em'
          }}>
            {wedding.groom_name}
          </h1>

          {/* Date */}
          <div className="mb-8">
            <p className="text-3xl md:text-4xl font-light text-gray-700 mb-2">
              {new Date(wedding.wedding_date).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
            <p className="text-lg text-gray-600">
              {new Date(wedding.wedding_date).toLocaleDateString('en-US', { 
                weekday: 'long'
              })}
            </p>
          </div>

          {/* Venue */}
          <div className="flex items-center justify-center gap-2 text-lg text-gray-600 mb-12">
            <MapPin className="w-5 h-5" style={{ color: themeColor }} />
            <span>{wedding.venue}</span>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce mt-12">
            <div className="w-6 h-10 border-2 rounded-full mx-auto flex items-start justify-center p-2" 
                 style={{ borderColor: themeColor }}>
              <div className="w-1 h-2 rounded-full" style={{ backgroundColor: themeColor }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-20 space-y-20">
        {/* Custom Message */}
        {wedding.custom_message && (
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-px" style={{ backgroundColor: themeColor }}></div>
              <Heart className="w-5 h-5" style={{ color: themeColor }} />
              <div className="w-12 h-px" style={{ backgroundColor: themeColor }}></div>
            </div>
            <p className="text-2xl md:text-3xl font-light text-gray-700 italic leading-relaxed" style={{
              fontFamily: "'Playfair Display', 'Georgia', serif"
            }}>
              "{wedding.custom_message}"
            </p>
          </div>
        )}

        {/* Love Story */}
        {wedding.story && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif mb-4 text-gray-800" style={{
                fontFamily: "'Playfair Display', 'Georgia', serif"
              }}>
                Our Story
              </h2>
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-px" style={{ backgroundColor: themeColor }}></div>
                <Heart className="w-5 h-5" style={{ color: themeColor }} />
                <div className="w-16 h-px" style={{ backgroundColor: themeColor }}></div>
              </div>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line text-center">
              {wedding.story}
            </p>
          </div>
        )}

        {/* Events */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif mb-4 text-gray-800" style={{
              fontFamily: "'Playfair Display', 'Georgia', serif"
            }}>
              Wedding Events
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-px" style={{ backgroundColor: themeColor }}></div>
              <Calendar className="w-5 h-5" style={{ color: themeColor }} />
              <div className="w-16 h-px" style={{ backgroundColor: themeColor }}></div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {wedding.events?.sort((a: any, b: any) => a.order_index - b.order_index).map((event: any, index: number) => (
              <div 
                key={event.id} 
                className="bg-white border-2 rounded-lg p-8 text-center hover:shadow-xl transition-shadow duration-300"
                style={{ borderColor: `${themeColor}30` }}
              >
                <div className="mb-4">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                       style={{ backgroundColor: `${themeColor}15` }}>
                    <Calendar className="w-8 h-8" style={{ color: themeColor }} />
                  </div>
                  <h3 className="text-2xl font-serif mb-2 text-gray-800" style={{
                    fontFamily: "'Playfair Display', 'Georgia', serif"
                  }}>
                    {event.name}
                  </h3>
                  {event.description && (
                    <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                  )}
                </div>
                
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" style={{ color: themeColor }} />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: themeColor }} />
                    <span>{event.start_time} {event.end_time && `- ${event.end_time}`}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: themeColor }} />
                    <span className="text-center">{event.venue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RSVP Section */}
        {!showRSVPForm && !submitted && (
          <div className="text-center py-12">
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-serif mb-4 text-gray-800" style={{
                fontFamily: "'Playfair Display', 'Georgia', serif"
              }}>
                Join Our Celebration
              </h2>
              <p className="text-gray-600 text-lg">We would be honored by your presence</p>
            </div>
            <Button 
              size="lg" 
              className="text-lg px-12 py-6 rounded-full font-light tracking-wide hover:scale-105 transition-transform duration-300"
              style={{ 
                backgroundColor: themeColor,
                boxShadow: `0 10px 30px ${themeColor}40`
              }}
              onClick={() => setShowRSVPForm(true)}
            >
              <Heart className="w-5 h-5 mr-2" />
              RSVP Now
            </Button>
          </div>
        )}

        {/* RSVP Form */}
        {showRSVPForm && !submitted && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif mb-4 text-gray-800" style={{
                fontFamily: "'Playfair Display', 'Georgia', serif"
              }}>
                Please RSVP
              </h2>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-16 h-px" style={{ backgroundColor: themeColor }}></div>
                <Heart className="w-5 h-5" style={{ color: themeColor }} />
                <div className="w-16 h-px" style={{ backgroundColor: themeColor }}></div>
              </div>
              <p className="text-gray-600">We'd love to know if you can join us!</p>
            </div>
            
            <Card className="border-2" style={{ borderColor: `${themeColor}20` }}>
              <CardContent className="pt-8 space-y-6">
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
          </div>
        )}

        {/* Success Message */}
        {submitted && (
          <div className="text-center py-12 max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                   style={{ backgroundColor: `${themeColor}15` }}>
                <Check className="w-10 h-10" style={{ color: themeColor }} />
              </div>
              <h2 className="text-4xl md:text-5xl font-serif mb-4 text-gray-800" style={{
                fontFamily: "'Playfair Display', 'Georgia', serif"
              }}>
                Thank You!
              </h2>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="w-16 h-px" style={{ backgroundColor: themeColor }}></div>
                <Heart className="w-5 h-5" style={{ color: themeColor }} />
                <div className="w-16 h-px" style={{ backgroundColor: themeColor }}></div>
              </div>
              <p className="text-xl text-gray-700 leading-relaxed">
                Your RSVP has been received. We can't wait to celebrate with you!
              </p>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="text-center py-12 border-t" style={{ borderColor: `${themeColor}20` }}>
          <h3 className="text-2xl font-serif mb-4 text-gray-800" style={{
            fontFamily: "'Playfair Display', 'Georgia', serif"
          }}>
            Questions?
          </h3>
          <p className="text-gray-600 mb-4">
            For any questions, please contact us at:
          </p>
          <p className="text-lg font-semibold mb-2" style={{ color: themeColor }}>
            {wedding.contact_email}
          </p>
          {wedding.contact_phone && (
            <p className="text-lg font-semibold" style={{ color: themeColor }}>
              {wedding.contact_phone}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-gray-500 text-sm">
        <p>With love, {wedding.bride_name} & {wedding.groom_name}</p>
      </div>
    </div>
  );
};

export default PublicWeddingPage;