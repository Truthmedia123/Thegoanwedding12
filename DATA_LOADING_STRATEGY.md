# TheGoanWedding - Data Loading Strategy

## Overview

TheGoanWedding uses a hybrid data loading approach that supports both dynamic API fetching and static JSON fallback. This ensures the application can work in different environments:

1. **Development Mode**: Uses Directus CMS API for live data
2. **Static Preview/Production**: Falls back to static JSON files when API is unavailable

## Data Sources

### 1. Directus CMS API (Primary)
- **URL**: `http://localhost:8055` (development) or configured production URL
- **Authentication**: Uses admin token from environment variables
- **Collections**:
  - `vendors` - Wedding vendor information
  - `blog_posts` - Wedding blog articles
  - `categories` - Vendor categories
  - `reviews` - Customer reviews
  - `site_settings` - Global site configuration

### 2. Static JSON Files (Fallback)
When the Directus API is unavailable, the application falls back to static JSON files:

- **Featured Vendors**: `/public/data/vendors.json`
- **Blog Posts**: `/public/data/blog.json`

## Implementation Details

### Query Client Configuration
The `queryClient.ts` file implements a dual approach:

1. **Primary Attempt**: Fetch data from Directus API using SDK
2. **Fallback**: If Directus fails, fetch from static JSON files

```typescript
// Example of the fallback logic
case "/api/vendors/featured":
  try {
    // Try Directus API first
    const featuredVendors = await getFeaturedVendors(6);
    return featuredVendors as unknown as T;
  } catch (directusError) {
    console.warn("Directus API failed, falling back to static data:", directusError);
    // Fallback to static JSON
    try {
      const staticVendors = await fetchStaticData<Vendor[]>('/data/vendors.json');
      return staticVendors.slice(0, 6) as unknown as T;
    } catch (staticError) {
      throw staticError;
    }
  }
```

### Environment Configuration

#### Development (.env.development)
```env
DIRECTUS_URL=http://localhost:8055
DIRECTUS_TOKEN=your-admin-token
USE_DIRECTUS=true
```

#### Production (wrangler.toml)
```toml
[vars]
DIRECTUS_URL = "http://localhost:8055"
DIRECTUS_TOKEN = "your-admin-token"
USE_DIRECTUS = "true"
```

## Static Data Structure

### Vendors JSON (/public/data/vendors.json)
```json
{
  "id": "string",
  "name": "string",
  "category": "string",
  "description": "string",
  "price_range": "string",
  "location": "string",
  "phone": "string",
  "email": "string",
  "website": "string",
  "profile_image_url": "string",
  "cover_image_url": "string",
  "gallery_image_urls": "string[]",
  "rating": "number",
  "reviews_count": "number",
  "featured": "boolean"
}
```

### Blog Posts JSON (/public/data/blog.json)
```json
{
  "id": "string",
  "title": "string",
  "slug": "string",
  "excerpt": "string",
  "content": "string",
  "featured_image": "string",
  "author": "string",
  "published_date": "string",
  "category": "string",
  "tags": "string[]",
  "created_at": "string",
  "updated_at": "string"
}
```

## Troubleshooting

### Common Issues

1. **"Data Loading Error" on Homepage**
   - Check if Directus CMS is running on port 8055
   - Verify environment variables are correctly set
   - Ensure static JSON files exist in `/public/data/`

2. **CORS Errors**
   - Configure Directus CORS settings to allow localhost origins
   - Check browser console for specific CORS error messages

3. **Static Data Not Loading**
   - Verify JSON file structure matches expected schema
   - Check browser network tab for 404 errors on JSON files

### Debugging Steps

1. **Check Browser Console**
   - Look for detailed error messages
   - Check network tab for failed API requests

2. **Verify Services**
   - Ensure Directus is running: `npm run dev:directus`
   - Check if static files are accessible: http://localhost:8787/data/vendors.json

3. **Test Fallback**
   - Stop Directus service and verify static fallback works
   - Check that homepage loads with static data

## Maintenance

### Adding New Static Data
1. Update `/public/data/vendors.json` with new vendor information
2. Update `/public/data/blog.json` with new blog posts
3. Ensure image URLs point to valid static assets

### Updating Directus Integration
1. Modify `directus.ts` to add new API endpoints
2. Update query keys in `queryClient.ts` to handle new data types
3. Test both API and static fallback paths

## Best Practices

1. **Always provide static fallback** for critical data
2. **Log detailed errors** to help with debugging
3. **Test both API and static paths** during development
4. **Keep static JSON structure consistent** with Directus schema
5. **Use environment variables** for API configuration