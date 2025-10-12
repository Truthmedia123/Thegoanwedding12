# Deployment Checklist

This checklist ensures a successful deployment of TheGoanWedding platform with the updated stack.

## Pre-Deployment Setup

### 1. Environment Configuration

- [ ] Create `.env.local` file with required variables:
  ```env
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
  VITE_GA_TRACKING_ID=G-XXXXXXXXXX
  VITE_CLARITY_PROJECT_ID=your-clarity-project-id
  ```

### 2. Supabase Setup

- [ ] Create new Supabase project
- [ ] Run database migration using `supabase-schema.sql`
- [ ] Verify all tables are created successfully
- [ ] Test database connection
- [ ] Set up Row Level Security (RLS) policies
- [ ] Insert sample data for testing

### 3. Analytics Setup

- [ ] Create Google Analytics 4 property
- [ ] Get GA4 Measurement ID (G-XXXXXXXXXX)
- [ ] Create Microsoft Clarity project
- [ ] Get Clarity Project ID
- [ ] Test analytics tracking in development

## Build Configuration

### 1. Vite Configuration

The build is configured in `vite.config.ts`:
- Root directory: `client/`
- Output directory: `dist/public/`
- Build command: `npm run build`

### 2. Build Command

```bash
npm run build
```

This will:
- Build the React application
- Bundle all assets
- Output to `dist/public/`
- Optimize for production

### 3. Build Verification

- [ ] Build completes without errors
- [ ] Output directory contains all necessary files
- [ ] Static assets are properly bundled
- [ ] Environment variables are correctly injected

## Cloudflare Pages Deployment

### 1. GitHub Repository Setup

- [x] Repository: `Thegoanwedding12`
- [x] Default branch: `main`
- [x] Repository is connected to Cloudflare Pages

### 2. Cloudflare Pages Integration

- [x] Connected GitHub repo `Thegoanwedding12` to Cloudflare Pages
- [x] Build command: `npm run build`
- [x] Output directory: `dist/public`
- [x] Framework preset: None/Other

### 3. Environment Variables

Set in Cloudflare Pages dashboard:
- [x] `VITE_SUPABASE_URL=https://tugciyungdydnwsqzwok.supabase.co`
- [x] `VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- [x] `VITE_GA_MEASUREMENT_ID=G-YBTQGR4T4Y`
- [x] `VITE_CLARITY_PROJECT_ID=tnghvs6g11`

### 4. Automatic Deployments

- [x] Enable "Deploy on push" in Cloudflare Pages
- [x] Every commit to main triggers automatic build and deployment

#### Deployment Workflow:
1. **Step 1**: Commit and push to main branch
2. **Step 2**: Cloudflare Pages auto-builds and deploys
3. **Step 3**: Verify deployment at https://thegoanwedding12.pages.dev

### 3. Custom Domain

- [ ] Add custom domain (thegoanwedding.com)
- [ ] Configure DNS records
- [ ] Enable SSL/TLS
- [ ] Test domain resolution

## Post-Deployment Verification

### 1. Application Functionality

- [ ] Homepage loads correctly
- [ ] Navigation works properly
- [ ] Search functionality works
- [ ] Vendor listings display
- [ ] Contact forms submit successfully
- [ ] Blog posts load correctly

### 2. Database Integration

- [ ] Supabase connection established
- [ ] Vendor data loads from database
- [ ] Search queries return results
- [ ] Categories display correctly
- [ ] Reviews system functional

### 3. Analytics Verification

- [ ] Google Analytics tracking active
- [ ] Microsoft Clarity recording sessions
- [ ] Page views tracked correctly
- [ ] Custom events firing properly

### 4. Performance Testing

- [ ] Page load times acceptable (<3s)
- [ ] Images load properly
- [ ] Search results return quickly
- [ ] Mobile responsiveness verified

## Security Checklist

### 1. Environment Variables

- [ ] No sensitive keys exposed in client code
- [ ] Supabase anon key properly configured
- [ ] Analytics IDs set correctly
- [ ] No hardcoded credentials

### 2. Database Security

- [ ] RLS policies enabled
- [ ] Public access limited appropriately
- [ ] Admin operations protected
- [ ] API rate limiting configured

### 3. Content Security

- [ ] HTTPS enforced
- [ ] Secure headers configured
- [ ] XSS protection enabled
- [ ] CSRF protection in place

## Monitoring Setup

### 1. Error Tracking

- [ ] Implement error boundary components
- [ ] Set up error logging
- [ ] Configure alerts for critical errors
- [ ] Monitor API response times

### 2. Performance Monitoring

- [ ] Set up Core Web Vitals tracking
- [ ] Monitor database query performance
- [ ] Track user engagement metrics
- [ ] Set up uptime monitoring

### 3. Analytics Dashboard

- [ ] Configure GA4 dashboards
- [ ] Set up Clarity heatmaps
- [ ] Create custom reports
- [ ] Set up conversion tracking

## Rollback Plan

### 1. Database Rollback

- [ ] Keep previous database backup
- [ ] Document rollback procedures
- [ ] Test rollback process
- [ ] Have migration scripts ready

### 2. Application Rollback

- [ ] Keep previous build artifacts
- [ ] Document deployment history
- [ ] Test rollback deployment
- [ ] Have emergency contacts ready

## Documentation Updates

### 1. Technical Documentation

- [ ] Update README.md with new stack
- [ ] Document new environment variables
- [ ] Update API documentation
- [ ] Create troubleshooting guide

### 2. User Documentation

- [ ] Update user guides
- [ ] Document new features
- [ ] Create FAQ section
- [ ] Update contact information

## Final Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] Team notified of deployment
- [ ] Monitoring alerts configured
- [ ] Support team briefed
- [ ] Go-live announcement prepared

## Emergency Contacts

- [ ] Development team contacts
- [ ] Hosting provider support
- [ ] Domain registrar support
- [ ] Analytics platform support

## Post-Launch Tasks

### Week 1
- [ ] Monitor error rates daily
- [ ] Check analytics data
- [ ] Gather user feedback
- [ ] Performance optimization

### Week 2
- [ ] Review security logs
- [ ] Analyze user behavior
- [ ] Plan feature improvements
- [ ] Update documentation

### Month 1
- [ ] Comprehensive performance review
- [ ] Security audit
- [ ] User satisfaction survey
- [ ] Roadmap planning