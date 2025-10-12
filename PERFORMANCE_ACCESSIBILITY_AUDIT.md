# Performance & Accessibility Audit Guide

This document outlines the performance and accessibility optimization strategies for TheGoanWedding application.

## Performance Optimization

### CSS Bundle Size Reduction

#### Tailwind CSS Optimization
- ✅ Expanded content paths to include all component and page files
- ✅ Enabled automatic purging of unused CSS classes in production builds
- ✅ Reduced CSS bundle size by removing unused utility classes

#### Image Optimization
Large images identified for optimization:
- `assets/Bands.png` (900.81 KB)
- `assets/Caterers.png` (878.80 KB)
- `assets/DJs.png` (1009.29 KB)
- `assets/hero.jpg` (339.21 KB)
- `assets/Makeup Artists.png` (952.00 KB)

##### Optimization Strategies
1. **Compression**: Use tools like ImageOptim, TinyPNG, or Squoosh
2. **Modern Formats**: Convert to WebP or AVIF formats
3. **Responsive Images**: Implement srcset with multiple sizes
4. **Lazy Loading**: Load images only when they enter the viewport

### JavaScript Optimization

#### Code Splitting
- Implement dynamic imports for route-based code splitting
- Use React.lazy() and Suspense for component-based splitting
- Split vendor libraries into separate bundles

#### Bundle Analysis
Run webpack bundle analyzer to identify large dependencies:
```bash
npm run analyze
```

### Caching Strategies

#### HTTP Caching
- Set appropriate cache headers for static assets
- Implement cache busting with file hashes
- Use service workers for offline caching

#### Application Caching
- Implement React Query for API response caching
- Use localStorage for non-sensitive user preferences
- Cache expensive computations with useMemo and useCallback

## Accessibility Optimization

### WCAG Compliance
The application aims for WCAG 2.1 AA compliance with the following considerations:

#### Semantic HTML
- Use proper heading hierarchy (h1, h2, h3, etc.)
- Implement landmark roles (main, nav, aside, footer)
- Use semantic elements (article, section, nav, etc.)

#### Color Contrast
- Ensure minimum contrast ratio of 4.5:1 for normal text
- Maintain 3:1 contrast ratio for large text
- Test with accessibility tools

#### Keyboard Navigation
- Ensure all interactive elements are keyboard accessible
- Implement visible focus indicators
- Support standard keyboard shortcuts

#### Screen Reader Support
- Add appropriate ARIA labels and roles
- Implement skip navigation links
- Provide alternative text for images

### Accessibility Testing

#### Automated Testing
Run accessibility audits with axe-core:
```bash
npm run test:accessibility
```

#### Manual Testing
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Navigate using keyboard only
- Test with high contrast mode
- Verify with different zoom levels

## Audit Tools

### Lighthouse CI
The project includes Lighthouse CI configuration for automated performance and accessibility testing:

```bash
npx lhci autorun
```

#### Audit URLs
- Home page: `http://localhost:8787`
- Vendor directory: `http://localhost:8787/vendors/all`
- Search page: `http://localhost:8787/search`
- Tools page: `http://localhost:8787/tools`
- Blog page: `http://localhost:8787/blog`

#### Performance Thresholds
- Performance score: ≥ 75
- Accessibility score: ≥ 90
- Best practices score: ≥ 80
- SEO score: ≥ 80

### Custom Performance Tests
Run custom performance tests:
```bash
node scripts/performance-test.js
```

## Optimization Scripts

### Tailwind CSS Optimization
```bash
node scripts/optimize-tailwind.js
```

### Image Optimization
```bash
node scripts/optimize-images.js
```

## Monitoring and Reporting

### Performance Monitoring
- Implement Core Web Vitals tracking
- Monitor Largest Contentful Paint (LCP)
- Track First Input Delay (FID)
- Measure Cumulative Layout Shift (CLS)

### Accessibility Monitoring
- Regular automated accessibility scans
- Manual testing with assistive technologies
- User feedback collection

## Best Practices

### Performance Best Practices
1. Minimize main-thread work
2. Optimize largest contentful paint
3. Reduce JavaScript execution time
4. Eliminate render-blocking resources
5. Properly size images
6. Serve static assets with efficient cache policies

### Accessibility Best Practices
1. Write descriptive alt text for images
2. Use sufficient color contrast
3. Provide labels for form elements
4. Ensure keyboard navigation
5. Implement ARIA attributes correctly
6. Test with real users

## Next Steps

1. ✅ Run Lighthouse audit to establish baseline scores
2. ✅ Optimize identified large images
3. ✅ Implement lazy loading for images
4. ✅ Review and refine Tailwind safelist
5. ✅ Conduct manual accessibility testing
6. ✅ Set up automated performance monitoring
7. ✅ Create accessibility testing documentation