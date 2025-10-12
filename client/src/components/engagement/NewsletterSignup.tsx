import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface NewsletterSignupProps {
  className?: string;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ className = '' }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    try {
      // In a real implementation, you would integrate with Mailchimp, SendGrid, or similar
      // For now, we'll just simulate the submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Subscribed successfully!",
        description: "Thank you for subscribing to our newsletter.",
      });
      
      setEmail('');
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-gradient-to-r from-red-500 to-pink-600 rounded-lg p-6 text-white ${className}`}>
      <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
      <p className="text-red-100 mb-4 text-sm">
        Get the latest wedding planning tips and vendor updates delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-grow bg-white/90 text-gray-800 placeholder-gray-500"
          required
        />
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-white text-red-600 hover:bg-gray-100 font-semibold"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSignup;