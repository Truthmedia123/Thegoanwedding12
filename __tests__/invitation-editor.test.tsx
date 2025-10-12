import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DirectusProvider } from '../client/src/lib/directus';
import { InvitationEditor } from '../client/src/components/InvitationEditor';

// Mock the Directus SDK
jest.mock('../client/src/lib/directus', () => ({
  DirectusProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  getInvitationTemplates: jest.fn(),
  submitBusinessListing: jest.fn()
}));

// Mock Fabric.js
jest.mock('fabric', () => ({
  fabric: {
    Canvas: jest.fn().mockImplementation(() => ({
      dispose: jest.fn(),
      setBackgroundColor: jest.fn(),
      add: jest.fn(),
      remove: jest.fn(),
      getObjects: jest.fn().mockReturnValue([]),
      on: jest.fn(),
      off: jest.fn(),
      renderAll: jest.fn(),
      setDimensions: jest.fn()
    })),
    IText: jest.fn().mockImplementation(() => ({
      set: jest.fn(),
      on: jest.fn()
    })),
    util: {
      loadFont: jest.fn().mockResolvedValue({})
    }
  }
}));

describe('InvitationEditor', () => {
  const mockTemplates = [
    {
      id: 1,
      name: 'Beach Wedding',
      description: 'Beautiful beach-themed invitation',
      preview_image: null,
      template_file: null,
      category: 'beach',
      tags: ['beach', 'wedding'],
      featured: true,
      status: 'published'
    },
    {
      id: 2,
      name: 'Traditional',
      description: 'Traditional Goan invitation',
      preview_image: null,
      template_file: null,
      category: 'traditional',
      tags: ['traditional', 'goan'],
      featured: true,
      status: 'published'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (require('../client/src/lib/directus').getInvitationTemplates as jest.Mock).mockResolvedValue(mockTemplates);
  });

  it('renders without crashing', async () => {
    render(
      <DirectusProvider>
        <InvitationEditor />
      </DirectusProvider>
    );

    expect(screen.getByText('Loading invitation templates...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Select an Invitation Template')).toBeInTheDocument();
    });
  });

  it('displays invitation templates', async () => {
    render(
      <DirectusProvider>
        <InvitationEditor />
      </DirectusProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Beach Wedding')).toBeInTheDocument();
      expect(screen.getByText('Traditional')).toBeInTheDocument();
    });
  });

  it('allows template selection', async () => {
    render(
      <DirectusProvider>
        <InvitationEditor />
      </DirectusProvider>
    );

    await waitFor(() => {
      const templateButton = screen.getByText('Beach Wedding');
      fireEvent.click(templateButton);
      
      expect(screen.getByText('Customize Your Invitation')).toBeInTheDocument();
    });
  });

  it('allows text editing', async () => {
    render(
      <DirectusProvider>
        <InvitationEditor />
      </DirectusProvider>
    );

    await waitFor(() => {
      const templateButton = screen.getByText('Beach Wedding');
      fireEvent.click(templateButton);
    });

    await waitFor(() => {
      const textInput = screen.getByPlaceholderText('Enter your text here');
      fireEvent.change(textInput, { target: { value: 'Test Wedding Invitation' } });
      
      expect(textInput).toHaveValue('Test Wedding Invitation');
    });
  });

  it('allows color selection', async () => {
    render(
      <DirectusProvider>
        <InvitationEditor />
      </DirectusProvider>
    );

    await waitFor(() => {
      const templateButton = screen.getByText('Beach Wedding');
      fireEvent.click(templateButton);
    });

    await waitFor(() => {
      const colorButton = screen.getByLabelText('Text Color');
      fireEvent.click(colorButton);
      
      // We can't easily test the color picker UI, but we can verify it exists
      expect(colorButton).toBeInTheDocument();
    });
  });

  it('allows font selection', async () => {
    render(
      <DirectusProvider>
        <InvitationEditor />
      </DirectusProvider>
    );

    await waitFor(() => {
      const templateButton = screen.getByText('Beach Wedding');
      fireEvent.click(templateButton);
    });

    await waitFor(() => {
      const fontSelect = screen.getByLabelText('Font Family');
      fireEvent.change(fontSelect, { target: { value: 'Arial' } });
      
      expect(fontSelect).toHaveValue('Arial');
    });
  });

  it('allows font size adjustment', async () => {
    render(
      <DirectusProvider>
        <InvitationEditor />
      </DirectusProvider>
    );

    await waitFor(() => {
      const templateButton = screen.getByText('Beach Wedding');
      fireEvent.click(templateButton);
    });

    await waitFor(() => {
      const sizeInput = screen.getByLabelText('Font Size');
      fireEvent.change(sizeInput, { target: { value: '24' } });
      
      expect(sizeInput).toHaveValue('24');
    });
  });

  it('submits the invitation', async () => {
    const mockSubmit = require('../client/src/lib/directus').submitBusinessListing as jest.Mock;
    mockSubmit.mockResolvedValue({ success: true });

    render(
      <DirectusProvider>
        <InvitationEditor />
      </DirectusProvider>
    );

    await waitFor(() => {
      const templateButton = screen.getByText('Beach Wedding');
      fireEvent.click(templateButton);
    });

    await waitFor(() => {
      const submitButton = screen.getByText('Save Invitation');
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalled();
    });
  });
});