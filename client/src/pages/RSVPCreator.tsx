import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Heart, Calendar, MapPin, Plus, X, Copy, Check, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

interface Event {
  name: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  venue: string;
  address: string;
}

const RSVPCreator: React.FC = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    bride_name: '',
    groom_name: '',
    wedding_date: '',
    venue: '',
    venue_address: '',
    ceremony_time: '',
    reception_time: '',
    contact_email: '',
    contact_phone: '',
    story: '',
    custom_message: '',
    theme_color: '#FF6B9D',
    cover_image: ''
  });

  const [events, setEvents] = useState<Event[]>([
    {
      name: 'Wedding Ceremony',
      description: '',
      date: '',
      start_time: '',
      end_time: '',
      venue: '',
      address: ''
    }
  ]);

  const [createdWedding, setCreatedWedding] = useState<any>(null);

  const createWeddingMutation = useMutation({
    mutationFn: async () => {
      try {
        // Generate unique slug
        const slug = `${formData.bride_name.toLowerCase()}-${formData.groom_name.toLowerCase()}-${new Date().getFullYear()}`
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-');

        // Generate admin secret key
        const admin_secret_key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // Convert date to proper timestamp format
        const weddingDateTime = new Date(formData.wedding_date + 'T' + (formData.ceremony_time || '12:00')).toISOString();

        // Create wedding with only the fields we know exist
        const weddingData: any = {
          bride_name: formData.bride_name,
          groom_name: formData.groom_name,
          wedding_date: weddingDateTime,
          venue: formData.venue,
          venue_address: formData.venue_address,
          ceremony_time: formData.ceremony_time || '12:00',
          reception_time: formData.reception_time || '',
          contact_email: formData.contact_email,
          slug,
          is_public: true
        };

        // Add optional fields if they exist in the table
        if (formData.contact_phone) weddingData.contact_phone = formData.contact_phone;
        if (formData.story) weddingData.story = formData.story;
        if (formData.custom_message) weddingData.custom_message = formData.custom_message;
        if (formData.theme_color) weddingData.theme_color = formData.theme_color;
        weddingData.admin_secret_key = admin_secret_key;

        const { data: wedding, error: weddingError } = await supabase
          .from('weddings')
          .insert(weddingData)
          .select()
          .single();

        if (weddingError) {
          console.error('Wedding creation error:', weddingError);
          throw new Error(weddingError.message || 'Failed to create wedding');
        }

        // Create events
        const eventsToInsert = events.map((event, index) => {
          // Convert event date to proper timestamp
          const eventDateTime = new Date(event.date + 'T' + event.start_time).toISOString();
          
          return {
            wedding_id: wedding.id,
            name: event.name,
            description: event.description || '',
            date: eventDateTime,
            start_time: event.start_time,
            end_time: event.end_time || '',
            venue: event.venue,
            address: event.address,
            order_index: index
          };
        });

        const { error: eventsError } = await supabase
          .from('wedding_events')
          .insert(eventsToInsert);

        if (eventsError) {
          console.error('Events creation error:', eventsError);
          throw new Error(eventsError.message || 'Failed to create events');
        }

        return wedding;
      } catch (error) {
        console.error('Mutation error:', error);
        throw error;
      }
    },
    onSuccess: async (wedding) => {
      setCreatedWedding(wedding);
      
      // Generate QR code
      const publicUrl = `${window.location.origin}/wedding/${wedding.slug}`;
      const qrDataUrl = await QRCode.toDataURL(publicUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: formData.theme_color,
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrDataUrl);
      
      setStep(4);
      toast({
        title: 'Success!',
        description: 'Your wedding RSVP page has been created!',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create wedding. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const addEvent = () => {
    setEvents([...events, {
      name: '',
      description: '',
      date: '',
      start_time: '',
      end_time: '',
      venue: '',
      address: ''
    }]);
  };

  const removeEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  const updateEvent = (index: number, field: keyof Event, value: string) => {
    const newEvents = [...events];
    newEvents[index][field] = value;
    setEvents(newEvents);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied!',
      description: 'Link copied to clipboard',
    });
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.download = `${formData.bride_name}-${formData.groom_name}-qr-code.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  // Step 1: Basic Wedding Info
  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-pink-600" />
          Wedding Details
        </CardTitle>
        <CardDescription>Tell us about your special day</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bride_name">Bride's Name *</Label>
            <Input
              id="bride_name"
              value={formData.bride_name}
              onChange={(e) => setFormData({ ...formData, bride_name: e.target.value })}
              placeholder="Maria"
            />
          </div>
          <div>
            <Label htmlFor="groom_name">Groom's Name *</Label>
            <Input
              id="groom_name"
              value={formData.groom_name}
              onChange={(e) => setFormData({ ...formData, groom_name: e.target.value })}
              placeholder="John"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="wedding_date">Wedding Date *</Label>
          <Input
            id="wedding_date"
            type="date"
            value={formData.wedding_date}
            onChange={(e) => setFormData({ ...formData, wedding_date: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="venue">Main Venue *</Label>
          <Input
            id="venue"
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            placeholder="Beach Resort Goa"
          />
        </div>

        <div>
          <Label htmlFor="venue_address">Venue Address *</Label>
          <Textarea
            id="venue_address"
            value={formData.venue_address}
            onChange={(e) => setFormData({ ...formData, venue_address: e.target.value })}
            placeholder="Calangute Beach, North Goa, Goa 403516"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ceremony_time">Ceremony Time</Label>
            <Input
              id="ceremony_time"
              type="time"
              value={formData.ceremony_time}
              onChange={(e) => setFormData({ ...formData, ceremony_time: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="reception_time">Reception Time</Label>
            <Input
              id="reception_time"
              type="time"
              value={formData.reception_time}
              onChange={(e) => setFormData({ ...formData, reception_time: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contact_email">Contact Email *</Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              placeholder="your@email.com"
            />
          </div>
          <div>
            <Label htmlFor="contact_phone">Contact Phone</Label>
            <Input
              id="contact_phone"
              value={formData.contact_phone}
              onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        <Button 
          onClick={() => setStep(2)} 
          className="w-full"
          disabled={!formData.bride_name || !formData.groom_name || !formData.wedding_date || !formData.venue || !formData.venue_address || !formData.contact_email}
        >
          Next: Add Events
        </Button>
      </CardContent>
    </Card>
  );

  // Step 2: Events
  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-pink-600" />
          Wedding Events
        </CardTitle>
        <CardDescription>Add all your wedding events (ceremony, reception, etc.)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {events.map((event, index) => (
          <Card key={index} className="border-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Event {index + 1}</CardTitle>
                {events.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeEvent(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Event Name *</Label>
                <Input
                  value={event.name}
                  onChange={(e) => updateEvent(index, 'name', e.target.value)}
                  placeholder="Wedding Ceremony"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={event.description}
                  onChange={(e) => updateEvent(index, 'description', e.target.value)}
                  placeholder="Join us for our wedding ceremony by the beach"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Date *</Label>
                  <Input
                    type="date"
                    value={event.date}
                    onChange={(e) => updateEvent(index, 'date', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Start Time *</Label>
                  <Input
                    type="time"
                    value={event.start_time}
                    onChange={(e) => updateEvent(index, 'start_time', e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={event.end_time}
                    onChange={(e) => updateEvent(index, 'end_time', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label>Venue *</Label>
                <Input
                  value={event.venue}
                  onChange={(e) => updateEvent(index, 'venue', e.target.value)}
                  placeholder="Beach Resort Goa"
                />
              </div>
              <div>
                <Label>Address *</Label>
                <Textarea
                  value={event.address}
                  onChange={(e) => updateEvent(index, 'address', e.target.value)}
                  placeholder="Calangute Beach, North Goa"
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button variant="outline" onClick={addEvent} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Another Event
        </Button>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
            Back
          </Button>
          <Button 
            onClick={() => setStep(3)} 
            className="flex-1"
            disabled={events.some(e => !e.name || !e.date || !e.start_time || !e.venue || !e.address)}
          >
            Next: Customize
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Step 3: Customization
  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Customize Your Page</CardTitle>
        <CardDescription>Add a personal touch to your wedding page</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="story">Your Love Story (Optional)</Label>
          <Textarea
            id="story"
            value={formData.story}
            onChange={(e) => setFormData({ ...formData, story: e.target.value })}
            placeholder="Tell your guests how you met..."
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="custom_message">Custom Message for Guests (Optional)</Label>
          <Textarea
            id="custom_message"
            value={formData.custom_message}
            onChange={(e) => setFormData({ ...formData, custom_message: e.target.value })}
            placeholder="We can't wait to celebrate with you!"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="theme_color">Theme Color</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="theme_color"
              type="color"
              value={formData.theme_color}
              onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })}
              className="w-20 h-10"
            />
            <span className="text-sm text-gray-600">{formData.theme_color}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
            Back
          </Button>
          <Button 
            onClick={() => createWeddingMutation.mutate()} 
            className="flex-1"
            disabled={createWeddingMutation.isPending}
          >
            {createWeddingMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create My Wedding Page
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // Step 4: Success - Show Links
  const renderStep4 = () => {
    const publicUrl = `${window.location.origin}/wedding/${createdWedding.slug}`;
    const adminUrl = `${window.location.origin}/wedding/${createdWedding.slug}/admin?key=${createdWedding.admin_secret_key}`;

    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">🎉 Your Wedding Page is Ready!</CardTitle>
          <CardDescription>Save these links - you'll need them!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Public Link */}
          <div className="space-y-2">
            <Label className="text-lg font-semibold">📱 Guest Link (Share with guests)</Label>
            <div className="flex gap-2">
              <Input value={publicUrl} readOnly className="font-mono text-sm" />
              <Button onClick={() => copyToClipboard(publicUrl)} size="sm">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-sm text-gray-600">Share this link with your guests or print the QR code below</p>
          </div>

          {/* QR Code */}
          <div className="space-y-2">
            <Label className="text-lg font-semibold">QR Code for Invitations</Label>
            <div className="flex flex-col items-center gap-4 p-4 bg-gray-50 rounded-lg">
              {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />}
              <Button onClick={downloadQRCode} variant="outline">
                <QrCode className="w-4 h-4 mr-2" />
                Download QR Code
              </Button>
            </div>
          </div>

          {/* Admin Link */}
          <div className="space-y-2 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
            <Label className="text-lg font-semibold text-yellow-800">🔐 Admin Link (Keep this secret!)</Label>
            <div className="flex gap-2">
              <Input value={adminUrl} readOnly className="font-mono text-sm" />
              <Button onClick={() => copyToClipboard(adminUrl)} size="sm">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Important:</strong> Bookmark this link! Use it to view RSVPs and manage your guest list. Don't share this with guests.
            </p>
          </div>

          {/* Email Confirmation */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              📧 We've sent both links to <strong>{formData.contact_email}</strong>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button onClick={() => window.open(publicUrl, '_blank')} variant="outline" className="flex-1">
              View Guest Page
            </Button>
            <Button onClick={() => window.open(adminUrl, '_blank')} className="flex-1">
              Go to Admin Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Wedding RSVP</h1>
          <p className="text-gray-600">Set up your beautiful wedding page in minutes</p>
        </div>

        {/* Progress Steps */}
        {step < 4 && (
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    s === step ? 'bg-pink-600 text-white' : s < step ? 'bg-green-500 text-white' : 'bg-gray-200'
                  }`}>
                    {s < step ? <Check className="w-4 h-4" /> : s}
                  </div>
                  {s < 3 && <div className={`w-12 h-1 ${s < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Form Steps */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>
    </div>
  );
};

export default RSVPCreator;