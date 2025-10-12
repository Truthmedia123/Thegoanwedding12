# TheGoanWedding Complete Development Setup Guide

This comprehensive guide will help you set up the complete development environment for TheGoanWedding project with all services, tools, and configurations needed for development.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
- **Git** - Download from [git-scm.com](https://git-scm.com/)
- **Meilisearch** - Install via package manager or download from [meilisearch.com](https://www.meilisearch.com/)
- **Docker** (optional) - For containerized development environment

### Required Ports
Make sure these ports are available on your system:
- `8055` - Directus CMS
- `7700` - Meilisearch
- `8787` - React application
- `3000` - Development dashboard
- `6379` - Redis (optional)

### System Requirements
- At least 8GB RAM recommended
- 2GB free disk space
- Modern browser (Chrome, Firefox, Edge, Safari)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd weddingreplit
```

### 2. Install Dependencies
```bash
npm run setup
```

This command will:
- Install main project dependencies
- Install Directus CMS dependencies
- Set up the development environment

### 3. Configure Environment Variables
The `.env.development` file should already be configured with the following content:

```env
# Directus Configuration
DIRECTUS_URL=http://localhost:8055
DIRECTUS_TOKEN=dev-token
USE_DIRECTUS=true

# Meilisearch Configuration
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=dev-key

# Application Configuration
NODE_ENV=development
SITE_URL=http://localhost:8787

# Database Configuration
DB_PATH=.db/dev.db

# Cloudflare Configuration
CF_ACCOUNT_ID=your-account-id
CF_API_TOKEN=your-api-token

# Development Dashboard
DASHBOARD_PORT=3000
```

### 4. Start All Services
```bash
npm run dev:all
```

Or use the enhanced startup script:
```bash
node scripts/start-dev.js
```

This command starts:
- Directus CMS on http://localhost:8055
- Meilisearch on http://localhost:7700
- Development Dashboard on http://localhost:3000
- React application on http://localhost:8787

### 5. Create First Admin User
1. Open http://localhost:8055/admin in your browser
2. Click "Create Admin Account"
3. Fill in your admin credentials
4. Complete the setup wizard

## 🛠️ Development Workflow

### Starting Services Individually
If you prefer to start services separately:

```bash
# Start Directus CMS
npm run dev:directus

# Start Meilisearch
npm run dev:search

# Start Development Dashboard
npm run dev:dashboard

# Start React application
npm run pages:dev
```

### Accessing Admin Interfaces
- **Directus Admin**: http://localhost:8055/admin
- **Meilisearch Dashboard**: http://localhost:7700
- **Development Dashboard**: http://localhost:3000
- **Application**: http://localhost:8787

### Adding Sample Data
To populate your development environment with sample data:

```bash
# Seed with sample data
npm run seed

# Reset and reseed (clears existing data)
npm run seed:reset
```

### Testing the Invitation Generator
1. Navigate to http://localhost:8787/invitations
2. Select a template
3. Customize text, colors, and fonts
4. Save your invitation

## 🐳 Docker Development Setup

### Using Docker Compose
To start the entire development environment with Docker:

```bash
# Start all services
npm run docker:dev

# Build services
npm run docker:build

# Clean up containers and volumes
npm run docker:clean
```

### Docker Services
The Docker setup includes:
- **Directus** with SQLite database
- **Meilisearch** with persistent data
- **Redis** for caching
- **Main Application** with live reloading

### Docker Configuration
The `docker-compose.yml` file defines all services with proper volume mappings for persistent data.

## 📊 Development Dashboard

Access the development dashboard at http://localhost:3000 to monitor:

### Service Status Indicators
- Directus (running/stopped, URL, health check)
- Meilisearch (running/stopped, index status)
- React app (build status, hot reload)
- Cloudflare Workers (local dev server)

### Quick Access Links
- Directus admin interface
- Meilisearch admin
- API documentation
- Component Storybook

### Development Tools
- Database seeder buttons
- Cache clear buttons
- Log viewer
- Performance metrics

### Project Information
- Current branch and commit
- Environment variables status
- Recent changes log

## 🌱 Data Seeding

### Sample Data Seeder
The project includes a comprehensive data seeding system:

```bash
# Seed with sample data
npm run seed

# Reset and reseed
npm run seed:reset
```

### Seeding Content
- 50+ sample Goan wedding vendors (photographers, venues, caterers)
- 20+ invitation templates with preview images
- 10+ blog posts about Goan wedding traditions
- Vendor categories and tags

### Goan-Specific Data
- Beach venues (Baga, Calangute, Anjuna)
- Traditional venues (churches, temples)
- Local vendor names and phone numbers
- Goan wedding customs and traditions

### Demo Mode
Enable demo mode by setting `DEMO_MODE=true` in your environment variables to populate with:
- 100+ realistic vendor profiles
- 50+ invitation templates
- User interactions (views, likes, bookings)
- Sample wedding timelines

## 🧪 Testing & Quality Assurance

### Unit Tests
Run unit tests for components:
```bash
npm test
npm run test:watch
npm run test:coverage
```

### E2E Tests
Run end-to-end tests:
```bash
npm run test:e2e
```

### Test Coverage
The project includes:
- Unit tests for components (Invitation editor, Search components, Vendor listing, Admin dashboard)
- Integration tests for APIs (Directus connection, Meilisearch integration, Cloudflare Workers endpoints, WebSocket real-time features)
- E2E tests for user flows (Creating an invitation, Searching vendors, Booking process, Admin content management)

## ☁️ Production Deployment

### Deployment Automation
The project includes production deployment automation:

```bash
# Deploy to staging environment
npm run deploy:staging

# Deploy to production
npm run deploy:production

# Verify deployment health
npm run deploy:verify
```

### Environment-Specific Configs
- `wrangler.toml` for production
- Directus production config
- Meilisearch production setup

### Deployment Process
1. Deploy Directus to Railway/Render
2. Update Cloudflare Workers environment variables
3. Run data migration if needed
4. Verify all services are healthy

### Rollback Procedures
The deployment system includes rollback procedures and monitoring setup.

## 🔧 Troubleshooting

### Common Port Conflicts
If you see "port already in use" errors:

```bash
# On Windows
netstat -ano | findstr :8055
taskkill /PID <process-id> /F

# On macOS/Linux
lsof -i :8055
kill -9 <process-id>
```

### Database Connection Issues
If Directus can't connect to the database:
1. Check that the `.db` directory exists and is writable
2. Delete `.db/dev.db` and restart Directus to recreate the database
3. Ensure `DB_PATH` in your `.env` file is correct

### Permission Problems
If you encounter permission errors:
1. Run your terminal as administrator (Windows) or with sudo (macOS/Linux)
2. Ensure the project directory is owned by your user account
3. Check that Node.js and npm have proper permissions

### Cache Clearing
To clear various caches:

```bash
# Clear npm cache
npm cache clean --force

# Clear build cache
rm -rf dist/
rm -rf node_modules/.vite

# Clear Directus cache
# (In Directus admin interface: Settings > Caching > Clear Cache)
```

### Environment Variables Not Loading
If environment variables aren't being recognized:
1. Ensure your `.env.development` file is in the project root
2. Restart all services after making changes
3. Check that variable names match exactly (case-sensitive)

## 📁 Project Structure

```
weddingreplit/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   └── src/               # Source code
├── directus-cms/          # Directus CMS
├── server/                # Backend services
├── scripts/               # Utility scripts
├── shared/                # Shared code
├── __tests__/             # Test files
├── .db/                   # Database files
├── .env.development       # Environment variables
├── docker-compose.yml     # Docker configuration
├── Dockerfile             # Main app Dockerfile
├── Dockerfile.directus    # Directus Dockerfile
└── package.json           # Project dependencies and scripts
```

## 🔄 Development Commands

| Command | Description |
|---------|-------------|
| `npm run setup` | Install all dependencies |
| `npm run dev:all` | Start all development services |
| `npm run dev:directus` | Start Directus CMS only |
| `npm run dev:search` | Start Meilisearch only |
| `npm run dev:dashboard` | Start development dashboard |
| `npm run pages:dev` | Start React application |
| `npm run seed` | Add sample data |
| `npm run seed:reset` | Reset and reseed data |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run docker:dev` | Start Docker development environment |
| `npm run docker:build` | Build Docker images |
| `npm run docker:clean` | Clean Docker containers and volumes |
| `npm run deploy:staging` | Deploy to staging environment |
| `npm run deploy:production` | Deploy to production |
| `npm run deploy:verify` | Check deployment health |

## 🔐 Security Notes

- Never commit `.env` files to version control
- Use strong passwords for admin accounts
- Regularly update dependencies with `npm audit fix`
- Review access tokens and API keys periodically

## 🎯 Quick Start Commands

Once you've completed the setup, you can use these commands:

```bash
# First time setup
git clone <your-repo>
npm run setup

# Start development environment
npm run dev:all

# Seed with sample data
npm run seed

# Run tests
npm run test

# Deploy to production
npm run deploy:production
```

## 📊 Expected Startup Flow

After implementing these prompts:

1. Terminal 1: Directus starts at http://localhost:8055
2. Terminal 2: Meilisearch starts at http://localhost:7700
3. Terminal 3: Development Dashboard starts at http://localhost:3000
4. Terminal 4: React app starts at http://localhost:8787
5. Browser: Automatically opens with dev dashboard

Your wedding platform will be fully operational with sample data, ready for development and testing!

## 🆘 Getting Help

If you encounter issues not covered in this guide:

1. Check the console output for error messages
2. Review logs in the `.logs` directory
3. Search existing issues in the repository
4. Contact the development team for assistance

## 📅 Next Steps

After successful setup:
1. Familiarize yourself with the admin interfaces
2. Explore the sample data
3. Begin developing new features
4. Run the test suite to ensure everything works

Happy coding! 🎉