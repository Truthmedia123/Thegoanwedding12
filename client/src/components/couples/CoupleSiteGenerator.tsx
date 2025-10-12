import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChevronRight, ChevronLeft, Palette, Heart, Calendar, Camera, BookOpen, Users } from 'lucide-react';

interface CoupleInfo {
  bride: string;
  groom: string;
  weddingDate: string;
  venue: string;
  slug: string;
}

interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

interface SectionData {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  story: {
    title: string;
    content: string;
    images: string[];
  };
  events: Array<{
    name: string;
    date: string;
    time: string;
    venue: string;
    description: string;
  }>;
  gallery: {
    title: string;
    images: string[];
  };
  guestbook: {
    enabled: boolean;
    title: string;
  };
}

interface WeddingSiteConfig {
  coupleInfo: CoupleInfo;
  theme: ThemePreset;
  sections: SectionData;
}

const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'goan-sunset',
    name: 'Goan Sunset',
    description: 'Warm oranges and corals inspired by Goan beaches',
    colors: {
      primary: '#dc2626',
      secondary: '#ea580c',
      accent: '#fbbf24',
      background: '#fffbeb'
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Inter'
    }
  },
  {
    id: 'royal-elegance',
    name: 'Royal Elegance',
    description: 'Deep purples and gold for a regal feel',
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#fbbf24',
      background: '#faf7ff'
    },
    fonts: {
      heading: 'Cormorant Garamond',
      body: 'Source Sans Pro'
    }
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    description: 'Cool blues and teals reflecting the Arabian Sea',
    colors: {
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      accent: '#10b981',
      background: '#f0f9ff'
    },
    fonts: {
      heading: 'Merriweather',
      body: 'Open Sans'
    }
  },
  {
    id: 'garden-romance',
    name: 'Garden Romance',
    description: 'Soft pinks and greens for outdoor ceremonies',
    colors: {
      primary: '#ec4899',
      secondary: '#f472b6',
      accent: '#34d399',
      background: '#fdf2f8'
    },
    fonts: {
      heading: 'Dancing Script',
      body: 'Nunito'
    }
  }
];

export default function CoupleSiteGenerator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [coupleInfo, setCoupleInfo] = useState<CoupleInfo>({
    bride: '',
    groom: '',
    weddingDate: '',
    venue: '',
    slug: ''
  });
  const [selectedTheme, setSelectedTheme] = useState<ThemePreset>(THEME_PRESETS[0]);
  const [sections, setSections] = useState<SectionData>({
    hero: {
      title: '',
      subtitle: '',
      backgroundImage: ''
    },
    story: {
      title: 'Our Love Story',
      content: '',
      images: []
    },
    events: [
      {
        name: 'Sangam Ceremony',
        date: '',
        time: '',
        venue: '',
        description: ''
      },
      {
        name: 'Wedding Ceremony',
        date: '',
        time: '',
        venue: '',
        description: ''
      },
      {
        name: 'Reception',
        date: '',
        time: '',
        venue: '',
        description: ''
      }
    ],
    gallery: {
      title: 'Our Memories',
      images: []
    },
    guestbook: {
      enabled: true,
      title: 'Leave us a message'
    }
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');

  const steps = [
    { title: 'Couple Information', icon: Heart },
    { title: 'Choose Theme', icon: Palette },
    { title: 'Hero Section', icon: Camera },
    { title: 'Love Story', icon: BookOpen },
    { title: 'Events Schedule', icon: Calendar },
    { title: 'Photo Gallery', icon: Camera },
    { title: 'Final Review', icon: Users }
  ];

  // Auto-generate slug from names
  React.useEffect(() => {
    if (coupleInfo.bride && coupleInfo.groom) {
      const slug = `${coupleInfo.bride.toLowerCase()}-${coupleInfo.groom.toLowerCase()}`
        .replace(/[^a-z0-9\-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setCoupleInfo(prev => ({ ...prev, slug }));
    }
  }, [coupleInfo.bride, coupleInfo.groom]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateSite = async () => {
    setIsGenerating(true);
    try {
      const config: WeddingSiteConfig = {
        coupleInfo,
        theme: selectedTheme,
        sections
      };

      // Save configuration to public/couple-sites/{slug}.json
      const response = await fetch('/api/couple-sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (response.ok) {
        const result = await response.json();
        setGeneratedUrl(`${window.location.origin}/couples/${coupleInfo.slug}`);
      }
    } catch (error) {
      console.error('Failed to generate site:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="bride">Bride's Name</Label>
                <Input
                  id="bride"
                  value={coupleInfo.bride}
                  onChange={(e) => setCoupleInfo(prev => ({ ...prev, bride: e.target.value }))}
                  placeholder="Enter bride's name"
                />
              </div>
              <div>
                <Label htmlFor="groom">Groom's Name</Label>
                <Input
                  id="groom"
                  value={coupleInfo.groom}
                  onChange={(e) => setCoupleInfo(prev => ({ ...prev, groom: e.target.value }))}
                  placeholder="Enter groom's name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="weddingDate">Wedding Date</Label>
                <Input
                  id="weddingDate"
                  type="date"
                  value={coupleInfo.weddingDate}
                  onChange={(e) => setCoupleInfo(prev => ({ ...prev, weddingDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="venue">Main Venue</Label>
                <Input
                  id="venue"
                  value={coupleInfo.venue}
                  onChange={(e) => setCoupleInfo(prev => ({ ...prev, venue: e.target.value }))}
                  placeholder="Wedding venue"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="slug">Website URL</Label>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">thegoanwedding.com/couples/</span>
                <Input
                  id="slug"
                  value={coupleInfo.slug}
                  onChange={(e) => setCoupleInfo(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="your-website-url"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">Choose Your Theme</h3>
              <p className="text-gray-600">Select a theme that reflects your style</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {THEME_PRESETS.map((theme) => (
                <Card
                  key={theme.id}
                  className={`cursor-pointer transition-all ${
                    selectedTheme.id === theme.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedTheme(theme)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-lg">{theme.name}</h4>
                      <div className="flex space-x-1">
                        {Object.values(theme.colors).map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{theme.description}</p>
                    <div className="text-xs text-gray-500">
                      <div>Heading: {theme.fonts.heading}</div>
                      <div>Body: {theme.fonts.body}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="heroTitle">Hero Title</Label>
              <Input
                id="heroTitle"
                value={sections.hero.title}
                onChange={(e) => setSections(prev => ({
                  ...prev,
                  hero: { ...prev.hero, title: e.target.value }
                }))}
                placeholder={`${coupleInfo.bride} & ${coupleInfo.groom}`}
              />
            </div>
            <div>
              <Label htmlFor="heroSubtitle">Subtitle</Label>
              <Input
                id="heroSubtitle"
                value={sections.hero.subtitle}
                onChange={(e) => setSections(prev => ({
                  ...prev,
                  hero: { ...prev.hero, subtitle: e.target.value }
                }))}
                placeholder="Are getting married!"
              />
            </div>
            <div>
              <Label htmlFor="heroBackground">Background Image URL</Label>
              <Input
                id="heroBackground"
                value={sections.hero.backgroundImage}
                onChange={(e) => setSections(prev => ({
                  ...prev,
                  hero: { ...prev.hero, backgroundImage: e.target.value }
                }))}
                placeholder="https://example.com/hero-image.jpg"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="storyTitle">Section Title</Label>
              <Input
                id="storyTitle"
                value={sections.story.title}
                onChange={(e) => setSections(prev => ({
                  ...prev,
                  story: { ...prev.story, title: e.target.value }
                }))}
                placeholder="Our Love Story"
              />
            </div>
            <div>
              <Label htmlFor="storyContent">Your Story</Label>
              <Textarea
                id="storyContent"
                value={sections.story.content}
                onChange={(e) => setSections(prev => ({
                  ...prev,
                  story: { ...prev.story, content: e.target.value }
                }))}
                placeholder="Tell your love story..."
                rows={6}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Wedding Events Schedule</h3>
            {sections.events.map((event, index) => (
              <Card key={index}>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Event Name</Label>
                      <Input
                        value={event.name}
                        onChange={(e) => {
                          const newEvents = [...sections.events];
                          newEvents[index].name = e.target.value;
                          setSections(prev => ({ ...prev, events: newEvents }));
                        }}
                      />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={event.date}
                        onChange={(e) => {
                          const newEvents = [...sections.events];
                          newEvents[index].date = e.target.value;
                          setSections(prev => ({ ...prev, events: newEvents }));
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Time</Label>
                      <Input
                        value={event.time}
                        onChange={(e) => {
                          const newEvents = [...sections.events];
                          newEvents[index].time = e.target.value;
                          setSections(prev => ({ ...prev, events: newEvents }));
                        }}
                        placeholder="e.g., 10:00 AM"
                      />
                    </div>
                    <div>
                      <Label>Venue</Label>
                      <Input
                        value={event.venue}
                        onChange={(e) => {
                          const newEvents = [...sections.events];
                          newEvents[index].venue = e.target.value;
                          setSections(prev => ({ ...prev, events: newEvents }));
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={event.description}
                      onChange={(e) => {
                        const newEvents = [...sections.events];
                        newEvents[index].description = e.target.value;
                        setSections(prev => ({ ...prev, events: newEvents }));
                      }}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="galleryTitle">Gallery Title</Label>
              <Input
                id="galleryTitle"
                value={sections.gallery.title}
                onChange={(e) => setSections(prev => ({
                  ...prev,
                  gallery: { ...prev.gallery, title: e.target.value }
                }))}
                placeholder="Our Memories"
              />
            </div>
            <div>
              <Label>Gallery Images (URLs, one per line)</Label>
              <Textarea
                value={sections.gallery.images.join('\n')}
                onChange={(e) => setSections(prev => ({
                  ...prev,
                  gallery: { 
                    ...prev.gallery, 
                    images: e.target.value.split('\n').filter(url => url.trim()) 
                  }
                }))}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                rows={6}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Review Your Wedding Website</h3>
              <p className="text-gray-600 mb-8">
                Please review all the information before generating your website
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Couple Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div><strong>Bride:</strong> {coupleInfo.bride}</div>
                    <div><strong>Groom:</strong> {coupleInfo.groom}</div>
                    <div><strong>Date:</strong> {coupleInfo.weddingDate}</div>
                    <div><strong>Venue:</strong> {coupleInfo.venue}</div>
                    <div><strong>URL:</strong> /couples/{coupleInfo.slug}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Theme</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="font-medium">{selectedTheme.name}</div>
                    <div className="text-sm text-gray-600">{selectedTheme.description}</div>
                    <div className="flex space-x-1">
                      {Object.values(selectedTheme.colors).map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {generatedUrl && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <h4 className="text-lg font-semibold text-green-800 mb-2">
                    Website Generated Successfully! 🎉
                  </h4>
                  <p className="text-green-700 mb-4">
                    Your wedding website is ready at:
                  </p>
                  <a 
                    href={generatedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {generatedUrl}
                  </a>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Create Your Wedding Website</h2>
        <p className="text-gray-600">Build a beautiful website for your special day</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    index === currentStep
                      ? 'bg-blue-600 text-white'
                      : index < currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-xs text-center max-w-16">
                  {step.title}
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
        </CardHeader>
        <CardContent>{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep === steps.length - 1 ? (
          <Button
            onClick={generateSite}
            disabled={isGenerating || !coupleInfo.bride || !coupleInfo.groom}
          >
            {isGenerating ? 'Generating...' : 'Generate Website'}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 0 && (!coupleInfo.bride || !coupleInfo.groom)) ||
              isGenerating
            }
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}