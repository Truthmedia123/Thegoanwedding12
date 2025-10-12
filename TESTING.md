# Testing Documentation

## Overview
This document outlines the testing strategy, procedures, and tools used in the TheGoanWedding platform to ensure quality, reliability, and performance.

## Testing Strategy

### Test Types
1. **Unit Testing**: Component and function testing
2. **Integration Testing**: API and database integration
3. **End-to-End Testing**: User workflow testing
4. **Accessibility Testing**: WCAG compliance
5. **Performance Testing**: Load time and Core Web Vitals
6. **Security Testing**: Vulnerability scanning

### Test Coverage Goals
- **Branches**: 70% minimum
- **Functions**: 70% minimum
- **Lines**: 70% minimum
- **Statements**: 70% minimum

## Testing Tools

### Unit Testing
- **Jest**: JavaScript testing framework
- **React Testing Library**: React component testing
- **ts-jest**: TypeScript support for Jest

### Accessibility Testing
- **axe-core**: Accessibility compliance checking
- **Lighthouse**: Comprehensive accessibility auditing

### Performance Testing
- **Lighthouse CI**: Performance benchmarking
- **Puppeteer**: Custom performance scripts
- **WebPageTest**: External performance validation

### Security Testing
- **npm audit**: Dependency vulnerability scanning
- **Snyk**: Security vulnerability detection

## Running Tests

### Unit Tests
```bash
# Run all unit tests
npm test

# Run tests with coverage report
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- client/src/components/Button.test.tsx

# Run tests matching pattern
npm test -- --testPathPattern=vendor
```

### Accessibility Tests
```bash
# Run accessibility audit
npx axe-cli http://localhost:8787

# Run Lighthouse accessibility audit
npx lhci autorun
```

### Performance Tests
```bash
# Run performance test script
node scripts/performance-test.js

# Run Lighthouse performance audit
npx lhci autorun
```

## Test Structure

### Client-Side Tests
```
client/src/
├── components/
│   ├── __tests__/
│   │   ├── Component.test.tsx
│   │   └── Component.test.tsx
│   └── Component/
│       └── __tests__/
│           └── Component.test.tsx
├── pages/
│   └── __tests__/
│       ├── Page.test.tsx
│       └── Page.test.tsx
└── hooks/
    └── __tests__/
        └── useHook.test.ts
```

### Server-Side Tests
```
server/
└── __tests__/
    ├── routes.test.ts
    ├── db.test.ts
    └── middleware.test.ts
```

### API Tests
```
__tests__/
└── api/
    └── endpoint.test.ts
```

## Writing Tests

### Component Tests
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import Component from '../Component';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    render(<Component />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('Updated Text')).toBeInTheDocument();
  });
});
```

### API Tests
```typescript
import { describe, it, expect } from '@jest/globals';
import { GET } from '../api/endpoint';

describe('API Endpoint', () => {
  it('should return expected data', async () => {
    const response = await GET({} as any);
    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toEqual(expectedData);
  });
});
```

### Database Tests
```typescript
import { describe, it, expect } from '@jest/globals';
import { getDb } from '../db';

describe('Database', () => {
  it('should connect successfully', () => {
    const db = getDb(mockEnv);
    expect(db).toBeDefined();
  });
});
```

## CI/CD Integration

### GitHub Actions Workflow
The testing pipeline runs automatically on:
- Every push to `main` and `develop` branches
- Every pull request to `main` branch

### Test Stages
1. **Code Quality**: TypeScript checking, linting
2. **Unit Tests**: Component and function tests
3. **Integration Tests**: API and database tests
4. **Accessibility Audit**: axe-core compliance
5. **Performance Audit**: Lighthouse benchmarks
6. **Security Scan**: Dependency vulnerability check

### Coverage Reporting
- Code coverage reports uploaded to Codecov
- Minimum coverage thresholds enforced
- Coverage diff comments on pull requests

## Test Data Management

### Mock Data
- Vendor data for component testing
- User data for authentication testing
- Database mocks for API testing

### Test Environments
- **Development**: Local testing with mock data
- **CI**: Automated testing with isolated environments
- **Staging**: Production-like testing with real data

## Performance Benchmarks

### Target Metrics
- **First Contentful Paint**: < 2000ms
- **Largest Contentful Paint**: < 4000ms
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 5000ms

### Monitoring
- Automated performance testing in CI/CD
- Weekly performance audits
- Performance regression detection

## Accessibility Standards

### Compliance Levels
- **WCAG 2.1 AA**: Minimum compliance
- **Section 508**: Government compliance
- **ARIA**: Proper labeling and roles

### Testing Tools
- **axe-core**: Automated accessibility testing
- **Lighthouse**: Comprehensive accessibility audit
- **Manual Testing**: Screen reader testing

## Security Testing

### Dependency Scanning
- **npm audit**: Built-in vulnerability detection
- **Snyk**: Advanced security scanning
- **Dependabot**: Automated dependency updates

### Best Practices
- Regular security audits
- Dependency update monitoring
- Vulnerability patching
- Security header validation

## Troubleshooting

### Common Issues
1. **Test Failures**: Check console output and stack traces
2. **Coverage Gaps**: Add missing test cases
3. **Mock Issues**: Verify mock implementations
4. **Async Problems**: Use proper async/await patterns
5. **Environment Issues**: Check test environment setup

### Debugging Tips
- Use `console.log` for debugging test failures
- Run tests in watch mode for faster iteration
- Use focused tests (`it.only`) for debugging specific cases
- Check test environment variables
- Verify mock data consistency

## Future Improvements

### Planned Enhancements
- **Visual Regression Testing**: Percy or Chromatic integration
- **Cross-Browser Testing**: BrowserStack or Sauce Labs
- **Load Testing**: Artillery or k6 integration
- **Contract Testing**: Pact for API contract validation
- **Mutation Testing**: Stryker for test quality measurement

### Automation Goals
- 90%+ test coverage
- Zero false positives in CI/CD
- Automated performance regression detection
- Real-time accessibility monitoring
- Continuous security scanning