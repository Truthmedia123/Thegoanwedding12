# Vendor Image Workflow

This document describes the workflow for managing vendor images in TheGoanWedding platform using static assets.

## Directory Structure

All vendor images are stored in the `/client/public/vendors/` directory with the following structure:

```
/client/public/vendors/
├── vendor-slug-1/
│   ├── profile.jpg
│   ├── cover.jpg
│   └── gallery/
│       ├── image1.jpg
│       ├── image2.jpg
│       └── image3.jpg
├── vendor-slug-2/
│   ├── profile.jpg
│   ├── cover.jpg
│   └── gallery/
│       ├── image1.jpg
│       └── image2.jpg
└── ...
```

## Image Preparation Process

### 1. Image Optimization
Before adding images to the repository, optimize them for web use:

1. Resize images to appropriate dimensions:
   - Profile images: 800x600px
   - Cover images: 1200x400px
   - Gallery images: 1200x800px

2. Compress images using tools like:
   - TinyPNG (https://tinypng.com)
   - ImageOptim
   - Squoosh

3. Convert to appropriate formats:
   - JPEG for photographs
   - PNG for graphics with transparency
   - WebP for modern browsers (with fallbacks)

### 2. Naming Convention
- Use descriptive filenames in lowercase with hyphens
- Example: `beach-wedding-ceremony.jpg`
- Avoid spaces and special characters

### 3. Vendor Slug Generation
Vendor slugs are generated from the vendor name:
- Convert to lowercase
- Replace spaces with hyphens
- Remove special characters
- Example: "Goa Wedding Photography" → "goa-wedding-photography"

## Adding New Vendor Images

### 1. Create Vendor Directory
```bash
mkdir client/public/vendors/{vendor-slug}
mkdir client/public/vendors/{vendor-slug}/gallery
```

### 2. Add Images
Place optimized images in the appropriate directories:
- `profile.jpg` - Main vendor profile image
- `cover.jpg` - Banner/cover image for vendor page
- Gallery images in the `gallery/` subdirectory

### 3. Update Vendor Data
In Directus CMS, update the vendor record with the correct image URLs:
- Profile Image: `/vendors/{vendor-slug}/profile.jpg`
- Cover Image: `/vendors/{vendor-slug}/cover.jpg`
- Gallery Images: JSON array of paths like:
  ```json
  [
    "/vendors/{vendor-slug}/gallery/image1.jpg",
    "/vendors/{vendor-slug}/gallery/image2.jpg"
  ]
```

## Image URL Structure

All vendor images are accessible via the following URL patterns:

- Profile Image: `https://yourdomain.com/vendors/{vendor-slug}/profile.jpg`
- Cover Image: `https://yourdomain.com/vendors/{vendor-slug}/cover.jpg`
- Gallery Images: `https://yourdomain.com/vendors/{vendor-slug}/gallery/{image-name}.jpg`

## CDN Benefits

Using static images served from Cloudflare Pages provides several benefits:
- Unlimited bandwidth
- Global CDN distribution
- Automatic image optimization
- No additional storage costs
- Fast loading times

## Deployment Process

1. Add new vendor images to the appropriate directories in `/client/public/vendors/`
2. Commit and push changes to GitHub
3. Deploy to Cloudflare Pages using `npm run deploy:pages`
4. Update vendor data in Directus CMS with correct image URLs
5. Verify images load correctly on the live site

## Best Practices

1. **Consistent Sizing**: Maintain consistent image dimensions for better layout
2. **File Size**: Keep individual images under 500KB for optimal loading
3. **Alt Text**: Ensure vendor data includes descriptive alt text for accessibility
4. **Backup**: Keep original high-resolution images in a separate backup location
5. **Versioning**: For major updates, consider versioning directory names

## Troubleshooting

### Images Not Loading
- Verify file paths in Directus match actual file locations
- Check file permissions (should be readable)
- Ensure filenames don't contain spaces or special characters

### Broken Layout
- Check that images match expected dimensions
- Verify aspect ratios are consistent within each image type

### Performance Issues
- Optimize image file sizes
- Consider implementing lazy loading for gallery images
- Use appropriate image formats (WebP with JPEG fallbacks)