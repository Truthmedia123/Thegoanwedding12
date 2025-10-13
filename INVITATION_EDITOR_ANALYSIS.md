# Wedding Invitation Editor - Analysis & Requirements

## 📋 Current Status

### ✅ What Exists:
1. **InvitationEditor Component** (`client/src/components/InvitationEditor.tsx`)
   - Uses Fabric.js for canvas-based editing
   - Supports text editing, fonts, colors
   - Template selection UI
   - Save functionality

2. **Invitations Page** (`client/src/pages/Invitations.tsx`)
   - Simple wrapper for the editor component

3. **Template Definitions** (in `scripts/seed-data.ts`)
   - 8 pre-defined invitation templates
   - Categories: beach, traditional, modern, tropical, vintage, bohemian, luxury, simple

### ❌ What's Missing:

1. **Database Table**
   - No `invitation_templates` table in Supabase schema
   - No `wedding_invitations` table to store user-created invitations

2. **Template Images/Assets**
   - No actual template files or preview images
   - Templates only have metadata (name, description, category)

3. **Supabase Integration**
   - Editor tries to load templates but there's no Supabase service for it
   - No API endpoints for templates

## 🎨 Template Structure

Based on the code, each template should have:

```typescript
interface InvitationTemplate {
  id: number;
  name: string;
  description: string;
  preview_image: string;      // URL to preview image
  template_file: string;       // URL to template file (JSON or image)
  category: string;            // beach, traditional, modern, etc.
  tags: string[];              // Array of tags for filtering
  featured: boolean;           // Show in featured section
  status: string;              // published, draft, archived
  created_at: string;
  updated_at: string;
}
```

## 📦 Existing Templates (8 Total)

1. **Beach Wedding Elegance** ⭐ Featured
   - Category: beach
   - Tags: beach, elegant, sunset
   - Description: Elegant beach-themed invitation with seashells and sunset colors

2. **Traditional Goan Ceremony** ⭐ Featured
   - Category: traditional
   - Tags: traditional, goan, cultural
   - Description: Traditional invitation design featuring Goan cultural elements

3. **Modern Minimalist**
   - Category: modern
   - Tags: modern, minimalist, clean
   - Description: Clean and modern design with minimalist typography

4. **Tropical Paradise** ⭐ Featured
   - Category: tropical
   - Tags: tropical, vibrant, flowers
   - Description: Vibrant tropical design with palm leaves and exotic flowers

5. **Vintage Romance** ⭐ Featured
   - Category: vintage
   - Tags: vintage, romantic, elegant
   - Description: Romantic vintage design with elegant script fonts and floral accents

6. **Bohemian Rhapsody**
   - Category: bohemian
   - Tags: bohemian, earthy, artistic
   - Description: Bohemian style with earthy tones and artistic elements

7. **Royal Affair** ⭐ Featured
   - Category: luxury
   - Tags: luxury, gold, regal
   - Description: Luxurious design with gold accents and regal typography

8. **Simple Elegance**
   - Category: simple
   - Tags: simple, elegant, clean
   - Description: Clean and simple design with sophisticated color palette

## 🛠️ What Needs to Be Built

### 1. Database Schema

Create tables in Supabase:

```sql
-- Invitation Templates Table
CREATE TABLE IF NOT EXISTS invitation_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    preview_image VARCHAR(500),
    template_data JSONB,  -- Fabric.js canvas JSON
    category VARCHAR(100),
    tags TEXT[],
    featured BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'published',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Created Invitations Table
CREATE TABLE IF NOT EXISTS wedding_invitations (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    template_id INTEGER REFERENCES invitation_templates(id),
    title VARCHAR(255),
    canvas_data JSONB,  -- Fabric.js canvas JSON
    preview_image TEXT,  -- Base64 or URL
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Template Assets Needed

For each template, you need:

**A. Preview Images** (for template selection)
- Size: 400x600px (portrait)
- Format: JPG or PNG
- Location: `/public/templates/previews/`

**B. Template Canvas Data** (Fabric.js JSON)
- Background image or color
- Pre-positioned text elements
- Decorative elements (borders, graphics)
- Default fonts and colors

### 3. Supabase Service Functions

Create in `client/src/lib/supabase-service.ts`:

```typescript
// Get all invitation templates
export const invitationTemplateService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('invitation_templates')
      .select('*')
      .eq('status', 'published')
      .order('featured', { ascending: false });
    
    return { data, error: error?.message };
  },
  
  getFeatured: async () => {
    const { data, error } = await supabase
      .from('invitation_templates')
      .select('*')
      .eq('featured', true)
      .eq('status', 'published');
    
    return { data, error: error?.message };
  }
};

// User invitations
export const userInvitationService = {
  create: async (invitation: any) => {
    const { data, error } = await supabase
      .from('wedding_invitations')
      .insert(invitation)
      .select()
      .single();
    
    return { data, error: error?.message };
  },
  
  update: async (id: number, updates: any) => {
    const { data, error } = await supabase
      .from('wedding_invitations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error: error?.message };
  }
};
```

### 4. Template Design Specifications

Each template should include:

**Design Elements:**
- Background (color or image)
- Border/Frame design
- Decorative graphics (flowers, patterns, etc.)
- Text placeholders:
  - Couple names
  - Wedding date
  - Venue/location
  - Time
  - RSVP details
  - Additional message

**Fabric.js Canvas JSON Structure:**
```json
{
  "version": "5.3.0",
  "objects": [
    {
      "type": "rect",
      "fill": "#f8f9fa",
      "width": 800,
      "height": 600
    },
    {
      "type": "text",
      "text": "Bride & Groom",
      "fontSize": 48,
      "fontFamily": "Playfair Display",
      "fill": "#2c3e50",
      "left": 400,
      "top": 200,
      "textAlign": "center"
    }
  ]
}
```

## 🎯 Recommended Next Steps

1. **Create Database Tables** - Run SQL to create invitation_templates and wedding_invitations tables
2. **Design Templates** - Create 8 template designs using Fabric.js
3. **Generate Preview Images** - Create preview images for each template
4. **Seed Database** - Insert template data into Supabase
5. **Update Editor** - Connect editor to Supabase services
6. **Test Functionality** - Test template loading, editing, and saving

## 📁 Template Categories Breakdown

- **Beach** (1): Beach Wedding Elegance
- **Traditional** (1): Traditional Goan Ceremony  
- **Modern** (1): Modern Minimalist
- **Tropical** (1): Tropical Paradise
- **Vintage** (1): Vintage Romance
- **Bohemian** (1): Bohemian Rhapsody
- **Luxury** (1): Royal Affair
- **Simple** (1): Simple Elegance

**Featured Templates:** 5 out of 8

## 🎨 Design Tools & Resources

**Fonts to Use:**
- Elegant: Playfair Display, Cormorant, Libre Baskerville
- Modern: Montserrat, Poppins, Inter
- Traditional: Crimson Text, Lora
- Script: Great Vibes, Dancing Script, Pacifico

**Color Palettes:**
- Beach: Blues, sandy beige, coral
- Traditional: Gold, maroon, cream
- Modern: Black, white, gray
- Tropical: Bright greens, pinks, yellows
- Vintage: Sepia, cream, dusty rose
- Bohemian: Earth tones, terracotta
- Luxury: Gold, navy, burgundy
- Simple: Minimalist neutrals

**Graphics/Icons:**
- Floral elements
- Geometric patterns
- Beach elements (shells, waves)
- Traditional motifs
- Borders and frames
