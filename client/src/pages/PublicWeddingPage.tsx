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
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    if (wedding?.wedding_date) {
      const targetDate = new Date(wedding.wedding_date).getTime();

      timerRef.current = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
          setCountdown({ days, hours, minutes, seconds });
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [wedding?.wedding_date]);

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
      {/* Hero Section with Countdown */}
      <div 
        className="relative min-h-screen flex items-center justify-center text-white bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop')` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center px-4 py-20">
          <div className="flex items-center justify-center gap-4 md:gap-8 mb-4 flex-wrap">
            <h1 className="font-serif text-5xl md:text-7xl" style={{ fontFamily: "'Playfair Display', serif" }}>{wedding.bride_name}</h1>
            <span className="font-serif text-5xl md:text-7xl text-amber-300">&</span>
            <h1 className="font-serif text-5xl md:text-7xl" style={{ fontFamily: "'Playfair Display', serif" }}>{wedding.groom_name}</h1>
          </div>

          <p className="text-lg md:text-xl tracking-widest uppercase mb-6 text-amber-200">We are getting married</p>

          <p className="text-lg md:text-xl font-light mb-8">
            {new Date(wedding.wedding_date).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>

          {/* Countdown Timer */}
          <div className="flex justify-center gap-4 md:gap-8 mb-12 flex-wrap">
            <div className="text-center">
              <p className="text-4xl md:text-6xl font-bold">{countdown.days}</p>
              <p className="text-sm uppercase">Days</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-6xl font-bold">{countdown.hours}</p>
              <p className="text-sm uppercase">Hours</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-6xl font-bold">{countdown.minutes}</p>
              <p className="text-sm uppercase">Minutes</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-6xl font-bold">{countdown.seconds}</p>
              <p className="text-sm uppercase">Seconds</p>
            </div>
          </div>

          <Button 
            size="lg" 
            className="text-lg px-12 py-6 rounded-full font-light tracking-wide bg-amber-400 text-black hover:bg-amber-500 transition-transform duration-300"
            onClick={() => document.getElementById('rsvp-form')?.scrollIntoView({ behavior: 'smooth' })}
          >
            RSVP
          </Button>
        </div>
      </div>

      {/* Our Story Section */}
      {(wedding.story || wedding.custom_message) && (
        <div className="bg-white py-20 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="font-serif text-4xl md:text-5xl text-gray-800 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Our Story
              </h2>
              {wedding.custom_message && (
                <p className="text-lg text-gray-700 italic mb-6 leading-relaxed">
                  "{wedding.custom_message}"
                </p>
              )}
              {wedding.story && (
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {wedding.story}
                </p>
              )}
            </div>
            <div className="order-1 md:order-2">
              <img 
                src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop"
                alt="Couple"
                className="rounded-lg shadow-xl w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Events Section */}
      <div className="bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              The Wedding Day
            </h2>
            <p className="text-gray-600">Here's what to expect during our wedding weekend.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            {wedding.events?.sort((a: any, b: any) => a.order_index - b.order_index).map((event: any) => (
              <div key={event.id} className="text-center md:text-left">
                <h3 className="font-serif text-2xl text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {event.name}
                </h3>
                <p className="text-amber-600 font-semibold mb-2">
                  {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {event.start_time}
                </p>
                <p className="text-gray-600 mb-1">{event.venue}</p>
                <p className="text-gray-500 text-sm">{event.address}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RSVP Form Section */}
      <div id="rsvp-form" className="bg-amber-50 py-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Will You Be Attending?
            </h2>
            <p className="text-gray-600">Please RSVP by the 25th of December</p>
          </div>
          {!submitted ? (
            <Card className="bg-white shadow-xl rounded-lg">
              <CardContent className="p-8 space-y-6">
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
          ) : (
            <div className="text-center py-12">
              <Check className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h3 className="font-serif text-3xl text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Thank You!</h3>
              <p className="text-gray-600">Your RSVP has been submitted. We can't wait to celebrate with you!</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-12 px-4 text-center">
        <h3 className="font-serif text-3xl mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>{wedding.bride_name} & {wedding.groom_name}</h3>
        <p className="mb-4">{new Date(wedding.wedding_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p className="text-gray-400 text-sm">For any questions, contact us at {wedding.contact_email}</p>
      </div>
    </div>
  );
};

export default PublicWeddingPage;