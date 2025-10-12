# TheGoanWedding - Ongoing Maintenance Protocol

## Maintenance Status: ✅ ACTIVE

This document establishes the ongoing maintenance protocol for TheGoanWedding Vendor Directory and Analytics Platform to ensure stability, security, and continued cost-free operation.

## Current System Architecture Overview

### Zero-Cost Architecture Components
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

## Daily Maintenance Tasks

### Content Management Verification
- [ ] Verify new vendor content additions follow established workflow
- [ ] Confirm all images are properly optimized before committing
- [ ] Check that vendor data in Directus references correct static image URLs
- [ ] Monitor GitHub commits for proper documentation updates

### Analytics Monitoring
- [ ] Check Umami dashboard for proper event tracking
- [ ] Verify all five key events are firing correctly:
  - `vendor_page_view`
  - `rsvp_click`
  - `invitation_sent`
  - `vendor_contact_click`
  - `gallery_image_open`
- [ ] Review real-time analytics for any anomalies
- [ ] Document any tracking issues for investigation

### Security Checks
- [ ] Review Directus admin login attempts
- [ ] Check for any unauthorized access attempts
- [ ] Verify no sensitive credentials in recent commits
- [ ] Monitor VPS resource usage and performance

## Weekly Maintenance Tasks

### System Performance Review
- [ ] Analyze Cloudflare Pages deployment logs
- [ ] Check site performance metrics and loading times
- [ ] Review image loading performance from CDN
- [ ] Monitor Umami analytics service performance

### Documentation Updates
- [ ] Review all documentation for accuracy
- [ ] Update any procedures that have changed
- [ ] Add notes about recent issues or solutions
- [ ] Ensure all links and references are current

### Code Quality Assurance
- [ ] Run build process to verify no errors
- [ ] Check for any deprecated dependencies
- [ ] Review code for potential optimizations
- [ ] Remove any unused or commented-out code

## Monthly Maintenance Tasks

### Comprehensive Security Audit
- [ ] Review all Directus user accounts and permissions
- [ ] Update admin passwords and credentials
- [ ] Check VPS security patches and updates
- [ ] Review firewall configurations
- [ ] Audit access logs for suspicious activity

### Analytics Review and Optimization
- [ ] Analyze vendor performance data
- [ ] Review RSVP and invitation conversion rates
- [ ] Identify top-performing vendors and categories
- [ ] Update dashboard segments if needed
- [ ] Document insights for future reference

### Content Management Audit
- [ ] Review all vendor directories for organization
- [ ] Remove any outdated or deprecated vendor content
- [ ] Optimize images if better compression is available
- [ ] Verify all image paths are correct and accessible

### System Updates
- [ ] Update Directus CMS to latest stable version
- [ ] Update Umami analytics to latest version
- [ ] Apply VPS OS security patches
- [ ] Update npm dependencies with security fixes
- [ ] Test all updates in development environment first

## Quarterly Maintenance Tasks

### Architecture Review
- [ ] Verify continued compliance with zero-cost architecture
- [ ] Check for any new free services that could improve performance
- [ ] Review Cloudflare Pages features and optimizations
- [ ] Assess Directus and Umami configuration for improvements

### Documentation Audit
- [ ] Comprehensive review of all documentation
- [ ] Update any outdated procedures or workflows
- [ ] Add new best practices discovered during maintenance
- [ ] Ensure documentation is accessible to non-technical admins

### Performance Optimization
- [ ] Analyze site performance trends
- [ ] Optimize image delivery and caching
- [ ] Review build process for improvements
- [ ] Implement any identified optimizations

### Team Onboarding Review
- [ ] Update onboarding materials based on recent experiences
- [ ] Review training procedures for effectiveness
- [ ] Gather feedback from recent collaborators
- [ ] Improve documentation clarity and completeness

## Content Management Workflow

### Adding New Vendors
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

### Updating Existing Vendor Content
1. Replace images in existing vendor directory
2. Update vendor data in Directus CMS if needed
3. Commit and push changes to GitHub
4. Verify updates on live site after deployment

### Removing Inactive Vendors
1. Archive vendor images to backup storage
2. Update vendor status to "inactive" in Directus
3. Remove vendor from featured listings if applicable
4. Commit documentation updates if needed

## Analytics Monitoring and Management

### Event Tracking Verification
1. **Daily Check**:
   - Verify all five key events are firing
   - Check for any tracking errors
   - Document any anomalies

2. **Weekly Analysis**:
   - Review vendor performance data
   - Analyze user engagement patterns
   - Identify optimization opportunities

3. **Monthly Optimization**:
   - Update dashboard segments
   - Add new custom metrics if needed
   - Document insights and trends

### Dashboard Management
1. **Segmentation Maintenance**:
   - Ensure vendor segmentation is accurate
   - Update activity type filters
   - Verify date range functionality

2. **Report Generation**:
   - Create monthly performance reports
   - Generate vendor-specific analytics
   - Document key findings and insights

## Security Best Practices

### Access Control
1. **Directus Security**:
   - Regular review of admin user accounts
   - Immediate removal of departed team members
   - Strong password policies enforcement
   - Two-factor authentication implementation

2. **VPS Security**:
   - Regular security patch application
   - Firewall configuration review
   - SSH key management
   - Log monitoring and analysis

### Credential Management
1. **Environment Variables**:
   - No sensitive credentials in frontend code
   - Proper environment variable usage
   - Regular credential rotation
   - Secure storage of configuration files

2. **Documentation Security**:
   - No real credentials in documentation
   - Example values only in guides
   - Regular review of documentation content
   - Access control for documentation repositories

## Testing Procedures

### Pre-Deployment Testing
1. **Local Testing**:
   - Run `npm run dev` to test locally
   - Verify all components load correctly
   - Check image display and functionality
   - Test all interactive elements

2. **Analytics Testing**:
   - Verify all tracking events fire correctly
   - Check Umami dashboard for real-time data
   - Test different user interaction paths
   - Validate event properties and values

3. **Build Testing**:
   - Run `npm run build` to verify successful build
   - Check for any build errors or warnings
   - Verify built output contains all necessary files
   - Test built version locally if possible

### Post-Deployment Verification
1. **Live Site Testing**:
   - Verify all new content displays correctly
   - Check image loading from CDN
   - Test all interactive elements
   - Confirm analytics tracking on live site

2. **Analytics Verification**:
   - Check Umami dashboard for new data
   - Verify event tracking on live site
   - Confirm dashboard segments work correctly
   - Document any issues for follow-up

## Documentation Management

### Documentation Updates
1. **Content Changes**:
   - Update documentation with any workflow changes
   - Add notes about new features or procedures
   - Remove deprecated information
   - Ensure clarity for non-technical users

2. **Version Control**:
   - Commit documentation changes with code changes
   - Use descriptive commit messages
   - Review documentation during code reviews
   - Maintain documentation version history

### Collaboration and Onboarding
1. **New Team Member Onboarding**:
   - Provide comprehensive documentation links
   - Walk through key workflows and procedures
   - Grant appropriate access to systems
   - Schedule follow-up sessions for questions

2. **Collaborator Access**:
   - Provide role-appropriate documentation
   - Share relevant access credentials securely
   - Explain security best practices
   - Establish communication channels

## Emergency Procedures

### Service Downtime Response
1. **Immediate Actions**:
   - Check service status (Cloudflare, Directus, Umami)
   - Review recent deployments or changes
   - Check server resources and logs
   - Implement temporary fixes if possible

2. **Recovery Process**:
   - Restore from latest backup if needed
   - Rollback recent changes if problematic
   - Communicate with users about downtime
   - Document incident and lessons learned

### Security Incident Response
1. **Immediate Actions**:
   - Change all access credentials immediately
   - Review access logs for suspicious activity
   - Isolate affected systems
   - Notify relevant stakeholders

2. **Investigation and Recovery**:
   - Conduct comprehensive security audit
   - Apply necessary security patches
   - Implement additional security measures
   - Document incident and preventive measures

## Cost Management

### Zero-Cost Architecture Maintenance
1. **Service Verification**:
   - Regularly verify all services remain free
   - Monitor for any usage limits or restrictions
   - Check for any new paid features or services
   - Document any cost-related changes

2. **Architecture Compliance**:
   - Ensure no paid cloud storage is introduced
   - Verify no runtime uploads are implemented
   - Confirm all images remain in static public directory
   - Check that VPS usage stays within free tier limits

## Performance Monitoring

### Site Performance
1. **Loading Times**:
   - Monitor page load performance
   - Check image loading times from CDN
   - Optimize critical rendering path
   - Implement lazy loading where beneficial

2. **User Experience**:
   - Monitor mobile responsiveness
   - Check cross-browser compatibility
   - Review accessibility compliance
   - Gather user feedback on performance

### Resource Usage
1. **VPS Monitoring**:
   - Monitor CPU and memory usage
   - Check disk space utilization
   - Review network bandwidth usage
   - Optimize resource allocation

2. **Cloudflare Performance**:
   - Monitor CDN performance metrics
   - Check cache hit ratios
   - Review bandwidth usage
   - Optimize caching strategies

## Contact and Support Information

### Technical Support Contacts
- Directus Admin: [to be filled with current admin contact]
- System Administrator: [to be filled with VPS admin contact]
- Analytics Support: [to be filled with Umami dashboard access info]

### Documentation Updates
- Primary Maintainer: [to be filled with maintainer contact]
- Documentation Repository: [to be filled with repository link]
- Update Request Process: [to be filled with procedure]

## Version History

### Current Version: 1.0
- Initial maintenance protocol establishment
- Based on fully implemented system
- Includes all current workflows and procedures

### Update Schedule
- Monthly reviews and updates
- Immediate updates for critical changes
- Quarterly major revisions
- Continuous improvement based on feedback

---

This protocol ensures TheGoanWedding continues to operate as a stable, secure, and cost-free vendor directory platform while maintaining professional analytics capabilities and ease of administration.