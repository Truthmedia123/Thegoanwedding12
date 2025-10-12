import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  Share2,
  Copy
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

export function SocialShare({ url, title, description = '', className = '' }: SocialShareProps) {
  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);
  const shareDescription = encodeURIComponent(description);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`, '_blank');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank');
  };

  const shareToEmail = () => {
    window.open(`mailto:?subject=${shareTitle}&body=${shareDescription}%0A%0A${shareUrl}`, '_blank');
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium">Share:</span>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={shareToFacebook}
        className="hover:bg-blue-100 hover:text-blue-600"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={shareToTwitter}
        className="hover:bg-sky-100 hover:text-sky-600"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={shareToLinkedIn}
        className="hover:bg-blue-50 hover:text-blue-700"
      >
        <Linkedin className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={shareToEmail}
        className="hover:bg-gray-100 hover:text-gray-700"
      >
        <Mail className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleCopyLink}
        className="hover:bg-gray-100 hover:text-gray-700"
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  );
}