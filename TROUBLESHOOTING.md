# 🛠️ Troubleshooting Guide

This guide will help you resolve issues with starting all services for TheGoanWedding development environment.

## 🎯 Current Status

✅ **React App (Cloudflare Pages)**: Running on http://localhost:8787

❌ **Directus CMS**: Not running (missing directus command)

❌ **Meilisearch**: Not running (missing meilisearch command)

✅ **Dev Dashboard**: Running on http://localhost:3000

## 🔧 Solution Steps

### 1. Install Directus Globally

Directus needs to be installed globally to run the `directus` command:

```bash
# Install Directus globally
npm install -g directus

# Verify installation
directus --version
```

### 2. Install Meilisearch

There are several ways to install Meilisearch:

#### Option A: Using npm (Recommended for Windows)
```bash
# Install meilisearch globally
npm install -g meilisearch

# Verify installation
meilisearch --version
```

#### Option B: Download Binary (Alternative)
1. Go to https://github.com/meilisearch/meilisearch/releases
2. Download the Windows binary for your architecture
3. Extract and add to your PATH

#### Option C: Using Docker (If Docker is installed)
```bash
# Run Meilisearch in Docker
docker run -p 7700:7700 -e MEILI_MASTER_KEY=masterKey -v $(pwd)/meilisearch/data:/meili_data getmeili/meilisearch:v1.8
```

### 3. Install Directus Dependencies Locally

Make sure all Directus dependencies are installed in the directus-cms directory:

```bash
# Navigate to directus-cms directory
cd directus-cms

# Install dependencies
npm install

# Go back to root directory
cd ..
```

### 4. Start All Services

After installing the required dependencies, start all services:

```bash
# Start all services
npm run dev:all
```

This will start:
- Directus CMS on port 8055
- Meilisearch on port 7700
- React app on port 8787
- Dev Dashboard on port 3000

### 5. Manual Service Start (If dev:all still fails)

If `npm run dev:all` still doesn't work, start services manually in separate terminals:

#### Terminal 1: Directus
```bash
cd directus-cms
npx directus start
```

#### Terminal 2: Meilisearch
```bash
meilisearch --http-addr localhost:7700
```

#### Terminal 3: React App
```bash
npm run pages:dev
```

#### Terminal 4: Dev Dashboard
```bash
npm run dev:dashboard
```

## 📋 Verification

After starting all services, verify they're running:

1. **Directus Admin**: http://localhost:8055/admin
2. **Meilisearch Dashboard**: http://localhost:7700
3. **Main Application**: http://localhost:8787
4. **Dev Dashboard**: http://localhost:3000

## 🔄 Alternative: Using Docker

If you have Docker installed, you can use the existing docker-compose setup:

```bash
# Start all services with Docker
npm run docker:dev
```

## 📞 Support

If you continue to experience issues:

1. Check that all required ports (8055, 7700, 8787, 3000) are available
2. Ensure Node.js 18+ is installed
3. Verify all environment variables in `.env.development` are correct
4. Check console output for specific error messages

## 🎉 Success

Once all services are running, you can:

1. Access the main application at http://localhost:8787
2. Manage content in Directus at http://localhost:8055/admin
3. Use search functionality powered by Meilisearch at http://localhost:7700
4. Monitor all services in the Dev Dashboard at http://localhost:3000
5. Populate demo data with `npm run seed:demo`

Happy coding! 🚀