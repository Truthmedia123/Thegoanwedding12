import { useState, useEffect } from 'react';

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  hasUpdate: boolean;
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: navigator.onLine,
    hasUpdate: false,
  });

  useEffect(() => {
    // Check if app is installed
    const checkInstalled = () => {
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone === true;
      setPwaState(prev => ({ ...prev, isInstalled }));
    };

    // Check online status
    const handleOnline = () => setPwaState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setPwaState(prev => ({ ...prev, isOnline: false }));

    // Check for updates
    const checkForUpdates = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          setPwaState(prev => ({ ...prev, hasUpdate: true }));
        });
      }
    };

    checkInstalled();
    checkForUpdates();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };

  return {
    ...pwaState,
    installApp,
  };
};