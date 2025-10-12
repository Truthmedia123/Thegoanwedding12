# 🎛️ Admin Control Panel Guide

This guide provides step-by-step instructions for using the admin control panel of TheGoanWedding platform.

## 🔐 Getting Started

### 1. Admin Login
1. Navigate to `/login` in your browser
2. Use the default admin credentials:
   - **Email**: `admin@thegoanwedding.com`
   - **Password**: `admin123`
3. Click "Sign In" to access the admin dashboard

### 2. Dashboard Overview
The admin dashboard provides a comprehensive overview of your platform:
- **Key Metrics**: Total vendors, page views, contact clicks, invitations
- **Quick Actions**: Direct access to main admin functions
- **Recent Activity**: Latest system events and updates

## 📊 Vendor Management

### Adding a Single Vendor
1. Navigate to **Vendors** in the sidebar
2. Click **"Add Vendor"** button
3. Fill in the vendor information:
   - **Name**: Vendor business name
   - **Description**: Brief description of services
   - **Category**: Select from existing categories
   - **Location**: City or area (North Goa/South Goa)
   - **Address**: Full business address
   - **Contact Information**: Phone, email, website
   - **Price Range**: Budget-friendly pricing information
4. Click **"Create Vendor"** to save

### Bulk Import Vendors
1. Go to **Vendors** page
2. Click **"Import CSV"** button
3. Prepare your CSV file with these columns:
   ```
   name,description,category,location,address,phone,email,website,price_range,services
   ```
4. Upload the file and review the preview
5. Click **"Import"** to add all vendors

### Managing Existing Vendors
- **Search**: Use the search bar to find specific vendors
- **Filter**: Filter by category or location
- **Edit**: Click the edit icon to modify vendor information
- **Bulk Actions**: Select multiple vendors for bulk operations
- **Delete**: Remove vendors individually or in bulk

## 📈 Analytics Dashboard

### Understanding Analytics
The analytics dashboard tracks user engagement with your vendors:

#### Key Metrics
- **Total Views**: Number of vendor profile views
- **Contact Clicks**: Users clicking to contact vendors
- **Reviews**: Customer reviews submitted
- **Invitations**: Wedding invitations sent

#### Charts and Visualizations
- **Activity Over Time**: Line chart showing engagement trends
- **Event Types Distribution**: Pie chart of user actions
- **Top Performing Vendors**: List of most viewed vendors

#### Exporting Data
1. Select your desired time range (7 days, 30 days, 90 days)
2. Click **"Export"** to download analytics data as CSV
3. Use the data for business insights and reporting

### GA4 and Clarity Integration
- **Google Analytics 4**: Access advanced analytics and user behavior
- **Microsoft Clarity**: View heatmaps and user session recordings
- Configure tracking IDs in **Settings > Analytics**

## 📝 Blog Management

### Creating Blog Posts
1. Navigate to **Blogs** in the sidebar
2. Click **"New Post"** button
3. Fill in the post details:
   - **Title**: SEO-friendly blog post title
   - **Excerpt**: Brief description for previews
   - **Content**: Main blog post content
   - **Featured Image**: URL to featured image
   - **Tags**: Comma-separated tags for categorization
4. Choose publishing status:
   - **Draft**: Save for later editing
   - **Published**: Make immediately visible
5. Click **"Create Post"** to save

### Managing Blog Posts
- **View All Posts**: See all blog posts with status indicators
- **Search**: Find posts by title or content
- **Edit**: Click edit icon to modify existing posts
- **Publish/Unpublish**: Toggle visibility with the switch
- **Delete**: Remove posts permanently

### Blog SEO
- Use descriptive titles with relevant keywords
- Write compelling excerpts for social sharing
- Add relevant tags for better categorization
- Include featured images for visual appeal

## 💌 Invitations Management

### Viewing Invitations
1. Navigate to **Invitations** in the sidebar
2. See all wedding invitations with:
   - **Wedding ID**: Unique wedding identifier
   - **Guest Information**: Name, email, phone
   - **RSVP Status**: Accepted, Declined, or Pending
   - **Plus Ones**: Number of additional guests
   - **Dietary Requirements**: Special dietary needs

### Filtering and Search
- **Search**: Find invitations by guest name, email, or wedding ID
- **Status Filter**: Filter by RSVP status (Accepted/Declined/Pending)
- **Wedding Filter**: View invitations for specific weddings

### Exporting Data
1. Apply any desired filters
2. Click **"Export CSV"** button
3. Download includes all invitation data for analysis

### RSVP Analytics
- **Total Invitations**: Count of all invitations sent
- **Acceptance Rate**: Percentage of accepted invitations
- **Response Rate**: Percentage of guests who have responded

## ⚙️ Settings & Configuration

### General Settings
1. Navigate to **Settings** in the sidebar
2. Configure basic site information:
   - **Site Title**: Your platform's name
   - **Site Description**: Brief description for SEO
   - **Logo URL**: Link to your site logo
   - **Favicon URL**: Link to your favicon
   - **SEO Keywords**: Comma-separated keywords

### Theme Customization
1. Go to **Settings > Theme** tab
2. Customize your site's appearance:
   - **Primary Color**: Main brand color
   - **Secondary Color**: Secondary brand color
   - **Accent Color**: Accent color for highlights
3. Use the color picker or enter hex codes
4. Preview changes in the color preview section

### Analytics Configuration
1. Go to **Settings > Analytics** tab
2. Configure tracking services:
   - **Google Analytics Tracking ID**: Your GA4 measurement ID
   - **Microsoft Clarity Project ID**: Your Clarity project ID
3. Save settings to activate tracking

### Admin User Management
1. Go to **Settings > Admin Users** tab
2. **Add New Admin**:
   - Enter email address
   - Click "Add Admin" to send invitation
3. **Remove Admin Access**:
   - Click trash icon next to user
   - Confirm removal

## 🔒 Security Best Practices

### Password Security
- Change the default admin password immediately
- Use strong, unique passwords
- Consider enabling two-factor authentication

### User Access
- Regularly review admin user list
- Remove access for users who no longer need it
- Monitor login activity

### Data Protection
- Regular backups of your database
- Secure your Supabase project settings
- Monitor for unusual activity

## 📱 Mobile Administration

The admin panel is fully responsive and works on:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized layout with collapsible sidebar
- **Mobile**: Touch-friendly interface with mobile navigation

## 🆘 Troubleshooting

### Common Issues

#### Can't Access Admin Dashboard
- Verify you're using the correct login credentials
- Check if your account has admin role
- Clear browser cache and cookies

#### Analytics Not Tracking
- Verify tracking IDs are correctly configured
- Check if analytics events are being sent
- Review browser console for errors

#### Import Issues
- Ensure CSV format matches the template
- Check for special characters in data
- Verify file encoding (UTF-8 recommended)

#### Performance Issues
- Clear browser cache
- Check database connection
- Monitor server resources

### Getting Help
- Check the main README.md for technical details
- Review Supabase documentation for database issues
- Contact your development team for advanced troubleshooting

## 📚 Additional Resources

- **Main Documentation**: See README.md for technical setup
- **Supabase Docs**: https://supabase.com/docs
- **React Query**: https://tanstack.com/query/latest
- **Tailwind CSS**: https://tailwindcss.com/docs

---

**Note**: This admin panel is designed for non-technical users. All complex operations are handled automatically, and the interface provides clear guidance for each action.
