import { TemplateConfig, ReligionTemplate } from '../types/enterprise';

export const RELIGION_TEMPLATES: Record<ReligionTemplate, TemplateConfig> = {
  hindu: {
    id: 'hindu',
    name: 'hindu',
    displayName: 'Hindu Wedding',
    description: 'Traditional Hindu wedding celebration with sacred rituals and vibrant festivities',
    culturalElements: [
      'Om Symbol (🕉️)',
      'Mandala Patterns',
      'Lotus Motifs',
      'Sacred Fire Ceremony',
      'Saptapadi (Seven Steps)',
      'Marigold Decorations',
      'Henna Ceremonies'
    ],
    colorScheme: {
      primary: '#FF6B35',      // Saffron
      secondary: '#C5282F',    // Deep Red
      accent: '#FFD23F',       // Golden Yellow
      background: '#FFF8E1',   // Cream
      text: '#4A4A4A'          // Dark Gray
    },
    typography: {
      headingFont: 'Playfair Display',
      bodyFont: 'Inter',
      scriptSupport: 'Devanagari'
    },
    iconSet: {
      primary: '🕉️',
      ceremonial: ['👑', '🪷', '✨', '🔥', '💐'],
      decorative: ['🌺', '🎭', '🥁', '🎊', '💫']
    },
    ceremonialTerms: {
      ceremony: 'Vivah Ceremony',
      reception: 'Reception Celebration',
      invitation: 'Request the pleasure of your company',
      blessing: 'Mangal Milan'
    }
  },

  christian: {
    id: 'christian',
    name: 'christian',
    displayName: 'Christian Wedding',
    description: 'Sacred Christian wedding ceremony celebrating Holy Matrimony in divine love',
    culturalElements: [
      'Cross Symbol (✝️)',
      'Biblical Verses',
      'Church Architecture',
      'Wedding Rings',
      'White Dove',
      'Unity Candle',
      'Sacred Vows'
    ],
    colorScheme: {
      primary: '#2E5BBA',      // Royal Blue
      secondary: '#D4AF37',    // Gold
      accent: '#F8F6F0',       // Ivory
      background: '#FAFAFA',   // Light Gray
      text: '#2C3E50'          // Dark Blue-Gray
    },
    typography: {
      headingFont: 'Playfair Display',
      bodyFont: 'Lora',
      scriptSupport: 'Latin'
    },
    iconSet: {
      primary: '⛪',
      ceremonial: ['✝️', '🕊️', '💒', '🔔', '💍'],
      decorative: ['🌹', '👼', '💒', '⭐', '🕯️']
    },
    ceremonialTerms: {
      ceremony: 'Wedding Ceremony',
      reception: 'Wedding Reception',
      invitation: 'Request the honor of your presence',
      blessing: 'Holy Matrimony'
    }
  },

  islamic: {
    id: 'islamic',
    name: 'islamic',
    displayName: 'Islamic Wedding',
    description: 'Beautiful Islamic wedding celebration following traditional Nikah and Walima customs',
    culturalElements: [
      'Crescent Moon (☪️)',
      'Islamic Geometry',
      'Arabic Calligraphy',
      'Arabesque Patterns',
      'Star and Crescent',
      'Geometric Motifs',
      'Traditional Blessings'
    ],
    colorScheme: {
      primary: '#00A86B',      // Islamic Green
      secondary: '#D4AF37',    // Calligraphy Gold
      accent: '#F8F6F0',       // Pearl White
      background: '#F0F8F0',   // Light Green
      text: '#1B4332'          // Dark Green
    },
    typography: {
      headingFont: 'Amiri',
      bodyFont: 'Source Sans Pro',
      scriptSupport: 'Arabic'
    },
    iconSet: {
      primary: '☪️',
      ceremonial: ['🕌', '📿', '💫', '⭐', '🌙'],
      decorative: ['🌹', '✨', '🎋', '🪷', '💎']
    },
    ceremonialTerms: {
      ceremony: 'Nikah Ceremony',
      reception: 'Walima Reception',
      invitation: 'Request the pleasure of your company',
      blessing: 'Barakallahu Lakuma'
    }
  }
};

export const getTemplateConfig = (template: ReligionTemplate): TemplateConfig => {
  return RELIGION_TEMPLATES[template];
};

export const getAllTemplates = (): TemplateConfig[] => {
  return Object.values(RELIGION_TEMPLATES);
};

export const getTemplateIcon = (template: ReligionTemplate): string => {
  return RELIGION_TEMPLATES[template].iconSet.primary;
};

export const getTemplateCulturalTerms = (template: ReligionTemplate) => {
  return RELIGION_TEMPLATES[template].ceremonialTerms;
};

export const getTemplateColorScheme = (template: ReligionTemplate) => {
  return RELIGION_TEMPLATES[template].colorScheme;
};

// Template validation utility
export const validateTemplateData = (template: ReligionTemplate, data: any): boolean => {
  const config = getTemplateConfig(template);
  
  // Basic validation - can be extended based on cultural requirements
  if (!data.brideName || !data.groomName || !data.weddingDate) {
    return false;
  }

  // Template-specific validations can be added here
  switch (template) {
    case 'hindu':
      // Hindu-specific validations
      break;
    case 'christian':
      // Christian-specific validations
      break;
    case 'islamic':
      // Islamic-specific validations
      break;
    default:
      return false;
  }

  return true;
};

// CSS class generators for template styling
export const getTemplateClasses = (template: ReligionTemplate) => {
  const config = getTemplateConfig(template);
  
  return {
    background: `bg-gradient-to-br from-${template}-50 via-white to-${template}-100`,
    headerGradient: `bg-gradient-to-r from-${template}-600 via-${template}-700 to-${template}-800`,
    cardBorder: `border-2 border-${template}-200`,
    cardBackground: `bg-gradient-to-br from-white to-${template}-50`,
    textPrimary: `text-${template}-700`,
    textSecondary: `text-${template}-600`,
    buttonPrimary: `bg-gradient-to-r from-${template}-500 to-${template}-600 hover:from-${template}-600 hover:to-${template}-700`,
    iconColor: `text-${template}-500`,
    accentColor: `text-${template}-400`
  };
};

// Generate CSS variables for dynamic theming
export const generateTemplateCSS = (template: ReligionTemplate): string => {
  const config = getTemplateConfig(template);
  const colors = config.colorScheme;
  
  return `
    :root {
      --template-primary: ${colors.primary};
      --template-secondary: ${colors.secondary};
      --template-accent: ${colors.accent};
      --template-background: ${colors.background};
      --template-text: ${colors.text};
      --template-heading-font: ${config.typography.headingFont};
      --template-body-font: ${config.typography.bodyFont};
    }
  `;
};