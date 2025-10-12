import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const contactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onSuccess: () => {
      toast({ 
        title: "Message sent successfully!", 
        description: "We'll get back to you within 24 hours." 
      });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    },
    onError: () => {
      toast({ 
        title: "Failed to send message", 
        description: "Please try again later.",
        variant: "destructive" 
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleEmail = () => {
    window.location.href = "mailto:info@thegoanwedding.com?subject=Inquiry from TheGoanWedding.com";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-red-500 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get in Touch
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            We're here to help you plan the perfect Goan wedding. Reach out to us anytime!
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={6}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={contactMutation.isPending}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg"
                  >
                    {contactMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-red-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-envelope text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Email</h3>
                    <p className="text-gray-600">info@thegoanwedding.com</p>
                  </div>
                </div>


                <div className="flex items-start gap-4">
                  <div className="bg-teal-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-map-marker-alt text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Location</h3>
                    <p className="text-gray-600">Goa, India</p>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <h3 className="font-semibold text-slate-800 mb-4">Quick Contact</h3>
                  <div className="space-y-3">
                    <Button 
                      onClick={handleEmail}
                      className="w-full bg-red-500 hover:bg-red-600 text-white"
                    >
                      <i className="fas fa-envelope mr-2"></i>Email Us
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 7:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium">10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium">11:00 AM - 4:00 PM</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <i className="fas fa-info-circle mr-2"></i>
                    We're available 24/7 via email for urgent wedding planning needs!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">How do I list my business?</h4>
                    <p className="text-sm text-gray-600">
                      Visit our "List Your Business" page and fill out the comprehensive form. We'll review and approve your listing within 2-3 business days.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Is there a fee for vendors?</h4>
                    <p className="text-sm text-gray-600">
                      Basic listings are free. We offer premium listing options with enhanced visibility and features for a nominal fee.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">How can I book vendors?</h4>
                    <p className="text-sm text-gray-600">
                      You can contact vendors directly through email or contact forms. All contact information is provided on vendor profiles.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section (Placeholder) */}
        <section className="mt-16">
          <Card className="shadow-xl">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-teal-100 to-red-100 h-96 flex items-center justify-center">
                <div className="text-center">
                  <i className="fas fa-map-marker-alt text-6xl text-red-500 mb-4"></i>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">We're Located in Goa</h3>
                  <p className="text-gray-600">Serving couples across North and South Goa</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
