# Domain Connection Guide for TheGoanWedding

## Overview
This guide explains how to connect your custom domain to your TheGoanWedding website. The project is configured to work with Cloudflare Pages, which makes domain connection straightforward.

## Prerequisites
1. A domain name (e.g., yourwedding.com)
2. A Cloudflare account
3. Access to your domain's DNS settings

## Configuration Updates Made
The following files have been updated in your project to prepare for domain connection:

1. `.env` - Updated SITE_URL to use HTTPS
2. `wrangler.toml` - Contains domain configuration for different environments

## Steps to Connect Your Domain

### Step 1: Update Configuration Files
Replace the placeholder domain in the following locations:

1. In `.env` file:
   ```
   SITE_URL=https://thegoanwedding.com
   ```
   Change to your actual domain:
   ```
   SITE_URL=https://yourwedding.com
   ```

2. In `wrangler.toml` file, the [env.production.vars] section already has:
   ```
   SITE_URL = "https://thegoanwedding.com"
   ```
   You can update this to your custom domain if desired.

### Step 2: Configure Domain in Cloudflare Dashboard
1. Log in to your Cloudflare account
2. Navigate to the Pages section
3. Select your "thegoanwedding" project
4. Go to "Custom domains" settings
5. Click "Add custom domain"
6. Enter your domain name (e.g., yourwedding.com)
7. Follow the DNS configuration instructions provided by Cloudflare

### Step 3: DNS Configuration
Cloudflare will typically ask you to:

1. Add a CNAME record pointing your domain to your Cloudflare Pages subdomain
2. For www subdomain, add another CNAME record
3. For apex domain (yourwedding.com without www), you may need to use an A record or CNAME flattening

Example DNS records:
```
Type    Name    Content                          TTL     Proxy Status
CNAME   www     thegoanwedding.pages.dev         Auto    Proxied
CNAME   @       thegoanwedding.pages.dev         Auto    Proxied
```

### Step 4: SSL Certificate
Cloudflare automatically provisions SSL certificates for your custom domain:
1. Wait for DNS propagation (usually a few minutes to a few hours)
2. Cloudflare will automatically issue and deploy an SSL certificate
3. Your site will be accessible via HTTPS

### Step 5: Environment Variables
In the Cloudflare Pages dashboard, add these environment variables:
1. Go to your project settings
2. Navigate to "Environment variables"
3. Add:
   - `NODE_ENV` = `production`
   - `SITE_URL` = `https://yourwedding.com` (your actual domain)

### Step 6: Deploy Your Site
After DNS propagation and SSL certificate issuance:
1. Run `npm run build:production` to build your site
2. Run `npm run pages:deploy` to deploy to Cloudflare Pages
3. Your site will be available at your custom domain

## Verification
After completing the above steps:
1. Visit https://yourwedding.com in your browser
2. Check that the site loads correctly
3. Verify the SSL certificate is working (padlock icon in browser)
4. Test all functionality including forms and API endpoints

## Troubleshooting
If your domain isn't working:

1. **DNS Issues**:
   - Verify DNS records are correctly set
   - Use `dig yourwedding.com` or online tools to check DNS propagation
   - Wait up to 24 hours for DNS changes to propagate globally

2. **SSL Issues**:
   - Check Cloudflare's SSL/TLS settings
   - Ensure SSL is set to "Full" or "Full (strict)" mode
   - Check for any conflicting DNS settings

3. **Site Not Loading**:
   - Verify the latest deployment completed successfully
   - Check Cloudflare Pages build logs for errors
   - Ensure environment variables are correctly set

## Additional Considerations

### Email Setup
If you want to use email addresses with your domain (e.g., info@yourwedding.com):
1. Set up email forwarding through Cloudflare or your domain registrar
2. Or use a third-party email service like Google Workspace or Zoho Mail

### Performance Optimization
1. Enable Cloudflare's Auto Minify for CSS, JavaScript, and HTML
2. Enable Brotli compression
3. Configure caching rules for static assets
4. Enable Cloudflare's Argo Smart Routing for better global performance

### Security
1. Enable Cloudflare's WAF (Web Application Firewall)
2. Set up rate limiting to prevent abuse
3. Enable Bot Fight Mode to reduce bot traffic
4. Configure security headers through Cloudflare

## Support
If you encounter issues:
1. Check the Cloudflare documentation
2. Review the project's DEPLOYMENT.md file
3. Contact Cloudflare support for DNS/SSL issues
4. Consult the project README for technical details

Remember to replace "yourwedding.com" with your actual domain name throughout this process.