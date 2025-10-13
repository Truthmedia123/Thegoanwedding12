import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Heart, Copy, Check, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

const RSVPCreator: React.FC = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [createdWedding, setCreatedWedding] = useState<any>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    bride_name: '',
    groom_name: '',
    wedding_date: '',
    nuptial_venue: '',
    nuptial_address: '',
    nuptial_time: '',
    reception_venue: '',
    reception_address: '',
    reception_time: '',
    contact_email: '',
    contact_phone: '',
    custom_message: '',
    theme_color: '#FF6B9D'
  });

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
        const weddingDateTime = new Date(formData.wedding_date + 'T' + (formData.nuptial_time || '12:00')).toISOString();

        // Create wedding
        const weddingData: any = {
          bride_name: formData.bride_name,
          groom_name: formData.groom_name,
          wedding_date: weddingDateTime,
          venue: formData.nuptial_venue,
          venue_address: formData.nuptial_address,
          ceremony_time: formData.nuptial_time || '12:00',
          reception_time: formData.reception_time || '',
          contact_email: formData.contact_email,
          slug,
          is_public: true,
          admin_secret_key: admin_secret_key
        };

        // Add optional fields
        if (formData.contact_phone) weddingData.contact_phone = formData.contact_phone;
        if (formData.custom_message) weddingData.custom_message = formData.custom_message;
        if (formData.theme_color) weddingData.theme_color = formData.theme_color;

        const { data: wedding, error: weddingError } = await supabase
          .from('weddings')
          .insert(weddingData)
          .select()
          .single();

        if (weddingError) {
          console.error('Wedding creation error:', weddingError);
          throw new Error(weddingError.message || 'Failed to create wedding');
        }

        // Create events (Nuptial and Reception)
        const eventsToInsert = [];
        
        // Nuptial event
        if (formData.nuptial_venue && formData.nuptial_time) {
          const nuptialDateTime = new Date(formData.wedding_date + 'T' + formData.nuptial_time).toISOString();
          eventsToInsert.push({
            wedding_id: wedding.id,
            name: 'Nuptial Ceremony',
            description: '',
            date: nuptialDateTime,
            start_time: formData.nuptial_time,
            end_time: '',
            venue: formData.nuptial_venue,
            address: formData.nuptial_address,
            order_index: 0
          });
        }
        
        // Reception event
        if (formData.reception_venue && formData.reception_time) {
          const receptionDateTime = new Date(formData.wedding_date + 'T' + formData.reception_time).toISOString();
          eventsToInsert.push({
            wedding_id: wedding.id,
            name: 'Reception',
            description: '',
            date: receptionDateTime,
            start_time: formData.reception_time,
            end_time: '',
            venue: formData.reception_venue,
            address: formData.reception_address,
            order_index: 1
          });
        }

        if (eventsToInsert.length > 0) {
          const { error: eventsError } = await supabase
            .from('wedding_events')
            .insert(eventsToInsert);

          if (eventsError) {
            console.error('Events creation error:', eventsError);
            throw new Error(eventsError.message || 'Failed to create events');
          }
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

  // If wedding is created, show success page
  if (createdWedding) {
    const publicUrl = `${window.location.origin}/wedding/${createdWedding.slug}`;
    const adminUrl = `${window.location.origin}/wedding/${createdWedding.slug}/admin?key=${createdWedding.admin_secret_key}`;

    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
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
                  ⚠️ <strong>Important:</strong> Bookmark this link! Use it to view RSVPs and manage your guest list.
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
        </div>
      </div>
    );
  }

  // Main form
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Your Wedding RSVP</h1>
          <p className="text-gray-600">Fill in all details in one simple form</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-pink-600" />
              Wedding Details
            </CardTitle>
            <CardDescription>All fields marked with * are required</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bride & Groom Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bride_name">Bride Name *</Label>
                <Input
                  id="bride_name"
                  value={formData.bride_name}
                  onChange={(e) => setFormData({ ...formData, bride_name: e.target.value })}
                  placeholder="Maria"
                />
              </div>
              <div>
                <Label htmlFor="groom_name">Groom Name *</Label>
                <Input
                  id="groom_name"
                  value={formData.groom_name}
                  onChange={(e) => setFormData({ ...formData, groom_name: e.target.value })}
                  placeholder="John"
                />
              </div>
            </div>

            {/* Wedding Date */}
            <div>
              <Label htmlFor="wedding_date">Wedding Date *</Label>
              <Input
                id="wedding_date"
                type="date"
                value={formData.wedding_date}
                onChange={(e) => setFormData({ ...formData, wedding_date: e.target.value })}
              />
            </div>

            {/* Nuptial Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Nuptial Ceremony</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nuptial_venue">Venue *</Label>
                  <Input
                    id="nuptial_venue"
                    value={formData.nuptial_venue}
                    onChange={(e) => setFormData({ ...formData, nuptial_venue: e.target.value })}
                    placeholder="St. Francis Church"
                  />
                </div>
                <div>
                  <Label htmlFor="nuptial_address">Address *</Label>
                  <Textarea
                    id="nuptial_address"
                    value={formData.nuptial_address}
                    onChange={(e) => setFormData({ ...formData, nuptial_address: e.target.value })}
                    placeholder="Old Goa, Goa 403402"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="nuptial_time">Time *</Label>
                  <Input
                    id="nuptial_time"
                    type="time"
                    value={formData.nuptial_time}
                    onChange={(e) => setFormData({ ...formData, nuptial_time: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Reception Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Reception</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reception_venue">Venue</Label>
                  <Input
                    id="reception_venue"
                    value={formData.reception_venue}
                    onChange={(e) => setFormData({ ...formData, reception_venue: e.target.value })}
                    placeholder="Beach Resort Goa"
                  />
                </div>
                <div>
                  <Label htmlFor="reception_address">Address</Label>
                  <Textarea
                    id="reception_address"
                    value={formData.reception_address}
                    onChange={(e) => setFormData({ ...formData, reception_address: e.target.value })}
                    placeholder="Calangute Beach, North Goa"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="reception_time">Time</Label>
                  <Input
                    id="reception_time"
                    type="time"
                    value={formData.reception_time}
                    onChange={(e) => setFormData({ ...formData, reception_time: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor="contact_phone">Contact/WhatsApp Phone</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Custom Message */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Personalization</h3>
              <div>
                <Label htmlFor="custom_message">Custom Message for Guests</Label>
                <Textarea
                  id="custom_message"
                  value={formData.custom_message}
                  onChange={(e) => setFormData({ ...formData, custom_message: e.target.value })}
                  placeholder="We can't wait to celebrate with you!"
                  rows={3}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              onClick={() => createWeddingMutation.mutate()} 
              className="w-full"
              size="lg"
              disabled={
                createWeddingMutation.isPending ||
                !formData.bride_name || 
                !formData.groom_name || 
                !formData.wedding_date || 
                !formData.nuptial_venue || 
                !formData.nuptial_address || 
                !formData.nuptial_time ||
                !formData.contact_email
              }
            >
              {createWeddingMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create My Wedding Page
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RSVPCreator;
