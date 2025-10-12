# TheGoanWedding Development Setup Guide

This guide will help you set up the complete development environment for TheGoanWedding project.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
- **Git** - Download from [git-scm.com](https://git-scm.com/)
- **Meilisearch** - Install via package manager or download from [meilisearch.com](https://www.meilisearch.com/)

### Required Ports
Make sure these ports are available on your system:
- `8055` - Directus CMS
- `7700` - Meilisearch
- `8787` - React application
- `3000` - Development dashboard (optional)

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
Create a `.env.development` file in the project root with the following content:

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
```

### 4. Start All Services
```bash
npm run dev:all
```

This command starts:
- Directus CMS on http://localhost:8055
- Meilisearch on http://localhost:7700
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

# Start React application
npm run pages:dev
```

### Accessing Admin Interfaces
- **Directus Admin**: http://localhost:8055/admin
- **Meilisearch Dashboard**: http://localhost:7700
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
└── .env.development       # Environment variables
```

## 🔄 Development Commands

| Command | Description |
|---------|-------------|
| `npm run setup` | Install all dependencies |
| `npm run dev:all` | Start all development services |
| `npm run dev:directus` | Start Directus CMS only |
| `npm run dev:search` | Start Meilisearch only |
| `npm run pages:dev` | Start React application |
| `npm run seed` | Add sample data |
| `npm run seed:reset` | Reset and reseed data |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |

## 🔐 Security Notes

- Never commit `.env` files to version control
- Use strong passwords for admin accounts
- Regularly update dependencies with `npm audit fix`
- Review access tokens and API keys periodically

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