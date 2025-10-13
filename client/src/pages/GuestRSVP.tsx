import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { rsvpService } from '@/lib/supabase-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Heart, Calendar, MapPin, Clock } from 'lucide-react';

const GuestRSVP: React.FC = () => {
  const [rsvpCode, setRsvpCode] = useState('');
  const [guestData, setGuestData] = useState<any>(null);
  const [eventResponses, setEventResponses] = useState<Record<number, any>>({});
  const { toast } = useToast();

  // Fetch guest data by RSVP code
  const { isLoading: isSearching } = useQuery({
    queryKey: ['guest', rsvpCode],
    queryFn: async () => {
      if (!rsvpCode || rsvpCode.length < 4) return null;
      const result = await rsvpService.getGuestByCode(rsvpCode);
      if (result.data) {
        setGuestData(result.data);
        // Initialize responses
        const initialResponses: Record<number, any> = {};
        result.data.invited_events?.forEach((invite: any) => {
          const existingRsvp = result.data.rsvps?.find((r: any) => r.event_id === invite.event.id);
          initialResponses[invite.event.id] = {
            event_id: invite.event.id,
            status: existingRsvp?.status || 'Attending',
            plus_ones_attending: existingRsvp?.plus_ones_attending || 0,
            dietary_restrictions: existingRsvp?.dietary_restrictions || ''
          };
        });
        setEventResponses(initialResponses);
      } else {
        toast({
          title: 'Not Found',
          description: 'Invalid RSVP code. Please check and try again.',
          variant: 'destructive'
        });
      }
      return result.data;
    },
    enabled: false
  });

  // Submit RSVP mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      const rsvps = Object.values(eventResponses);
      return await rsvpService.submitRSVP(guestData.id, rsvps);
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Your RSVP has been submitted successfully.',
      });
      setGuestData({ ...guestData, status: 'Responded' });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to submit RSVP. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const handleSearch = () => {
    if (rsvpCode.length >= 4) {
      rsvpService.getGuestByCode(rsvpCode).then(result => {
        if (result.data) {
          setGuestData(result.data);
          const initialResponses: Record<number, any> = {};
          result.data.invited_events?.forEach((invite: any) => {
            const existingRsvp = result.data.rsvps?.find((r: any) => r.event_id === invite.event.id);
            initialResponses[invite.event.id] = {
              event_id: invite.event.id,
              status: existingRsvp?.status || 'Attending',
              plus_ones_attending: existingRsvp?.plus_ones_attending || 0,
              dietary_restrictions: existingRsvp?.dietary_restrictions || ''
            };
          });
          setEventResponses(initialResponses);
        } else {
          toast({
            title: 'Not Found',
            description: 'Invalid RSVP code. Please check and try again.',
            variant: 'destructive'
          });
        }
      });
    }
  };

  const handleSubmit = () => {
    submitMutation.mutate();
  };

  const updateEventResponse = (eventId: number, field: string, value: any) => {
    setEventResponses(prev => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [field]: value
      }
    }));
  };

  if (!guestData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <CardTitle className="text-2xl">Wedding RSVP</CardTitle>
              <CardDescription>Enter your RSVP code to respond</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="rsvpCode">RSVP Code</Label>
                <Input
                  id="rsvpCode"
                  placeholder="Enter your code"
                  value={rsvpCode}
                  onChange={(e) => setRsvpCode(e.target.value.toUpperCase())}
                  className="uppercase"
                />
              </div>
              <Button 
                onClick={handleSearch} 
                className="w-full"
                disabled={isSearching || rsvpCode.length < 4}
              >
                {isSearching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Welcome Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-pink-600" />
            </div>
            <CardTitle className="text-3xl">Welcome, {guestData.name}!</CardTitle>
            <CardDescription className="text-lg">
              {guestData.wedding?.bride_name} & {guestData.wedding?.groom_name}
            </CardDescription>
            {guestData.plus_ones_allowed > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                You are invited with up to {guestData.plus_ones_allowed} guest{guestData.plus_ones_allowed > 1 ? 's' : ''}
              </p>
            )}
          </CardHeader>
        </Card>

        {/* Events */}
        {guestData.invited_events?.map((invite: any) => {
          const event = invite.event;
          const response = eventResponses[event.id] || {};

          return (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {event.name}
                </CardTitle>
                {event.description && (
                  <CardDescription>{event.description}</CardDescription>
                )}
                <div className="flex flex-col gap-2 text-sm text-gray-600 mt-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString()} at {event.start_time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {event.venue}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Will you be attending?</Label>
                  <RadioGroup
                    value={response.status}
                    onValueChange={(value) => updateEventResponse(event.id, 'status', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Attending" id={`attending-${event.id}`} />
                      <Label htmlFor={`attending-${event.id}`}>Yes, I'll be there!</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Not Attending" id={`not-attending-${event.id}`} />
                      <Label htmlFor={`not-attending-${event.id}`}>Sorry, I can't make it</Label>
                    </div>
                  </RadioGroup>
                </div>

                {response.status === 'Attending' && guestData.plus_ones_allowed > 0 && (
                  <div>
                    <Label htmlFor={`plus-ones-${event.id}`}>
                      Number of additional guests (max {guestData.plus_ones_allowed})
                    </Label>
                    <Input
                      id={`plus-ones-${event.id}`}
                      type="number"
                      min="0"
                      max={guestData.plus_ones_allowed}
                      value={response.plus_ones_attending || 0}
                      onChange={(e) => updateEventResponse(event.id, 'plus_ones_attending', parseInt(e.target.value) || 0)}
                    />
                  </div>
                )}

                {response.status === 'Attending' && (
                  <div>
                    <Label htmlFor={`dietary-${event.id}`}>
                      Dietary restrictions or special requests (optional)
                    </Label>
                    <Textarea
                      id={`dietary-${event.id}`}
                      placeholder="Please let us know if you have any dietary restrictions..."
                      value={response.dietary_restrictions || ''}
                      onChange={(e) => updateEventResponse(event.id, 'dietary_restrictions', e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit} 
          className="w-full"
          size="lg"
          disabled={submitMutation.isPending}
        >
          {submitMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {guestData.status === 'Responded' ? 'Update RSVP' : 'Submit RSVP'}
        </Button>

        {guestData.status === 'Responded' && (
          <p className="text-center text-sm text-green-600">
            ✓ You have already responded. You can update your RSVP anytime.
          </p>
        )}
      </div>
    </div>
  );
};

export default GuestRSVP;