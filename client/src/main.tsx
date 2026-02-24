import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Hotjar Integration
import hotjar from '@hotjar/browser';

// Initialize Hotjar with your site ID and version
// Replace YOUR_HOTJAR_ID with your actual Hotjar site ID
const HOTJAR_ID = process.env.HOTJAR_ID ? parseInt(process.env.HOTJAR_ID) : 0;
if (HOTJAR_ID) {
  hotjar.init(HOTJAR_ID, 6);
}

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
        
        // Check for updates
        registration.update();
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New update available
                console.log('New content is available; please refresh.');
                // Optionally show a notification to the user
                showUpdateNotification();
              }
            });
          }
        });
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Show update notification to user
function showUpdateNotification() {
  if (confirm('A new version of the app is available. Would you like to refresh to update?')) {
    window.location.reload();
  }
}

// Handle before install prompt for PWA installation
let deferredPrompt: any;
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Update UI to notify the user they can install the PWA
  showInstallPromotion();
});

function showInstallPromotion() {
  // Show install button or banner
  const installBtn = document.getElementById('install-pwa');
  if (installBtn) {
    installBtn.style.display = 'block';
    installBtn.addEventListener('click', installPWA);
  }
}

function installPWA() {
  // Hide the install button
  const installBtn = document.getElementById('install-pwa');
  if (installBtn) {
    installBtn.style.display = 'none';
  }
  
  // Show the install prompt
  if (deferredPrompt) {
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        // User accepted the install prompt
      } else {
        // User dismissed the install prompt
      }
      deferredPrompt = null;
    });
  }
}

// Handle app installed event
window.addEventListener('appinstalled', () => {
  // PWA was installed
  console.log('PWA was installed');
  // Hide install promotion
  const installBtn = document.getElementById('install-pwa');
  if (installBtn) {
    installBtn.style.display = 'none';
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);