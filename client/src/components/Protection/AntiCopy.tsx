import React, { useEffect, useRef } from 'react';

interface AntiCopyProps {
  children: React.ReactNode;
  disableRightClick?: boolean;
  disableTextSelection?: boolean;
  disableDevTools?: boolean;
  disablePrintScreen?: boolean;
  showWarning?: boolean;
}

export const AntiCopy: React.FC<AntiCopyProps> = ({
  children,
  disableRightClick = true,
  disableTextSelection = true,
  disableDevTools = true,
  disablePrintScreen = true,
  showWarning = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      if (disableRightClick) {
        e.preventDefault();
        if (showWarning) {
          showProtectionWarning('Right-click is disabled');
        }
      }
    };

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      if (disableTextSelection) {
        e.preventDefault();
      }
    };

    // Disable drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // Disable copy shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+S, Ctrl+P
      if (e.ctrlKey && ['a', 'c', 'v', 'x', 's', 'p'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        if (showWarning) {
          showProtectionWarning('Copy/paste is disabled');
        }
      }

      // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['i', 'j'].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.key.toLowerCase() === 'u')
      ) {
        if (disableDevTools) {
          e.preventDefault();
          if (showWarning) {
            showProtectionWarning('Developer tools are disabled');
          }
        }
      }

      // Disable Print Screen
      if (e.key === 'PrintScreen' && disablePrintScreen) {
        e.preventDefault();
        if (showWarning) {
          showProtectionWarning('Screenshots are disabled');
        }
      }
    };

    // Disable developer tools detection
    const detectDevTools = () => {
      if (!disableDevTools) return;

      const threshold = 160;
      const checkDevTools = () => {
        if (
          window.outerHeight - window.innerHeight > threshold ||
          window.outerWidth - window.innerWidth > threshold
        ) {
          if (showWarning) {
            showProtectionWarning('Developer tools detected');
          }
          // Optionally redirect or take other action
        }
      };

      setInterval(checkDevTools, 500);
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);

    // Start dev tools detection
    detectDevTools();

    // Disable text selection via CSS
    if (disableTextSelection && containerRef.current) {
      containerRef.current.style.userSelect = 'none';
      containerRef.current.style.webkitUserSelect = 'none';
      containerRef.current.style.mozUserSelect = 'none';
      containerRef.current.style.msUserSelect = 'none';
    }

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [disableRightClick, disableTextSelection, disableDevTools, disablePrintScreen, showWarning]);

  const showProtectionWarning = (message: string) => {
    // Create a temporary warning element
    const warning = document.createElement('div');
    warning.textContent = message;
    warning.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      font-size: 14px;
    `;
    
    document.body.appendChild(warning);
    
    setTimeout(() => {
      document.body.removeChild(warning);
    }, 2000);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      {children}
    </div>
  );
};

// Hook for additional protection features
export const useProtection = () => {
  const disableImageSaving = () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('dragstart', (e) => e.preventDefault());
      img.style.pointerEvents = 'none';
    });
  };

  const addWatermark = (text: string) => {
    const watermark = document.createElement('div');
    watermark.textContent = text;
    watermark.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      background: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(0, 0, 0, 0.1) 10px,
        rgba(0, 0, 0, 0.1) 20px
      );
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: rgba(0, 0, 0, 0.3);
      font-weight: bold;
    `;
    
    document.body.appendChild(watermark);
  };

  const obfuscateText = (element: HTMLElement) => {
    const originalText = element.textContent || '';
    const obfuscatedText = originalText.replace(/[a-zA-Z]/g, '*');
    element.textContent = obfuscatedText;
    
    // Restore on hover
    element.addEventListener('mouseenter', () => {
      element.textContent = originalText;
    });
    
    element.addEventListener('mouseleave', () => {
      element.textContent = obfuscatedText;
    });
  };

  return {
    disableImageSaving,
    addWatermark,
    obfuscateText,
  };
};








