import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InstallPrompt } from '../InstallPrompt';

// Mock the beforeinstallprompt event
const mockPrompt = jest.fn();
const mockUserChoice = Promise.resolve({ outcome: 'accepted' });

const mockBeforeInstallPromptEvent = {
  preventDefault: jest.fn(),
  prompt: mockPrompt,
  userChoice: mockUserChoice,
};

describe('InstallPrompt', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  it('renders nothing when no install prompt is available', () => {
    render(<InstallPrompt />);
    expect(screen.queryByText('Install App')).not.toBeInTheDocument();
  });

  it('shows install prompt when beforeinstallprompt event is fired', async () => {
    render(<InstallPrompt />);
    
    // Simulate the beforeinstallprompt event
    const event = new Event('beforeinstallprompt');
    Object.assign(event, mockBeforeInstallPromptEvent);
    window.dispatchEvent(event);
    
    await waitFor(() => {
      expect(screen.getByText('Install App')).toBeInTheDocument();
    });
  });

  it('calls prompt when install button is clicked', async () => {
    render(<InstallPrompt />);
    
    // Simulate the beforeinstallprompt event
    const event = new Event('beforeinstallprompt');
    Object.assign(event, mockBeforeInstallPromptEvent);
    window.dispatchEvent(event);
    
    await waitFor(() => {
      expect(screen.getByText('Install App')).toBeInTheDocument();
    });
    
    const installButton = screen.getByText('Install');
    fireEvent.click(installButton);
    
    expect(mockPrompt).toHaveBeenCalled();
  });

  it('dismisses prompt when later button is clicked', async () => {
    render(<InstallPrompt />);
    
    // Simulate the beforeinstallprompt event
    const event = new Event('beforeinstallprompt');
    Object.assign(event, mockBeforeInstallPromptEvent);
    window.dispatchEvent(event);
    
    await waitFor(() => {
      expect(screen.getByText('Install App')).toBeInTheDocument();
    });
    
    const laterButton = screen.getByText('Later');
    fireEvent.click(laterButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Install App')).not.toBeInTheDocument();
    });
    
    expect(window.localStorage.setItem).toHaveBeenCalledWith('installPromptDismissed', 'true');
  });

  it('dismisses prompt when X button is clicked', async () => {
    render(<InstallPrompt />);
    
    // Simulate the beforeinstallprompt event
    const event = new Event('beforeinstallprompt');
    Object.assign(event, mockBeforeInstallPromptEvent);
    window.dispatchEvent(event);
    
    await waitFor(() => {
      expect(screen.getByText('Install App')).toBeInTheDocument();
    });
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Install App')).not.toBeInTheDocument();
    });
  });
});