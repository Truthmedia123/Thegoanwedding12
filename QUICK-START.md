# 🚀 Quick Start Guide

Follow these simple steps to get TheGoanWedding platform up and running:

## Development Setup (First Time):

```bash
# 1. Clone and setup
git clone https://github.com/Truthmedia123/newapp
cd newapp
npm run setup

# 2. Start all services
npm run dev:all

# 3. Populate with demo data
npm run seed:demo

# 4. Open in browser
# Automatically opens: http://localhost:8787
```

## Your Services Will Start:

🎨 **Main App**: http://localhost:8787 (React + Cloudflare Pages)

⚙️ **Directus Admin**: http://localhost:8055 (Content Management)

🔍 **Meilisearch**: http://localhost:7700 (Search Engine)

📊 **Dev Dashboard**: http://localhost:3000 (Development Tools)

## 📋 What Happens When You Run These Commands:

1. **`npm run setup`** - Installs all dependencies for both the main project and Directus CMS
2. **`npm run dev:all`** - Starts all services simultaneously:
   - Directus CMS on port 8055
   - Meilisearch on port 7700
   - Development Dashboard on port 3000
   - React application on port 8787
3. **`npm run seed:demo`** - Populates the platform with realistic demo data including:
   - 100+ wedding vendor profiles
   - 50+ invitation templates
   - Sample blog posts
   - User interactions and reviews
4. **Browser Auto-Open** - Automatically opens all services in your default browser

## 🔧 Service Access Points:

- **Main Application**: http://localhost:8787
- **Directus Admin Panel**: http://localhost:8055/admin
- **Meilisearch Dashboard**: http://localhost:7700
- **Development Dashboard**: http://localhost:3000

## 🔄 Development Workflow:

After initial setup, you can use these commands for ongoing development:

```bash
# Start all services
npm run dev:all

# Start individual services
npm run dev:directus    # Directus only
npm run dev:search      # Meilisearch only
npm run dev:dashboard   # Development dashboard only
npm run pages:dev       # React app only

# Reset and reseed demo data
npm run seed:demo

# Run tests
npm test
```

## 🛠️ Troubleshooting:

If you encounter any issues:

1. **Port Conflicts**: Make sure ports 8055, 7700, 8787, and 3000 are available
2. **Dependency Issues**: Run `npm run setup` again
3. **Service Not Starting**: Check console output for error messages
4. **Data Not Loading**: Ensure all services are running before accessing the app

## 🎯 Next Steps:

After successful startup:
1. Explore the admin interfaces
2. Test the invitation generator
3. Try the enhanced search functionality
4. Review the demo data
5. Begin customizing for your needs

Happy coding! 🎉