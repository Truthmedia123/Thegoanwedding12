# Deployment Documentation

## Overview
This document outlines the deployment procedures, environments, and best practices for the TheGoanWedding platform.

## Deployment Architecture

### Cloudflare Stack
- **Cloudflare Workers**: Backend API and serverless functions
- **Cloudflare D1**: SQLite database
- **Cloudflare Pages**: Static asset hosting
- **Cloudflare R2**: Object storage (for future use)
- **Cloudflare Access**: Authentication (for future use)

### Environments
1. **Development**: Local development environment
2. **Staging**: Pre-production testing environment
3. **Production**: Live production environment

## Deployment Process

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Cloudflare account with Workers and Pages enabled
- Wrangler CLI installed globally

### Environment Setup

#### 1. Cloudflare Configuration
1. Create a Cloudflare account
2. Set up a D1 database:
   ```bash
   wrangler d1 create wedding_platform_db
   ```
3. Configure Pages project in Cloudflare dashboard
4. Add environment variables in Cloudflare dashboard

#### 2. Environment Variables
Required environment variables:
```bash
# Database
DATABASE_URL=your_cloudflare_d1_database_url

# Site Configuration
SITE_URL=https://thegoanwedding.com
NODE_ENV=production

# Cloudflare
CF_API_TOKEN=your_cloudflare_api_token
CF_ACCOUNT_ID=your_cloudflare_account_id

# Optional Features
GOOGLE_ADSENSE_ID=ca-pub-xxxxxxxxxxxxxxxx # For AdSense integration
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID     # For Analytics
```

### Build Process

#### 1. Install Dependencies
```bash
npm ci --legacy-peer-deps
```

#### 2. Build Application
```bash
# Development build
npm run build

# Production build
npm run build:production
```

#### 3. Verify Build Output
```bash
ls -la dist/
ls -la dist/public/
```

## Deployment Commands

### Development Deployment
```bash
# Start development server
npm run pages:dev

# Start Express development server
npm run dev
```

### Staging Deployment
```bash
# Build for staging
npm run build:production

# Deploy to staging environment
npm run deploy:staging
```

### Production Deployment
```bash
# Build for production
npm run build:production

# Deploy to production
npm run deploy:production
```

### Manual Deployment
```bash
# Deploy Workers
wrangler deploy --env production

# Deploy Pages
wrangler pages publish dist/public --project-name=thegoanwedding
```

## CI/CD Pipeline

### GitHub Actions Workflow
The deployment pipeline is automated through GitHub Actions:

1. **Code Quality Checks**: TypeScript, ESLint, Prettier
2. **Testing**: Unit, integration, accessibility, and performance tests
3. **Security Scanning**: Dependency vulnerability checks
4. **Staging Deployment**: Automatic deployment to staging
5. **Production Deployment**: Manual approval required

### Environment Branches
- **develop**: Staging environment deployment
- **main**: Production environment deployment

### Deployment Triggers
- Push to `develop` branch → Staging deployment
- Push to `main` branch → Production deployment (manual approval)
- Pull requests → Testing pipeline only

## Database Management

### Migrations
```bash
# Generate new migration
npx drizzle-kit generate

# Apply migrations locally
wrangler d1 migrations apply wedding_platform_db --local

# Apply migrations to production
wrangler d1 migrations apply wedding_platform_db
```

### Seeding
```bash
# Seed database with initial data
npm run db:seed
```

### Backup and Restore
```bash
# Export database (future implementation)
wrangler d1 export wedding_platform_db

# Import database (future implementation)
wrangler d1 import wedding_platform_db
```

## Monitoring and Logging

### Cloudflare Workers Dashboard
- Real-time logs
- Performance metrics
- Error tracking
- Usage analytics

### Custom Monitoring
- Google Analytics integration
- Performance monitoring with Lighthouse
- Error tracking with custom logging

### Health Checks
```bash
# API health check
curl https://thegoanwedding.com/api/health

# Database connectivity check
# Implemented in admin dashboard
```

## Rollback Procedures

### Version Control
- All deployments are version controlled through Git
- Tagged releases for easy rollback
- Semantic versioning (v1.0.0, v1.1.0, etc.)

### Rollback Steps
1. Identify the last stable deployment
2. Revert to the previous Git tag/commit:
   ```bash
   git checkout v1.2.3
   ```
3. Rebuild the application:
   ```bash
   npm run build:production
   ```
4. Deploy the previous version:
   ```bash
   npm run deploy:production
   ```

### Database Rollbacks
- D1 migrations support rollback operations
- Manual intervention may be required for data restoration
- Regular backups recommended for critical data

## Performance Optimization

### Caching Strategy
- Cloudflare CDN for static assets
- API response caching (15-minute cache for read-heavy endpoints)
- Browser caching headers

### Asset Optimization
- Image compression and optimization
- CSS and JavaScript minification
- Code splitting for faster loading

### Database Optimization
- Indexing for frequently queried fields
- Query optimization
- Connection pooling

## Security Considerations

### HTTPS
- Automatic HTTPS through Cloudflare
- HSTS headers for security
- SSL certificate management

### Headers
- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection

### Rate Limiting
- API rate limiting (100 requests per IP per hour)
- DDoS protection through Cloudflare

### Authentication
- Token-based admin authentication
- Secure token storage
- Regular token rotation

## Troubleshooting

### Common Deployment Issues

#### 1. Build Failures
```bash
# Clean build
rm -rf dist/
npm run build:production
```

#### 2. Deployment Errors
```bash
# Check Cloudflare logs
wrangler tail

# Verify environment variables
wrangler whoami
```

#### 3. Database Connection Issues
```bash
# Test database connectivity
wrangler d1 execute wedding_platform_db --command "SELECT 1;"
```

#### 4. Performance Issues
- Check Cloudflare Workers dashboard for errors
- Run Lighthouse audit for performance bottlenecks
- Review database query performance

### Support Resources
- Cloudflare Workers documentation
- GitHub Issues for platform-specific problems
- Community forums and support channels

## Best Practices

### Deployment Checklist
- [ ] Code review completed
- [ ] All tests passing
- [ ] Security scan completed
- [ ] Performance benchmarks met
- [ ] Accessibility requirements satisfied
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Rollback plan documented

### Version Management
- Use semantic versioning
- Tag releases in Git
- Document breaking changes
- Maintain changelog

### Environment Management
- Keep environments consistent
- Use environment-specific configuration
- Regular environment cleanup
- Monitor resource usage

## Future Enhancements

### Planned Improvements
- **Blue-Green Deployment**: Zero-downtime deployments
- **Canary Releases**: Gradual rollout strategy
- **Automated Rollbacks**: Error-based automatic rollback
- **Enhanced Monitoring**: Real-time alerting and dashboards
- **Multi-Region Deployment**: Global CDN optimization

### Scalability Considerations
- Horizontal scaling of Workers
- Database sharding for large datasets
- CDN optimization for global users
- Load testing for capacity planning

## Contact and Support

### Emergency Contacts
- Platform Maintainer: [your-email@example.com]
- Cloudflare Support: [Cloudflare Dashboard]

### Documentation
- Platform Documentation: README.md
- Admin Guide: ADMIN_WORKFLOW.md
- Testing Guide: TESTING.md
- API Documentation: API_DOCS.md (to be created)