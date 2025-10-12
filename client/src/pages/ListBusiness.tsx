import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function ListBusiness() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    message: ""
  });
  const { toast } = useToast();

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          subject: `Business Inquiry from ${data.name}`,
          message: `Business: ${data.business}\n\nMessage: ${data.message}`
        }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Message sent successfully!" });
      setFormData({ name: "", email: "", phone: "", business: "", message: "" });
    },
    onError: () => {
      toast({ title: "Failed to send message", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Partner with <span style={{ color: "var(--goan-coral)" }}>TheGoan</span><span style={{ color: "var(--goan-sea-blue)" }}>Wedding</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Interested in featuring your business on Goa's premier wedding platform? 
            Join hundreds of trusted vendors and get in touch with us to discuss 
            exclusive partnership opportunities that will grow your business.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-2xl border-0">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Get In Touch</CardTitle>
              <p className="text-center text-gray-600">We'd love to hear from you</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="business">Business Name</Label>
                    <Input
                      id="business"
                      value={formData.business}
                      onChange={(e) => setFormData({...formData, business: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us about your business and how we can work together..."
                    rows={5}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={contactMutation.isPending}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                >
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Information */}
          <div className="space-y-8">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-red-600">Why Partner With Us?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-users text-red-600"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold">Reach Your Target Audience</h3>
                    <p className="text-gray-600 text-sm">Connect with couples planning their dream Goan wedding</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-star text-blue-600"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold">Premium Positioning</h3>
                    <p className="text-gray-600 text-sm">Showcase your business alongside Goa's finest wedding professionals</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-chart-line text-green-600"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold">Grow Your Business</h3>
                    <p className="text-gray-600 text-sm">Increase bookings and build your reputation in the wedding industry</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-blue-600">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <i className="fas fa-envelope text-red-500"></i>
                  <span>info@thegoanwedding.com</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}