# 🏖️ TheGoanWedding - Premier Wedding Vendor Directory

A beautiful, modern wedding vendor directory platform specifically designed for Goan weddings, featuring a comprehensive vendor management system and beautiful UI components.

## 🌟 Features

### 🎯 Core Platform
- **Vendor Directory**: 500+ trusted wedding professionals across Goa
- **Category-based Search**: Photographers, Venues, Caterers, Decorators, etc.
- **Location Filtering**: North Goa & South Goa regions
- **Advanced Search**: Price range, ratings, and multi-select filters
- **Vendor Profiles**: Detailed profiles with photos, reviews, and contact info
- **Social Media Integration**: Facebook, Instagram, LinkedIn, Twitter links
- **Embedded Content**: Instagram posts, YouTube videos, and more

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach
- **Goan Wedding Theme**: Pink, purple, and emerald color scheme
- **PWA Support**: Install as mobile app
- **Performance Optimized**: Fast loading and smooth interactions
- **SEO Optimized**: Meta tags, structured data, sitemaps
- **Accessibility**: WCAG 2.1 AA compliant
- **Dark Mode**: Automatic theme switching

### 🔧 Admin Features
- **Database Integration**: Supabase PostgreSQL for robust data management
- **Vendor Management**: Import/export vendor data with social media fields
- **Analytics Dashboard**: Google Analytics 4 and Microsoft Clarity integration
- **Security Features**: Row Level Security (RLS) and API protection
- **Bulk Import**: CSV import with template support
- **Rate Limiting**: API protection against abuse
- **Full-Text Search**: PostgreSQL-based search with ranking

### 📱 User Engagement
- **Wishlist**: Save favorite vendors
- **Recently Viewed**: Quick access to recently viewed vendors
- **Vendor Comparison**: Compare multiple vendors side-by-side
- **Social Sharing**: Share vendors on social media
- **Newsletter Signup**: Stay updated with wedding tips
- **Reviews & Ratings**: Customer feedback system

### 💰 Monetization
- **Google AdSense**: Responsive ad placement
- **Sponsored Listings**: Premium vendor placement
- **Affiliate Links**: Revenue sharing opportunities

## 📊 Analytics

The platform uses Google Analytics 4 and Microsoft Clarity for comprehensive user tracking:

### Tracked Events
- **Vendor Page Views**: When users view vendor profiles
- **Contact Vendor Clicks**: When users click to contact vendors via WhatsApp or phone
- **Gallery Image Opens**: When users view gallery images
- **RSVP Clicks**: When users respond to wedding invitations
- **Invitation Sends**: When users create and save wedding invitations

### Dashboard Access
Admins can view analytics data by:
1. Accessing the Umami dashboard at `https://umami.yourdomain.com`
2. Logging in with admin credentials
3. Viewing real-time data and historical reports
4. Segmenting data by vendor, event, and action

For detailed setup instructions, see [UMAMI_ANALYTICS_SETUP.md](UMAMI_ANALYTICS_SETUP.md).

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd weddingreplit
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example env file
cp env.template .env.local

# Edit .env.local with your configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_CLARITY_PROJECT_ID=your-clarity-project-id
```

4. **Run the development server**
```bash
# Option 1: Cloudflare Pages Dev (Recommended)
npm run pages:dev

# Option 2: Express Dev Server
npm run dev
```

5. **Open your browser**
```
http://127.0.0.1:8787
```

## 📁 Project Structure

```
weddingreplit/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── PWA/        # Progressive Web App features
│   │   │   ├── admin/      # Admin dashboard components
│   │   │   ├── ads/        # AdSense components
│   │   │   ├── blog/       # Blog components
│   │   │   ├── communication/ # Chat system
│   │   │   ├── couples/    # Couple tools
│   │   │   ├── cultural/   # Cultural content
│   │   │   ├── engagement/ # User engagement features
│   │   │   ├── layout/     # Layout components
│   │   │   ├── performance/ # Performance monitoring
│   │   │   ├── protection/ # Content protection
│   │   │   ├── search/     # Search components
│   │   │   ├── seo/        # SEO components
│   │   │   ├── ui/         # Base UI components
│   │   │   └── vendor/     # Vendor components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Main app component
│   └── public/             # Static assets
│       └── vendors/        # Vendor images (profile, cover, gallery)
├── server/                 # Backend server
│   ├── worker.ts           # Cloudflare Worker
│   ├── routes.ts           # API routes
│   ├── middleware/         # Rate limiting and caching
│   └── dev-server.ts       # Express dev server
├── shared/                 # Shared schemas and types
├── migrations/             # Database migrations
├── scripts/                # Utility scripts
└── public/                 # Static files for Pages
```

## 🖼️ Vendor Image Management

All vendor images are managed as static assets in the `/client/public/vendors/` directory:

### Directory Structure
```
/client/public/vendors/
├── vendor-slug/
│   ├── profile.jpg         # Main profile image (800x600px)
│   ├── cover.jpg           # Cover/banner image (1200x400px)
│   └── gallery/            # Gallery images (1200x800px each)
│       ├── image1.jpg
│       ├── image2.jpg
│       └── ...
```

### Image Workflow
1. **Optimize Images**: Resize and compress images for web use
2. **Organize**: Place images in vendor-specific directories
3. **Reference**: Update vendor data in Directus with static image paths
4. **Deploy**: Images are automatically served via Cloudflare CDN

For detailed instructions, see [VENDOR_IMAGE_WORKFLOW.md](VENDOR_IMAGE_WORKFLOW.md).

## 🛠️ Available Scripts

### Development
```bash
npm run dev              # Start Express dev server (port 5001) - Full-stack development
npm run pages:dev        # Start Cloudflare Pages dev server (port 8787) - Static preview only
```

### Frontend Development with HMR
```bash
cd client && npm run dev  # Start Vite dev server (port 3000) with API proxy to Express server
```

### Database
```bash
npm run db:push          # Push schema changes to database
npm run db:seed          # Seed database with initial data
npm run db:migrate       # Run database migrations
```

### Testing
```bash
npm test                 # Run test suite
npm test -- --coverage   # Run tests with coverage report
npm run test:watch       # Run tests in watch mode
```

### Deployment
```bash
npm run deploy:staging   # Deploy to staging environment
npm run deploy:production # Deploy to production
npm run deploy:pages      # Deploy static assets to Cloudflare Pages
```

## 🧪 Testing

### Unit Testing

Run unit tests with Jest:
```bash
npm test                 # Run test suite
npm test -- --coverage   # Run tests with coverage report
npm run test:watch       # Run tests in watch mode
```

### End-to-End Testing

Run Playwright tests:
```bash
npm run test:e2e         # Run end-to-end tests
```

### Performance and Accessibility Testing

Run Lighthouse audits:
```bash
npx lhci autorun         # Run Lighthouse CI
```

## 🛠️ Development

### Development Server

Start the development environment:
```bash
npm run dev:all          # Start all services (Directus, Meilisearch, App)
npm run pages:dev        # Start Cloudflare Pages dev server
```

### Code Quality

Ensure code quality with linting and formatting:
```bash
npm run check            # TypeScript type checking
npx eslint .             # ESLint code analysis
npx prettier --check .   # Prettier code formatting
```

### Database

Manage the database:
```bash
npm run db:push          # Push schema changes to database
npm run db:seed          # Seed database with initial data
npm run seed             # Add sample data
npm run seed:reset       # Reset and reseed data
```

### Security

Run security audits:
```bash
npm audit                # Check for vulnerable dependencies
npm run update-deps      # Update dependencies and check for vulnerabilities
```

### Utilities
```bash
npm run import:vendors   # Import vendor data from CSV
npm run optimize:images  # Optimize and compress images
npm run audit            # Run accessibility and performance audits
```

### Maintenance
```bash
npm run update-deps      # Update dependencies and check for vulnerabilities
```

### Production Smoke Testing

Run production smoke tests to verify deployment:
```bash
npm run test:smoke       # Run production smoke tests
```

For detailed information about smoke testing, see [PRODUCTION_SMOKE_TEST.md](docs/PRODUCTION_SMOKE_TEST.md).

## 📚 Documentation

For more detailed information about the project, please refer to the following documentation:

- [Dependency Updates and Security Fixes](DEPENDENCY_UPDATES.md) - Details about security updates and dependency management
- [Project Improvements Summary](IMPROVEMENTS_SUMMARY.md) - Summary of all improvements made to the project
- [Quick Start Guide](QUICK_START.md) - Simplified guide for getting started with the project
- [Cloudflare Deployment Fixes](CLOUDFLARE_DEPLOYMENT_FIXES.md) - Information about fixing Cloudflare deployment issues

## 🏖️ Goan Wedding Features

### Traditional Elements
- **Venue Suggestions**: Grand Hyatt, Taj Exotica, Marriott, etc.
- **Traditional Timing**: 4:00 PM ceremony, 7:00 PM reception

### Guest Experience
- **Transportation**: Assistance for out-of-town guests
- **Accommodation**: Help with hotel bookings
- **Children**: Special considerations for families with children

## 🎨 Customization

### Colors & Theme
The platform uses a Goan wedding color scheme:
- **Primary**: Pink (#ec4899)
- **Secondary**: Purple (#8b5cf6) 
- **Accent**: Emerald (#10b981)
- **Background**: Gradient from pink to purple

### Adding New Vendors
1. Use the admin dashboard: `/admin/dashboard?token=admin-secret-2024`
2. Import CSV file with vendor data (including social media fields)
3. Or use Directus CMS for content management

## 🔧 Configuration

### Environment Variables
```bash
DATABASE_URL=your_cloudflare_d1_database_url
SITE_URL=https://thegoanwedding.com
NODE_ENV=production
```

## 🚀 Deployment

### Automatic Deployment with Cloudflare Pages

The project is configured for automatic deployment using Cloudflare Pages connected to GitHub:

#### **Repository Setup**
- **GitHub Repository**: `Thegoanwedding12`
- **Default Branch**: `main`
- **Auto-deploy**: Every commit to main triggers automatic build and deployment

#### **Deployment Workflow**
1. **Commit and push** to the `main` branch
2. **Cloudflare Pages** automatically builds and deploys
3. **Verify deployment** at https://thegoanwedding12.pages.dev

#### **Manual Deployment**
You can still trigger manual deployments:
```bash
npm run deploy:pages
```

#### **Environment Variables**
The following environment variables are configured in Cloudflare Pages:
- `VITE_SUPABASE_URL` - Supabase database URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_GA_MEASUREMENT_ID` - Google Analytics measurement ID
- `VITE_CLARITY_PROJECT_ID` - Microsoft Clarity project ID

#### **Build Configuration**
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Framework Preset**: None/Other

### Custom Domain Setup
To connect your custom domain:
1. Go to the Cloudflare dashboard
2. Navigate to your Pages project
3. Go to "Custom domains"
4. Add your domain (thegoanwedding.com)
5. Follow the DNS configuration instructions