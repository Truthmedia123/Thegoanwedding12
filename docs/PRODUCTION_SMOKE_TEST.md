# Production Smoke Test

This document explains how to run the production smoke test for TheGoanWedding application to verify that all critical functionalities work correctly in a production environment.

## Overview

The smoke test performs basic checks to ensure the application is functioning correctly after deployment. It tests:

1. Homepage accessibility
2. Critical pages accessibility
3. Directus API connectivity
4. Search functionality
5. Contact form endpoint

## Prerequisites

Before running the smoke test, ensure:

1. The application is deployed and accessible
2. All services (Directus, Meilisearch) are running
3. Environment variables are properly configured

## Running the Smoke Test

### Local Development Testing

```bash
# Navigate to project root
cd thegoanwedding

# Run the smoke test against local development server
npm run test:smoke
```

### Production Testing

```bash
# Set the base URL for your production environment
export SMOKE_TEST_BASE_URL=https://your-production-url.com
export DIRECTUS_URL=https://your-directus-url.com

# Run the smoke test
npm run test:smoke
```

Or on Windows:
```cmd
set SMOKE_TEST_BASE_URL=https://your-production-url.com
set DIRECTUS_URL=https://your-directus-url.com
npm run test:smoke
```

## Test Configuration

The smoke test can be configured using environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `SMOKE_TEST_BASE_URL` | Base URL of the application | `http://localhost:5173` |
| `DIRECTUS_URL` | URL of the Directus instance | `http://localhost:8055` |
| `TIMEOUT` | Request timeout in milliseconds | `10000` (10 seconds) |

## Test Results

The smoke test generates a detailed report in JSON format saved as `scripts/smoke-test-report.json`. The report includes:

- Timestamp of the test
- Summary of passed/failed tests
- Detailed results for each test
- Success rate percentage

## Interpreting Results

### All Tests Pass
If all tests pass, you'll see:
```
✅ All smoke tests passed! Ready for production.
```

### Some Tests Fail
If any tests fail, you'll see:
```
❌ Some smoke tests failed. Please review before production deployment.
```

Check the detailed report for specific failures and address them before proceeding with production deployment.

## Integration with CI/CD

The smoke test can be integrated into your CI/CD pipeline to automatically verify deployments:

```yaml
# Example GitHub Actions workflow
- name: Run Production Smoke Test
  run: |
    export SMOKE_TEST_BASE_URL=https://staging.thegoanwedding.com
    npm run test:smoke
```

## Manual Verification Checklist

In addition to automated smoke tests, manually verify these critical user flows:

1. [ ] User can browse vendors
2. [ ] User can search for vendors
3. [ ] User can submit contact form
4. [ ] Admin can access Directus dashboard
5. [ ] Images load correctly
6. [ ] All navigation links work
7. [ ] Mobile responsiveness
8. [ ] Performance is acceptable

## Troubleshooting

### Common Issues

1. **Timeout Errors**: Check if services are running and accessible
2. **404 Errors**: Verify URLs and routing configuration
3. **500 Errors**: Check server logs for application errors
4. **CORS Issues**: Ensure proper CORS configuration for API endpoints

### Debugging Tips

1. Check server logs for errors
2. Verify environment variables are correctly set
3. Test individual endpoints manually
4. Ensure all required services are running

## Customizing Tests

To add additional tests, modify `scripts/production-smoke-test.js`:

```javascript
// Add a new test function
async function testNewFeature() {
  // Implementation
}

// Call it in the main runSmokeTests function
await testNewFeature();
```

## Next Steps

After successful smoke test:

1. Monitor application performance
2. Check analytics for user engagement
3. Verify all integrations work correctly
4. Set up alerting for critical issues