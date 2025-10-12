# TheGoanWedding - Maintenance and Extension Guide

## Project Status: ✅ ACTIVE MAINTENANCE MODE

This guide provides comprehensive instructions for maintaining and extending TheGoanWedding as a fully free, static vendor directory with professional analytics.

## Current System Architecture Overview

### Core Components
1. **Static SPA**: Deployed on Cloudflare Pages with global CDN
2. **Image Management**: Static images in `/client/public/vendors/<vendor-slug>/`
3. **Content Management**: Directus CMS on free VPS (admin-only access)
4. **Analytics**: Umami analytics on same VPS as Directus
5. **Hosting**: Zero-cost deployment with Cloudflare Pages

### Key Technical Specifications
- Vendor images: Manually optimized, static CDN paths only
- No upload endpoints or dynamic gallery APIs
- Vendor data: Managed via Directus, references only static image URLs
- Analytics events: All five required events implemented and tracked
- Dashboards: Segmented by vendor, activity, and date

## Ongoing Maintenance Procedures

### 1. Vendor/Content Management Workflow

#### Adding a New Vendor
1. **Image Preparation**:
   - Optimize images to web-friendly sizes:
     - Profile: 800x600px
     - Cover: 1200x400px
     - Gallery: 1200x800px
   - Compress using tools like TinyPNG or Squoosh
   - Use descriptive filenames in lowercase with hyphens

2. **Directory Setup**:
   ```bash
   mkdir client/public/vendors/{vendor-slug}
   mkdir client/public/vendors/{vendor-slug}/gallery
   ```

3. **Image Placement**:
   - `profile.jpg` - Main vendor profile image
   - `cover.jpg` - Banner/cover image for vendor page
   - Gallery images in the `gallery/` subdirectory

4. **Directus CMS Update**:
   - Access Directus admin panel
   - Navigate to Vendors collection
   - Create vendor record with static image URLs:
     ```json
     {
       "profile_image_url": "/vendors/{vendor-slug}/profile.jpg",
       "cover_image_url": "/vendors/{vendor-slug}/cover.jpg",
       "gallery_image_urls": [
         "/vendors/{vendor-slug}/gallery/image1.jpg",
         "/vendors/{vendor-slug}/gallery/image2.jpg"
       ]
     }
     ```

5. **Deployment**:
   ```bash
   git add client/public/vendors/{vendor-slug}/
   git commit -m "Add images for {vendor-name}"
   git push origin main
   ```
   - Wait for Cloudflare Pages automatic deployment
   - Verify images load correctly on live site

#### Updating Existing Vendor Content
1. Replace images in existing vendor directory
2. Update vendor data in Directus CMS if needed
3. Commit and push changes to GitHub
4. Verify updates on live site after deployment

#### Removing Inactive Vendors
1. Archive vendor images to backup storage
2. Update vendor status to "inactive" in Directus
3. Remove vendor from featured listings if applicable
4. Commit documentation updates if needed

### 2. Analytics Monitoring and Optimization

#### Daily Monitoring Tasks
1. **Check Analytics Dashboard**:
   - Log into Umami dashboard
   - Review overall site traffic
   - Check vendor-specific performance
   - Monitor engagement metrics

2. **Verify Event Tracking**:
   - Confirm all five events are being tracked:
     - `vendor_page_view`
     - `rsvp_click`
     - `invitation_sent`
     - `vendor_contact_click`
     - `gallery_image_open`
   - Check for any tracking errors or gaps

#### Weekly Analytics Review
1. **Performance Analysis**:
   - Identify top-performing vendors
   - Analyze user engagement patterns
   - Review RSVP conversion rates
   - Monitor invitation sends and opens

2. **Segmentation Review**:
   - Filter by vendor categories
   - Analyze activity by date ranges
   - Compare performance across different time periods
   - Identify seasonal trends

#### Monthly Analytics Optimization
1. **Dashboard Updates**:
   - Add new custom metrics if needed
   - Update segmentation filters
   - Create new reports for specific insights
   - Archive old reports that are no longer relevant

2. **Data Insights Documentation**:
   - Document key findings and trends
   - Update README with insights for future admins
   - Share performance reports with stakeholders

### 3. Security Maintenance

#### Directus Security Audits
1. **User Access Review**:
   - Verify only authorized administrators have access
   - Review user roles and permissions quarterly
   - Remove access for departed team members
   - Update passwords regularly

2. **System Configuration Check**:
   - Verify `DIRECTUS_SECURITY_GUIDE.md` compliance
   - Check `config.production.js` settings
   - Ensure CORS is properly configured
   - Confirm rate limiting is enabled

3. **Vulnerability Scanning**:
   - Update Directus to latest stable version
   - Apply security patches to VPS OS
   - Scan for vulnerabilities in dependencies
   - Review firewall configurations

#### Frontend Security
1. **Code Review**:
   - Verify no sensitive credentials in frontend code
   - Check for exposed API endpoints
   - Review environment variable usage
   - Confirm no unauthorized analytics scripts

2. **Dependency Updates**:
   - Regularly update npm packages
   - Check for security vulnerabilities
   - Test updates in development environment
   - Apply critical security patches immediately

### 4. Performance Optimization

#### Image Optimization
1. **Periodic Image Review**:
   - Quarterly audit of vendor images
   - Remove unused or outdated images
   - Re-compress images if better compression available
   - Ensure consistent naming conventions

2. **CDN Performance**:
   - Monitor Cloudflare Pages performance
   - Check image loading times
   - Verify global CDN distribution
   - Optimize caching settings if needed

#### Code Performance
1. **Bundle Size Monitoring**:
   - Monitor JavaScript bundle sizes
   - Identify and remove unused code
   - Optimize component loading
   - Implement code splitting where beneficial

2. **Loading Performance**:
   - Monitor page load times
   - Optimize critical rendering path
   - Implement lazy loading for images
   - Minimize render-blocking resources

## Admin Onboarding Procedures

### New Administrator Setup
1. **Access Provisioning**:
   - Provide Directus admin credentials
   - Share Umami dashboard access
   - Grant VPS SSH access if needed
   - Provide GitHub repository access

2. **Documentation Handoff**:
   - Share all key documentation:
     - README.md
     - VENDOR_IMAGE_WORKFLOW.md
     - UMAMI_ANALYTICS_SETUP.md
     - DIRECTUS_SECURITY_GUIDE.md
     - MAINTENANCE_AND_EXTENSION_GUIDE.md
   - Walk through key workflows
   - Demonstrate analytics dashboard usage

3. **Training Sessions**:
   - Vendor addition/update process
   - Analytics monitoring procedures
   - Security audit checklists
   - Troubleshooting common issues

### Collaborator Onboarding
1. **Role-Based Access**:
   - Determine appropriate access levels
   - Create specific user roles in Directus
   - Provide read-only analytics access if needed
   - Limit access to only required systems

2. **Workflow Training**:
   - Content update procedures
   - Image optimization best practices
   - Analytics reporting requirements
   - Issue escalation processes

## Extension and Feature Development

### Adding New Analytics Events
1. **Event Planning**:
   - Identify new user interactions to track
   - Define event properties and values
   - Plan dashboard visualization
   - Document in analytics setup guide

2. **Implementation**:
   ```javascript
   // In component where event occurs
   if (typeof window !== 'undefined' && (window as any).umami) {
     (window as any).umami('new_event_name', { 
       property1: value1,
       property2: value2
     });
   }
   ```

3. **Dashboard Configuration**:
   - Add new custom metrics in Umami
   - Create relevant segmentation filters
   - Update documentation with new events
   - Test tracking implementation

### New Feature Development
1. **Feature Planning**:
   - Define requirements and scope
   - Assess impact on existing workflows
   - Plan integration with analytics
   - Create implementation timeline

2. **Development Process**:
   - Follow existing code patterns and structure
   - Implement proper error handling
   - Add analytics tracking for new interactions
   - Update documentation with new features

3. **Testing and Deployment**:
   - Test in development environment
   - Verify analytics tracking works
   - Update documentation
   - Deploy to production with proper versioning

### Technology Updates
1. **Framework Updates**:
   - Monitor React and related library updates
   - Test updates in staging environment
   - Apply non-breaking updates regularly
   - Plan for major version upgrades

2. **Infrastructure Updates**:
   - Keep Directus and Umami updated
   - Apply VPS OS security patches
   - Monitor Cloudflare Pages updates
   - Update deployment configurations as needed

## Audit and Cleanup Procedures

### Quarterly Code Audits
1. **Repository Cleanup**:
   - Remove unused code and dependencies
   - Delete legacy files and configurations
   - Update outdated documentation
   - Optimize file structure if needed

2. **Security Audits**:
   - Review all access credentials
   - Check for exposed sensitive data
   - Verify security configurations
   - Update security documentation

3. **Performance Audits**:
   - Analyze site performance metrics
   - Identify optimization opportunities
   - Review image optimization practices
   - Check CDN and hosting performance

### Annual Major Review
1. **Architecture Assessment**:
   - Evaluate current technology stack
   - Assess scalability requirements
   - Review hosting and infrastructure costs
   - Plan for future growth

2. **Documentation Update**:
   - Review all documentation for accuracy
   - Update outdated procedures
   - Add new best practices
   - Ensure non-technical language is maintained

3. **Process Improvement**:
   - Gather feedback from administrators
   - Identify bottlenecks in workflows
   - Implement process improvements
   - Update training materials

## Troubleshooting Common Issues

### Deployment Issues
1. **Build Failures**:
   - Check GitHub Actions logs
   - Verify all dependencies are available
   - Test build locally
   - Update build configurations if needed

2. **Cloudflare Pages Issues**:
   - Check deployment status
   - Verify custom domain configuration
   - Review Cloudflare error logs
   - Contact support if persistent issues

### Analytics Issues
1. **Tracking Not Working**:
   - Verify Umami script is loading
   - Check browser console for errors
   - Confirm event names match dashboard
   - Test in different browsers

2. **Dashboard Data Gaps**:
   - Check Umami service status
   - Verify database connectivity
   - Review tracking implementation
   - Check for filtering issues

### Directus Issues
1. **Admin Access Problems**:
   - Verify credentials and permissions
   - Check service status
   - Review authentication logs
   - Reset passwords if needed

2. **Data Sync Issues**:
   - Check API endpoint responses
   - Verify database connectivity
   - Review collection configurations
   - Check for rate limiting issues

## Emergency Procedures

### Service Downtime
1. **Immediate Response**:
   - Check service status (Directus, Umami, Cloudflare)
   - Review recent changes or deployments
   - Check server resources and logs
   - Implement temporary fixes if possible

2. **Recovery Process**:
   - Restore from latest backup if needed
   - Rollback recent changes if problematic
   - Communicate with users about downtime
   - Document incident and lessons learned

### Security Incidents
1. **Immediate Response**:
   - Change all access credentials
   - Review access logs for suspicious activity
   - Isolate affected systems
   - Notify relevant stakeholders

2. **Investigation and Recovery**:
   - Conduct security audit
   - Apply security patches
   - Implement additional security measures
   - Document incident and preventive measures

## Contact and Support Information

### Technical Support
- Directus Admin: [admin email/contact method]
- System Administrator: [VPS admin contact]
- Analytics Support: [Umami dashboard access]

### Documentation Updates
- Primary Maintainer: [maintainer contact]
- Documentation Repository: [GitHub repository link]
- Update Request Process: [procedure for documentation changes]

## Version History

### Current Version: 1.0
- Initial maintenance and extension guide
- Based on fully implemented system
- Includes all current workflows and procedures

### Update Schedule
- Quarterly reviews and updates
- Immediate updates for critical changes
- Annual major revision
- Continuous improvement based on feedback

---

This guide ensures TheGoanWedding continues to operate as a fully free, static vendor directory with professional analytics while maintaining security, performance, and ease of administration for future teams.