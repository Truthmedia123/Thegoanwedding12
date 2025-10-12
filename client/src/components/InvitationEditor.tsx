import React, { useState, useRef, useEffect } from 'react';
// Use dynamic import for Fabric.js to avoid build issues
import { businessSubmissionService } from '../lib/supabase-service';

// Define fabric types
declare global {
  interface Window {
    fabric: any;
  }
}

interface TextElement {
  id: string;
  text: string;
  left: number;
  top: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  editable: boolean;
}

const InvitationEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<any>(null);
  const [templates, setTemplates] = useState<InvitationTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<InvitationTemplate | null>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedTextElement, setSelectedTextElement] = useState<TextElement | null>(null);
  const [newText, setNewText] = useState('');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontSize, setFontSize] = useState(20);
  const [textColor, setTextColor] = useState('#000000');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fabricLoaded, setFabricLoaded] = useState(false);

  // Load Fabric.js dynamically
  useEffect(() => {
    const loadFabric = async () => {
      try {
        // Dynamically import fabric
        const fabricModule = await import('fabric');
        window.fabric = fabricModule;
        setFabricLoaded(true);
      } catch (err) {
        console.error('Error loading Fabric.js:', err);
        setError('Failed to load invitation editor');
      }
    };

    loadFabric();
  }, []);

  // Load templates from Directus
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templateData = await getInvitationTemplates();
        setTemplates(templateData);
        setLoading(false);
        setError(null);
      } catch (error: any) {
        console.error('Error loading templates:', error);
        setError(error.message || 'Failed to load invitation templates');
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (canvasRef.current && fabricLoaded && window.fabric) {
      try {
        fabricCanvasRef.current = new window.fabric.Canvas(canvasRef.current, {
          width: 800,
          height: 600,
          backgroundColor: '#ffffff',
        });

        // Handle object selection
        fabricCanvasRef.current.on('selection:created', (e: any) => {
          const activeObject = e.selected?.[0];
          if (activeObject && activeObject.type === 'text') {
            const textObj = activeObject;
            setSelectedTextElement({
              id: textObj.id || Date.now().toString(),
              text: textObj.text || '',
              left: textObj.left || 0,
              top: textObj.top || 0,
              fontSize: textObj.fontSize || 20,
              fontFamily: textObj.fontFamily || 'Arial',
              fill: textObj.fill || '#000000',
              editable: true,
            });
            setNewText(textObj.text || '');
            setFontFamily(textObj.fontFamily || 'Arial');
            setFontSize(textObj.fontSize || 20);
            setTextColor(textObj.fill || '#000000');
          }
        });

        fabricCanvasRef.current.on('selection:updated', (e: any) => {
          const activeObject = e.selected?.[0];
          if (activeObject && activeObject.type === 'text') {
            const textObj = activeObject;
            setSelectedTextElement({
              id: textObj.id || Date.now().toString(),
              text: textObj.text || '',
              left: textObj.left || 0,
              top: textObj.top || 0,
              fontSize: textObj.fontSize || 20,
              fontFamily: textObj.fontFamily || 'Arial',
              fill: textObj.fill || '#000000',
              editable: true,
            });
            setNewText(textObj.text || '');
            setFontFamily(textObj.fontFamily || 'Arial');
            setFontSize(textObj.fontSize || 20);
            setTextColor(textObj.fill || '#000000');
          }
        });

        fabricCanvasRef.current.on('selection:cleared', () => {
          setSelectedTextElement(null);
        });
      } catch (error: any) {
        console.error('Error initializing canvas:', error);
        setError(error.message || 'Failed to initialize the invitation editor');
      }
    }

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
    };
  }, [fabricLoaded]);

  // Load selected template
  const loadTemplate = (template: InvitationTemplate) => {
    try {
      setSelectedTemplate(template);
      
      if (fabricCanvasRef.current && fabricLoaded && window.fabric) {
        // Clear canvas
        fabricCanvasRef.current.clear();
        
        // Set background if template has preview image
        if (template.preview_image) {
          window.fabric.Image.fromURL(template.preview_image, (img: any) => {
            if (fabricCanvasRef.current && img.width && img.height) {
              img.set({
                left: 0,
                top: 0,
                scaleX: fabricCanvasRef.current.width! / img.width,
                scaleY: fabricCanvasRef.current.height! / img.height,
                selectable: false,
                evented: false,
              });
              fabricCanvasRef.current.add(img);
              fabricCanvasRef.current.renderAll();
            }
          });
        }
        
        // Reset text elements
        setTextElements([]);
        setSelectedTextElement(null);
      }
    } catch (error: any) {
      console.error('Error loading template:', error);
      setError(error.message || 'Failed to load the selected template');
    }
  };

  // Add text to canvas
  const addTextToCanvas = () => {
    try {
      if (!fabricCanvasRef.current || !newText || !fabricLoaded || !window.fabric) return;

      const text = new window.fabric.Text(newText, {
        left: 100,
        top: 100,
        fontSize,
        fontFamily,
        fill: textColor,
        selectable: true,
        editable: true,
      });

      fabricCanvasRef.current.add(text);
      fabricCanvasRef.current.setActiveObject(text);
      fabricCanvasRef.current.renderAll();

      const newTextElement: TextElement = {
        id: text.id || Date.now().toString(),
        text: newText,
        left: 100,
        top: 100,
        fontSize,
        fontFamily,
        fill: textColor,
        editable: true,
      };

      setTextElements([...textElements, newTextElement]);
      setSelectedTextElement(newTextElement);
    } catch (error: any) {
      console.error('Error adding text:', error);
      setError(error.message || 'Failed to add text to the invitation');
    }
  };

  // Update selected text
  const updateSelectedText = () => {
    try {
      if (!fabricCanvasRef.current || !selectedTextElement || !newText) return;

      const activeObject = fabricCanvasRef.current.getActiveObject();
      if (activeObject && activeObject.type === 'text') {
        const textObj = activeObject;
        textObj.set({
          text: newText,
          fontSize,
          fontFamily,
          fill: textColor,
        });
        fabricCanvasRef.current.renderAll();

        // Update state
        const updatedElements = textElements.map(el => 
          el.id === selectedTextElement.id 
            ? { ...el, text: newText, fontSize, fontFamily, fill: textColor } 
            : el
        );
        setTextElements(updatedElements);
        setSelectedTextElement({ ...selectedTextElement, text: newText, fontSize, fontFamily, fill: textColor });
      }
    } catch (error: any) {
      console.error('Error updating text:', error);
      setError(error.message || 'Failed to update the selected text');
    }
  };

  // Save invitation
  const saveInvitation = async () => {
    if (!fabricCanvasRef.current) return;

    try {
      // Get canvas data as JSON
      const canvasData = fabricCanvasRef.current.toJSON();
      
      // Convert to data URL for preview
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: 'png',
        quality: 0.8,
        multiplier: 1
      });

      // Add Umami tracking for invitation sent
      if (typeof window !== 'undefined' && (window as any).umami) {
        (window as any).umami('invitation_sent', { 
          template_id: selectedTemplate?.id,
          template_name: selectedTemplate?.name
        });
      }

      // In a real implementation, you would save this to Directus
      alert('Invitation saved successfully!');
      console.log('Canvas data:', canvasData);
      console.log('Data URL:', dataURL);
      setError(null);
    } catch (error: any) {
      console.error('Error saving invitation:', error);
      setError(error.message || 'Failed to save the invitation');
    }
  };

  if (loading || !fabricLoaded) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">{loading ? 'Loading templates...' : 'Loading editor...'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Wedding Invitation Editor</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Template Selection */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-2">Templates</h2>
          <div className="grid grid-cols-2 gap-2">
            {templates.map((template) => (
              <div 
                key={template.id} 
                className={`border rounded-lg p-2 cursor-pointer hover:shadow-md transition-shadow ${
                  selectedTemplate?.id === template.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => loadTemplate(template)}
              >
                {template.preview_image ? (
                  <img 
                    src={template.preview_image} 
                    alt={template.name} 
                    className="w-full h-32 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500">No preview</span>
                  </div>
                )}
                <p className="text-sm font-medium mt-2 truncate">{template.name}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Canvas Area */}
        <div className="lg:col-span-2">
          <div className="border rounded-lg p-4 bg-gray-50 flex justify-center">
            <canvas ref={canvasRef} className="border bg-white shadow-sm rounded" />
          </div>
          
          {/* Text Controls */}
          <div className="mt-4 bg-white border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Text Controls</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Text Content</label>
                <input
                  type="text"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter text"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Font Family</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Arial">Arial</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Font Size</label>
                <input
                  type="range"
                  min="10"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600">{fontSize}px</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Text Color</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <button
                onClick={addTextToCanvas}
                disabled={!newText || !fabricLoaded}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Text
              </button>
              
              <button
                onClick={updateSelectedText}
                disabled={!selectedTextElement || !newText}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Text
              </button>
              
              <button
                onClick={saveInvitation}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
              >
                Save Invitation
              </button>
            </div>
          </div>
        </div>
        
        {/* Text Elements List */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-2">Text Elements</h2>
          <div className="border rounded-lg p-4 bg-white">
            {textElements.length > 0 ? (
              <ul className="space-y-2 max-h-96 overflow-y-auto">
                {textElements.map((element) => (
                  <li 
                    key={element.id}
                    className={`p-2 border rounded cursor-pointer hover:bg-gray-50 ${
                      selectedTextElement?.id === element.id ? 'bg-blue-50 border-blue-500' : ''
                    }`}
                    onClick={() => {
                      // Select the text object on canvas
                      if (fabricCanvasRef.current) {
                        const objects = fabricCanvasRef.current.getObjects();
                        const textObject = objects.find((obj: any) => obj.id === element.id);
                        if (textObject) {
                          fabricCanvasRef.current.setActiveObject(textObject);
                          fabricCanvasRef.current.renderAll();
                        }
                      }
                      setSelectedTextElement(element);
                      setNewText(element.text);
                      setFontFamily(element.fontFamily);
                      setFontSize(element.fontSize);
                      setTextColor(element.fill);
                    }}
                  >
                    <div className="font-medium truncate">{element.text}</div>
                    <div className="text-xs text-gray-500">
                      {element.fontFamily}, {element.fontSize}px
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">No text elements added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationEditor;