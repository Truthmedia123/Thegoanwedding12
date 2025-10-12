import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Textarea } from '../ui/textarea';
import { 
  Send, 
  Paperclip, 
  Mic, 
  MicOff,
  Image as ImageIcon, 
  File, 
  MapPin, 
  Phone,
  Video,
  MoreVertical,
  Search,
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Clock,
  Smile,
  Camera
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useToast } from '../../hooks/use-toast';

// TypeScript Interfaces
interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice' | 'location' | 'template';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    location?: { lat: number; lng: number; name: string };
    templateType?: string;
    duration?: number; // for voice messages
  };
}

interface ChatThread {
  id: string;
  participants: string[];
  vendorId: string;
  coupleId: string;
  vendorName: string;
  coupleName: string;
  vendorAvatar: string;
  coupleAvatar: string;
  lastMessage: ChatMessage;
  unreadCount: number;
  isActive: boolean;
  isTyping: boolean;
}

interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'vendor' | 'couple';
  isOnline: boolean;
  lastSeen?: Date;
}

interface QuickTemplate {
  id: string;
  title: string;
  content: string;
  category: 'greeting' | 'availability' | 'pricing' | 'followup';
}

// Mock Data
const currentUser: User = {
  id: 'user-1',
  name: 'Coastal Captures Photography',
  avatar: '/assets/vendor-avatar.jpg',
  role: 'vendor',
  isOnline: true
};

const quickTemplates: QuickTemplate[] = [
  {
    id: 'template-1',
    title: 'Wedding Interest',
    content: "Hi! I'm interested in your photography services for my wedding on [date]. Could you please share your package details and availability?",
    category: 'greeting'
  },
  {
    id: 'template-2',
    title: 'Package Inquiry',
    content: "Could you please share your package details and pricing? We're looking for [service type] for our wedding.",
    category: 'pricing'
  },
  {
    id: 'template-3',
    title: 'Availability Check',
    content: "Do you have availability for [date] in [location]? We'd love to discuss our wedding photography needs.",
    category: 'availability'
  },
  {
    id: 'template-4',
    title: 'Schedule Call',
    content: "Could we schedule a call to discuss our requirements? I'm available [time] on [date].",
    category: 'followup'
  },
  {
    id: 'template-5',
    title: 'Venue Visit',
    content: "We'd love to meet in person. Are you available for a venue visit on [date] at [location]?",
    category: 'followup'
  }
];

const mockMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    senderId: 'couple-1',
    receiverId: 'user-1',
    content: "Hi! I'm interested in your photography services for my wedding on December 15th. Could you please share your package details?",
    type: 'text',
    timestamp: new Date(Date.now() - 60000),
    status: 'read'
  },
  {
    id: 'msg-2',
    senderId: 'user-1',
    receiverId: 'couple-1',
    content: "Hello! Thank you for reaching out. I'd be happy to help with your wedding photography. Let me share our packages with you.",
    type: 'text',
    timestamp: new Date(Date.now() - 30000),
    status: 'delivered'
  },
  {
    id: 'msg-3',
    senderId: 'user-1',
    receiverId: 'couple-1',
    content: "wedding-packages.pdf",
    type: 'file',
    timestamp: new Date(Date.now() - 15000),
    status: 'delivered',
    metadata: {
      fileName: 'wedding-packages.pdf',
      fileSize: 2450000
    }
  }
];

const mockThreads: ChatThread[] = [
  {
    id: 'thread-1',
    participants: ['user-1', 'couple-1'],
    vendorId: 'user-1',
    coupleId: 'couple-1',
    vendorName: 'Coastal Captures Photography',
    coupleName: 'Priya & Arjun',
    vendorAvatar: '/assets/vendor-avatar.jpg',
    coupleAvatar: '/assets/couple-avatar.jpg',
    lastMessage: mockMessages[2],
    unreadCount: 0,
    isActive: true,
    isTyping: false
  },
  {
    id: 'thread-2',
    participants: ['user-1', 'couple-2'],
    vendorId: 'user-1',
    coupleId: 'couple-2',
    vendorName: 'Coastal Captures Photography',
    coupleName: 'Sarah & Miguel',
    vendorAvatar: '/assets/vendor-avatar.jpg',
    coupleAvatar: '/assets/couple-2-avatar.jpg',
    lastMessage: {
      id: 'msg-4',
      senderId: 'couple-2',
      receiverId: 'user-1',
      content: "Thank you for the quote! We'd like to book you for our wedding.",
      type: 'text',
      timestamp: new Date(Date.now() - 120000),
      status: 'delivered'
    },
    unreadCount: 2,
    isActive: false,
    isTyping: false
  }
];

const VendorChatSystem: React.FC = () => {
  const [threads, setThreads] = useState<ChatThread[]>(mockThreads);
  const [activeThread, setActiveThread] = useState<ChatThread | null>(threads[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const voiceRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Filter threads based on search
  const filteredThreads = threads.filter(thread => 
    thread.coupleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Send message handler
  const sendMessage = useCallback((content: string, type: ChatMessage['type'] = 'text', metadata?: ChatMessage['metadata']) => {
    if (!activeThread || !content.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: activeThread.coupleId,
      content: content.trim(),
      type,
      timestamp: new Date(),
      status: 'sending',
      metadata
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMsg.id ? { ...msg, status: 'sent' } : msg
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMsg.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 2000);

    // Update last message in thread
    setThreads(prev => prev.map(thread => 
      thread.id === activeThread.id 
        ? { ...thread, lastMessage: newMsg, unreadCount: 0 }
        : thread
    ));
  }, [activeThread]);

  // Handle key press for sending messages
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(newMessage);
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileSize = file.size;
    const fileName = file.name;
    const isImage = file.type.startsWith('image/');

    sendMessage(
      fileName,
      isImage ? 'image' : 'file',
      { fileName, fileSize }
    );

    toast({
      title: 'File uploaded',
      description: `${fileName} has been sent.`
    });
  };

  // Handle voice recording
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      voiceRecorderRef.current = new MediaRecorder(stream);
      
      voiceRecorderRef.current.start();
      setIsRecording(true);

      voiceRecorderRef.current.ondataavailable = (event) => {
        // In a real app, you'd handle the audio blob here
        console.log('Audio data available:', event.data);
      };

      voiceRecorderRef.current.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        
        sendMessage(
          'Voice message',
          'voice',
          { duration: 5 } // Mock 5 second duration
        );
      };
    } catch (error) {
      toast({
        title: 'Recording failed',
        description: 'Could not access microphone.',
        variant: 'destructive'
      });
    }
  };

  const stopVoiceRecording = () => {
    if (voiceRecorderRef.current) {
      voiceRecorderRef.current.stop();
    }
  };

  // Use template
  const useTemplate = (template: QuickTemplate) => {
    setNewMessage(template.content);
    setShowTemplates(false);
  };

  // Share location
  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          sendMessage(
            'Shared location',
            'location',
            {
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                name: 'Current Location'
              }
            }
          );
        },
        () => {
          toast({
            title: 'Location failed',
            description: 'Could not get your location.',
            variant: 'destructive'
          });
        }
      );
    }
  };

  // Mark messages as read
  const markAsRead = (threadId: string) => {
    setThreads(prev => prev.map(thread => 
      thread.id === threadId ? { ...thread, unreadCount: 0 } : thread
    ));
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get message status icon
  const getStatusIcon = (status: ChatMessage['status']) => {
    switch (status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-gray-400" />;
      case 'sent':
        return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  // Render message content
  const renderMessageContent = (message: ChatMessage) => {
    switch (message.type) {
      case 'text':
        return <p className="break-words">{message.content}</p>;
      
      case 'image':
        return (
          <div className="space-y-2">
            <div className="w-48 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm">{message.content}</p>
          </div>
        );
      
      case 'file':
        return (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <File className="h-8 w-8 text-blue-500" />
            <div>
              <p className="font-medium">{message.metadata?.fileName}</p>
              <p className="text-sm text-gray-600">
                {message.metadata?.fileSize && formatFileSize(message.metadata.fileSize)}
              </p>
            </div>
            <Button size="sm" variant="outline">Download</Button>
          </div>
        );
      
      case 'voice':
        return (
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="p-2 bg-blue-500 rounded-full">
              <Mic className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="w-32 h-2 bg-blue-200 rounded-full">
                <div className="w-16 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <span className="text-sm text-gray-600">{message.metadata?.duration}s</span>
          </div>
        );
      
      case 'location':
        return (
          <div className="space-y-2">
            <div className="w-48 h-32 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm">{message.metadata?.location?.name}</p>
            <Button size="sm" variant="outline">Open in Maps</Button>
          </div>
        );
      
      default:
        return <p>{message.content}</p>;
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Chat List Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Messages</h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNotifications(!notifications)}
              >
                {notifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Threads List */}
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {filteredThreads.map((thread) => (
              <div
                key={thread.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  activeThread?.id === thread.id 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => {
                  setActiveThread(thread);
                  markAsRead(thread.id);
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={thread.coupleAvatar} />
                      <AvatarFallback>{thread.coupleName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    {thread.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {thread.unreadCount}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold truncate">{thread.coupleName}</p>
                      <span className="text-xs text-gray-500">
                        {thread.lastMessage.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">
                        {thread.lastMessage.type === 'text' 
                          ? thread.lastMessage.content 
                          : `📎 ${thread.lastMessage.type === 'image' ? 'Image' : 'File'}`
                        }
                      </p>
                      {thread.lastMessage.senderId === currentUser.id && getStatusIcon(thread.lastMessage.status)}
                    </div>
                    
                    {thread.isTyping && (
                      <p className="text-xs text-blue-500 italic">typing...</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      {activeThread ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={activeThread.coupleAvatar} />
                <AvatarFallback>{activeThread.coupleName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{activeThread.coupleName}</h3>
                <p className="text-sm text-gray-600">Online now</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${
                    message.senderId === currentUser.id
                      ? 'bg-blue-500 text-white rounded-l-lg rounded-tr-lg'
                      : 'bg-white border rounded-r-lg rounded-tl-lg'
                  } p-3 shadow-sm`}>
                    {renderMessageContent(message)}
                    
                    <div className={`flex items-center justify-between mt-2 text-xs ${
                      message.senderId === currentUser.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {message.senderId === currentUser.id && (
                        <div className="ml-2">{getStatusIcon(message.status)}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="bg-white border-t p-4">
            {/* Quick Templates */}
            {showTemplates && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-2">Quick Templates:</p>
                <div className="grid grid-cols-1 gap-2">
                  {quickTemplates.map((template) => (
                    <Button
                      key={template.id}
                      variant="ghost"
                      size="sm"
                      className="justify-start text-left h-auto p-2"
                      onClick={() => useTemplate(template)}
                    >
                      <div>
                        <p className="font-medium">{template.title}</p>
                        <p className="text-xs text-gray-600 truncate">{template.content}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-end space-x-2">
              {/* Attachment Options */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <File className="h-4 w-4 mr-2" />
                      Document
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Photo
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={shareLocation}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Location
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Message Input */}
              <div className="flex-1 relative">
                <Textarea
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="resize-none pr-20"
                  rows={1}
                />
                
                <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTemplates(!showTemplates)}
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Voice Recording */}
              <Button
                variant="ghost"
                size="sm"
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                className={isRecording ? 'text-red-500' : ''}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>

              {/* Send Button */}
              <Button
                onClick={() => sendMessage(newMessage)}
                disabled={!newMessage.trim()}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx"
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
            <p className="text-gray-600">Choose a conversation from the sidebar to start messaging.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorChatSystem;