# Admin-Only Workflow Guide

## Overview
This wedding platform is configured for admin-only vendor management to maintain quality control and prevent spam submissions.

## Admin Access

### 1. Admin Dashboard
- **URL**: `/admin/dashboard?token=admin-secret-6501fa0f`
- **Features**: Overview, vendor management, data import, system settings
- **Security**: Token-based authentication (change the token in production)

### 2. Directus CMS
- **URL**: `/admin` (redirects to Directus instance)
- **Access**: Admin credentials required
- **Features**: Content management, vendor profiles, blog posts

## Vendor Management Workflow

### Option 1: Directus CMS (Recommended)
1. Go to the Directus admin URL (configured in environment)
2. Navigate to "Vendors" collection
3. Create new vendor profiles with all required fields including social media links
4. Use draft mode to review before publishing
5. All changes are stored in the database

### Option 2: CSV Import
1. Prepare CSV file using the template in `scripts/vendor-template.csv` (now includes social media fields)
2. Use the admin dashboard import feature, or
3. Run command line import: `npm run import:vendors path/to/vendors.csv`

### Option 3: Manual Entry
1. Use the admin dashboard form to add vendors manually
2. Includes fields for social media URLs and embedded content
3. Real-time validation and preview

## CSV Format (Updated)
```csv
name,category,description,phone,email,whatsapp,location,address,website,instagram,facebook,services,price_range,featured,verified,facebookUrl,instagramUrl,linkedinUrl,twitterUrl,embedCode
"Vendor Name","photographers","Description","+91 9876543210","email@example.com","+91 9876543210","Location","Address","https://website.com","@instagram","facebook","Service1;Service2","₹25,000 - ₹50,000",true,true,"https://facebook.com/vendor","https://instagram.com/vendor","https://linkedin.com/vendor","https://twitter.com/vendor","<blockquote class='instagram-media'>...</blockquote>"
```

## Security Features

### Disabled Public Endpoints
- `POST /api/business-submissions` - Commented out
- All vendor creation APIs are admin-only

### CMS Configuration
- Admin-only access to content management
- Database storage for all content
- Role-based access control

### Admin Authentication
- Token-based access to admin dashboard
- Directus admin authentication
- All changes tracked in database

### API Protection
- Rate limiting on all endpoints (100 requests per IP per hour)
- Caching for read-heavy endpoints (15-minute cache)
- Authentication required for write operations

## Deployment Workflow

### Local Development
```bash
npm run pages:dev  # Start development server
npm run db:push    # Apply database migrations
```

### Production Deployment
```bash
npm run build:production  # Build for production
npm run deploy:production # Deploy to Cloudflare
```

### Database Management
```bash
wrangler d1 migrations apply wedding_platform_db --local  # Local
wrangler d1 migrations apply wedding_platform_db          # Production
```

## Content Management

### Adding Vendors
1. **CMS Method**: Use Directus CMS interface
2. **CSV Method**: Import via admin dashboard (supports social media fields)
3. **Manual Method**: Use admin dashboard form with social media and embed fields
4. **Script Method**: Modify seed script and run

### Updating Vendors
1. Edit through Directus CMS
2. Changes go through draft → review → publish workflow
3. All changes are stored in database

### Blog Posts
1. Create through Directus CMS
2. Use markdown for content
3. Add featured images and metadata

## Monitoring

### Admin Dashboard Features
- Vendor count overview
- Database status monitoring
- System health checks
- Quick action buttons
- Analytics dashboard with user engagement metrics

### Analytics
- Google Analytics integration
- Performance monitoring
- Error tracking
- User engagement metrics (wishlist, recently viewed, comparisons)

### Testing & Quality Assurance
- Automated testing pipeline
- Code coverage reporting (>70% coverage)
- Accessibility audits
- Performance benchmarks

## Best Practices

### Vendor Quality Control
- Verify all contact information
- Check social media links
- Ensure high-quality images
- Review service descriptions
- Validate embedded content

### Content Guidelines
- Use consistent formatting
- Optimize images for web
- Write SEO-friendly descriptions
- Maintain brand consistency
- Include social media handles

### Security
- Change admin token regularly
- Use strong passwords for CMS
- Monitor for unauthorized access
- Keep dependencies updated
- Review access logs regularly

## Troubleshooting

### Common Issues
1. **CMS Access**: Check Directus admin credentials
2. **Import Errors**: Verify CSV format matches template (including new social media fields)
3. **Deployment Issues**: Check Cloudflare Workers logs
4. **Database Errors**: Verify migration status
5. **Rate Limiting**: Check API usage patterns
6. **Caching Issues**: Clear cache or wait for expiration

### Support
- Check Cloudflare Workers dashboard for logs
- Review database for content changes
- Use admin dashboard for system status
- Monitor performance metrics
- Check testing reports for failures

## Future Enhancements
- Automated vendor verification
- Bulk import from external sources
- Advanced analytics dashboard
- Automated content moderation
- Multi-admin support with role-based access
- Enhanced social media integration
- AI-powered vendor recommendations

## Testing Procedures

### Running Tests
```bash
npm test                          # Run all tests
npm test -- --coverage            # Run tests with coverage report
npm test -- client/src/components # Run specific component tests
npm test -- server/__tests__      # Run server tests
```

### CI/CD Pipeline
- Automated testing on every push
- Code quality checks
- Security scanning
- Performance auditing
- Accessibility compliance checking

### Test Coverage Requirements
- Minimum 70% coverage for branches, functions, lines, and statements
- Component testing for all UI elements
- API endpoint testing
- Database integration testing
- Accessibility compliance testing