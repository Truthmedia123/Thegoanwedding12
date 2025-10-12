import React, { useEffect, useRef } from 'react';

interface AdsenseBannerProps {
  client: string;
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical' | 'responsive';
  className?: string;
  style?: React.CSSProperties;
  responsive?: boolean;
}

export function AdsenseBanner({
  client,
  slot,
  format = 'auto',
  className = '',
  style = {},
  responsive = true
}: AdsenseBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const adKey = `${client}-${slot}-${format}`;

  useEffect(() => {
    // Check if adsense script is already loaded
    const adsenseScript = document.querySelector(
      `script[src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]`
    );

    // If not loaded, load it
    if (!adsenseScript) {
      const script = document.createElement('script');
      script.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Push ad to adsense
    try {
      if (typeof (window as any).adsbygoogle !== 'undefined') {
        (window as any).adsbygoogle.push({});
      }
    } catch (err) {
      console.error('Adsense error:', err);
    }
  }, [adKey]);

  // Determine ad format class
  const getFormatClass = () => {
    switch (format) {
      case 'rectangle':
        return 'adslot-rectangle';
      case 'horizontal':
        return 'adslot-horizontal';
      case 'vertical':
        return 'adslot-vertical';
      case 'responsive':
        return 'adslot-responsive';
      default:
        return 'adslot-auto';
    }
  };

  return (
    <div 
      ref={adRef}
      className={`ad-container ${className} ${responsive ? 'overflow-hidden' : ''}`}
      style={style}
    >
      <ins
        className={`adsbygoogle ${getFormatClass()}`}
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}