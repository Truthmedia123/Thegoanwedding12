import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export type AnalyticsEvent = 
  | 'view' 
  | 'contact_click' 
  | 'gallery_open' 
  | 'review_submit' 
  | 'invitation_send';

interface AnalyticsData {
  vendor_id: number;
  event_type: AnalyticsEvent;
  user_id?: string;
  session_id?: string;
  metadata?: Record<string, any>;
}

export const useAnalytics = () => {
  const trackEvent = useCallback(async (data: AnalyticsData) => {
    try {
      // Get or create session ID
      let sessionId = sessionStorage.getItem('analytics_session_id');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('analytics_session_id', sessionId);
      }

      // Get current user
      const { data: { user } } } = await supabase.auth.getUser();

      // Track the event
      const { error } = await supabase
        .from('vendor_analytics')
        .insert([{
          vendor_id: data.vendor_id,
          event_type: data.event_type,
          user_id: user?.id || null,
          session_id: sessionId,
          metadata: data.metadata || null,
        }]);

      if (error) {
        console.error('Analytics tracking error:', error);
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }, []);

  const trackVendorView = useCallback((vendorId: number) => {
    trackEvent({
      vendor_id: vendorId,
      event_type: 'view',
    });
  }, [trackEvent]);

  const trackContactClick = useCallback((vendorId: number, contactMethod: string) => {
    trackEvent({
      vendor_id: vendorId,
      event_type: 'contact_click',
      metadata: { contact_method: contactMethod },
    });
  }, [trackEvent]);

  const trackGalleryOpen = useCallback((vendorId: number, imageIndex: number) => {
    trackEvent({
      vendor_id: vendorId,
      event_type: 'gallery_open',
      metadata: { image_index: imageIndex },
    });
  }, [trackEvent]);

  const trackReviewSubmit = useCallback((vendorId: number, rating: number) => {
    trackEvent({
      vendor_id: vendorId,
      event_type: 'review_submit',
      metadata: { rating },
    });
  }, [trackEvent]);

  const trackInvitationSend = useCallback((vendorId: number, invitationData: any) => {
    trackEvent({
      vendor_id: vendorId,
      event_type: 'invitation_send',
      metadata: invitationData,
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackVendorView,
    trackContactClick,
    trackGalleryOpen,
    trackReviewSubmit,
    trackInvitationSend,
  };
};
