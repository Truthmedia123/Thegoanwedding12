import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewsletterSignup from '../NewsletterSignup';

// Mock the useToast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, type }: any) => (
    <button onClick={onClick} disabled={disabled} type={type}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));

describe('NewsletterSignup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders newsletter signup form with all elements', () => {
    render(<NewsletterSignup />);

    expect(screen.getByText('Stay Updated')).toBeInTheDocument();
    expect(screen.getByText('Get the latest wedding planning tips and vendor updates delivered to your inbox.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    expect(screen.getByText('Subscribe')).toBeInTheDocument();
  });

  it('updates email state when user types', () => {
    render(<NewsletterSignup />);

    const input = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    expect(input).toHaveValue('test@example.com');
  });

  it('submits form with valid email', async () => {
    const mockToast = jest.fn();
    const useToastMock = require('@/hooks/use-toast');
    useToastMock.useToast.mockReturnValue({
      toast: mockToast,
    });

    render(<NewsletterSignup />);

    const input = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    const button = screen.getByText('Subscribe');
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Subscribing...');

    // Wait for the async operation to complete
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Subscribed successfully!",
        description: "Thank you for subscribing to our newsletter.",
      });
    });

    // Check that the input is cleared
    expect(input).toHaveValue('');
  });

  it('shows error toast when submission fails', async () => {
    const mockToast = jest.fn();
    const useToastMock = require('@/hooks/use-toast');
    useToastMock.useToast.mockReturnValue({
      toast: mockToast,
    });

    // Mock the promise to reject
    global.setTimeout = jest.fn((callback) => {
      callback();
      throw new Error('Test error');
    }) as any;

    render(<NewsletterSignup />);

    const input = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    const button = screen.getByText('Subscribe');
    fireEvent.click(button);

    // Wait for the async operation to complete
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Subscription failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    });
  });

  it('does not submit form when email is empty', () => {
    render(<NewsletterSignup />);

    const button = screen.getByText('Subscribe');
    fireEvent.click(button);

    expect(button).not.toBeDisabled();
    expect(button).toHaveTextContent('Subscribe');
  });

  it('applies custom className', () => {
    render(<NewsletterSignup className="custom-class" />);

    const container = screen.getByText('Stay Updated').closest('div');
    expect(container).toHaveClass('custom-class');
  });
});