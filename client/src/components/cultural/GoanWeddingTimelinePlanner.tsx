import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';
import { 
  Calendar,
  Clock,
  MapPin,
  Camera,
  Music,
  Utensils,
  Flower2,
  Heart,
  Crown,
  Home,
  Star,
  Plus,
  Download,
  Share
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { useToast } from '../../hooks/use-toast';

// TypeScript Interfaces
interface CeremonyEvent {
  id: string;
  name: string;
  description: string;
  culturalSignificance: string;
  estimatedDuration: number;
  traditionalTiming: string;
  requiredVendors: string[];
  culturalItems: string[];
  category: 'pre-wedding' | 'wedding-day' | 'post-wedding' | 'custom';
  isRequired: boolean;
  scheduledDateTime?: Date;
}

// Traditional Goan Wedding Ceremonies (condensed)
const traditionalCeremonies: CeremonyEvent[] = [
  {
    id: 'roce-ceremony',
    name: 'Roce Ceremony',
    description: 'Traditional pre-wedding blessing with coconut milk application',
    culturalSignificance: 'Purification ritual performed 3 days before the wedding. Family members apply coconut milk mixed with turmeric.',
    estimatedDuration: 180,
    traditionalTiming: '3 days before wedding, evening (6:00 PM)',
    requiredVendors: ['photographer', 'decorator', 'caterer', 'musician'],
    culturalItems: ['Fresh coconut milk', 'Turmeric powder', 'Traditional brass vessels', 'Marigold flowers'],
    category: 'pre-wedding',
    isRequired: true
  },
  {
    id: 'chuddo-ceremony',
    name: 'Chuddo Ceremony',
    description: 'Goan equivalent of Haldi ceremony',
    culturalSignificance: 'Applied one day before the wedding, the turmeric paste is blessed and applied by married women.',
    estimatedDuration: 120,
    traditionalTiming: '1 day before wedding, morning (10:00 AM)',
    requiredVendors: ['photographer', 'decorator', 'entertainer'],
    culturalItems: ['Turmeric paste (haldi)', 'Rose petals', 'Traditional brass plates', 'White clothes'],
    category: 'pre-wedding',
    isRequired: true
  },
  {
    id: 'church-ceremony',
    name: 'Church Wedding Ceremony',
    description: 'Sacred Catholic wedding ceremony',
    culturalSignificance: 'The most important part of the Goan Catholic wedding, conducted according to Catholic traditions.',
    estimatedDuration: 90,
    traditionalTiming: 'Wedding day, morning (10:00 AM - 11:30 AM)',
    requiredVendors: ['photographer', 'videographer', 'florist', 'musician'],
    culturalItems: ['Wedding rings', 'Church flowers', 'Wedding certificate', 'Traditional attire'],
    category: 'wedding-day',
    isRequired: true
  },
  {
    id: 'reception-dinner',
    name: 'Wedding Reception',
    description: 'Grand celebration with traditional Goan feast',
    culturalSignificance: 'Community celebration featuring authentic Goan cuisine, folk dances, and blessings from elders.',
    estimatedDuration: 300,
    traditionalTiming: 'Wedding day, evening (7:00 PM - 12:00 AM)',
    requiredVendors: ['caterer', 'decorator', 'dj', 'photographer', 'videographer'],
    culturalItems: ['Traditional Goan dishes', 'Cashew feni', 'Folk dance costumes', 'Decorated mandap'],
    category: 'wedding-day',
    isRequired: true
  },
  {
    id: 'porton',
    name: 'Porton (Portanim)',
    description: 'Bride\'s return to maternal home',
    culturalSignificance: 'Traditional ceremony where the bride returns to her mother\'s home for blessings.',
    estimatedDuration: 150,
    traditionalTiming: '3-7 days after wedding',
    requiredVendors: ['photographer', 'caterer'],
    culturalItems: ['Traditional gifts', 'Family blessing items', 'Traditional sweets'],
    category: 'post-wedding',
    isRequired: false
  }
];

const GoanWeddingTimelinePlanner: React.FC = () => {
  const events = [
    {
      day: "Day 1",
      title: "Nischay Ceremony",
      description: "Traditional engagement ceremony with exchange of rings and blessings",
      time: "Morning",
      duration: "2 hours"
    },
    {
      day: "Day 2",
      title: "Mandap Decoration",
      description: "Setting up the wedding mandap with traditional Goan decorations",
      time: "All day",
      duration: "8 hours"
    },
    {
      day: "Day 3",
      title: "Wedding Ceremony",
      description: "Main wedding ceremony with traditional rituals and customs",
      time: "Evening",
      duration: "4 hours"
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Goan Wedding Timeline Planner</h2>
      
      <div className="space-y-6">
        {events.map((event, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-blue-600">{event.title}</h3>
                <p className="text-gray-600 mt-1">{event.description}</p>
              </div>
              <div className="text-right">
                <div className="font-medium">{event.day}</div>
                <div className="text-sm text-gray-500">{event.time} • {event.duration}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-green-50 rounded-lg">
        <h3 className="font-semibold text-green-800">Tips for Planning</h3>
        <ul className="mt-2 list-disc list-inside text-green-700">
          <li>Book vendors at least 6 months in advance</li>
          <li>Consider the monsoon season when planning</li>
          <li>Include traditional Goan music and dance</li>
        </ul>
      </div>
    </div>
  );
};

export default GoanWeddingTimelinePlanner;