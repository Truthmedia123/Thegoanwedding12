# CI/CD Configuration Guide

This document outlines the required environment variables and secrets for the CI/CD pipeline.

## Required Secrets

The following secrets need to be configured in your GitHub repository settings:

### Cloudflare Secrets
- `CLOUDFLARE_API_TOKEN` - API token for Cloudflare deployment
- `CLOUDFLARE_ACCOUNT_ID` - Account ID for Cloudflare
- `GITHUB_TOKEN` - GitHub token for deployment and release creation

### Security Scanning Secrets
- `SNYK_TOKEN` - Token for Snyk security scanning
- `LHCI_GITHUB_APP_TOKEN` - Token for Lighthouse CI integration

### Notification Secrets
- `SLACK_WEBHOOK_URL` - Webhook URL for Slack notifications

## Environment Variables

### Directus Configuration
- `DIRECTUS_URL` - URL for the Directus CMS instance
- `DIRECTUS_TOKEN` - Authentication token for Directus API access

### Meilisearch Configuration
- `MEILISEARCH_HOST` - Host URL for Meilisearch instance
- `MEILISEARCH_API_KEY` - API key for Meilisearch

### Application Configuration
- `SITE_URL` - Base URL for the application
- `NODE_ENV` - Environment (development, staging, production)

## GitHub Actions Workflows

The project includes the following workflows:

1. **deploy.yml** - Basic deployment workflow
2. **enhanced-ci-cd.yml** - Comprehensive CI/CD pipeline with testing and security scanning
3. **audit.yml** - Accessibility and performance auditing

## Deployment Environments

### Staging
- Triggered on pushes to the `develop` branch
- Deploys to Cloudflare Workers staging environment

### Production
- Triggered on pushes to the `main` branch
- Deploys to Cloudflare Workers production environment
- Deploys to Cloudflare Pages
- Creates GitHub releases

## Manual Deployment Commands

### Build for Production
```bash
npm run build:production
```

### Deploy to Cloudflare Workers
```bash
npx wrangler deploy --env production
```

### Deploy to Cloudflare Pages
```bash
npm run deploy:pages
```

## Testing Commands

### Run Unit Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run End-to-End Tests
```bash
npm run test:e2e
```