#!/usr/bin/env node

import puppeteer from 'puppeteer';
import fs from 'fs/promises';

const BASE_URL = 'http://localhost:8787';
const PAGES_TO_TEST = [
  { path: '/', name: 'Home' },
  { path: '/vendors/all', name: 'All Vendors' },
  { path: '/search', name: 'Search' },
  { path: '/tools', name: 'Wedding Tools' },
  { path: '/blog', name: 'Blog' },

];

async function measurePagePerformance(page, url, pageName) {
  console.log(`📊 Testing ${pageName}: ${url}`);
  
  // Enable performance metrics collection
  await page.setCacheEnabled(false);
  
  const startTime = Date.now();
  
  // Navigate to page and wait for load
  const response = await page.goto(url, {
    waitUntil: 'networkidle0',
    timeout: 30000
  });
  
  const loadTime = Date.now() - startTime;
  
  // Get Core Web Vitals using browser APIs
  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const vitals = {};
        
        entries.forEach((entry) => {
          if (entry.entryType === 'paint') {
            if (entry.name === 'first-contentful-paint') {
              vitals.fcp = Math.round(entry.startTime);
            }
          }
          if (entry.entryType === 'largest-contentful-paint') {
            vitals.lcp = Math.round(entry.startTime);
          }
          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            vitals.cls = (vitals.cls || 0) + entry.value;
          }
        });
        
        // Also get navigation timing
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          vitals.domContentLoaded = Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
          vitals.loadEvent = Math.round(navigation.loadEventEnd - navigation.loadEventStart);
          vitals.ttfb = Math.round(navigation.responseStart - navigation.requestStart);
        }
        
        resolve(vitals);
      });
      
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
      
      // Fallback timeout
      setTimeout(() => resolve({}), 5000);
    });
  });
  
  // Check for JavaScript errors
  const errors = [];
  page.on('pageerror', (error) => {
    errors.push(error.message);
  });
  
  // Check response status
  const statusCode = response?.status() || 0;
  
  // Test accessibility basics
  const accessibilityIssues = await page.evaluate(() => {
    const issues = [];
    
    // Check for images without alt text
    const images = document.querySelectorAll('img:not([alt])');
    if (images.length > 0) {
      issues.push(`${images.length} images missing alt text`);
    }
    
    // Check for form inputs without labels
    const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    const inputsWithoutLabels = Array.from(inputs).filter(input => {
      const id = input.id;
      return !id || !document.querySelector(`label[for="${id}"]`);
    });
    if (inputsWithoutLabels.length > 0) {
      issues.push(`${inputsWithoutLabels.length} form inputs without proper labels`);
    }
    
    // Check for heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let hasH1 = false;
    headings.forEach(heading => {
      if (heading.tagName === 'H1') hasH1 = true;
    });
    if (!hasH1) {
      issues.push('Page missing H1 heading');
    }
    
    return issues;
  });
  
  return {
    pageName,
    url,
    loadTime,
    statusCode,
    ...metrics,
    errors,
    accessibilityIssues,
    timestamp: new Date().toISOString()
  };
}

async function runPerformanceTests() {
  console.log('🚀 Starting performance tests...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ]
  });
  
  const page = await browser.newPage();
  
  // Set viewport and user agent
  await page.setViewport({ width: 1200, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  
  const results = [];
  const summary = {
    totalPages: PAGES_TO_TEST.length,
    passedPages: 0,
    failedPages: 0,
    averageLoadTime: 0,
    issues: []
  };
  
  for (const pageConfig of PAGES_TO_TEST) {
    try {
      const url = `${BASE_URL}${pageConfig.path}`;
      const result = await measurePagePerformance(page, url, pageConfig.name);
      results.push(result);
      
      // Evaluate performance
      if (result.statusCode === 200) {
        summary.passedPages++;
      } else {
        summary.failedPages++;
        summary.issues.push(`${pageConfig.name}: HTTP ${result.statusCode}`);
      }
      
      // Check performance thresholds
      if (result.loadTime > 5000) {
        summary.issues.push(`${pageConfig.name}: Slow load time (${result.loadTime}ms)`);
      }
      
      if (result.fcp > 2000) {
        summary.issues.push(`${pageConfig.name}: Slow First Contentful Paint (${result.fcp}ms)`);
      }
      
      if (result.lcp > 4000) {
        summary.issues.push(`${pageConfig.name}: Slow Largest Contentful Paint (${result.lcp}ms)`);
      }
      
      if (result.cls > 0.1) {
        summary.issues.push(`${pageConfig.name}: High Cumulative Layout Shift (${result.cls})`);
      }
      
      if (result.errors.length > 0) {
        summary.issues.push(`${pageConfig.name}: ${result.errors.length} JavaScript errors`);
      }
      
      if (result.accessibilityIssues.length > 0) {
        summary.issues.push(`${pageConfig.name}: ${result.accessibilityIssues.join(', ')}`);
      }
      
      // Log results
      console.log(`✅ ${pageConfig.name}:`);
      console.log(`   Load Time: ${result.loadTime}ms`);
      console.log(`   Status: ${result.statusCode}`);
      if (result.fcp) console.log(`   FCP: ${result.fcp}ms`);
      if (result.lcp) console.log(`   LCP: ${result.lcp}ms`);
      if (result.cls) console.log(`   CLS: ${result.cls.toFixed(3)}`);
      if (result.errors.length > 0) console.log(`   ❌ Errors: ${result.errors.length}`);
      if (result.accessibilityIssues.length > 0) console.log(`   ♿ A11y Issues: ${result.accessibilityIssues.length}`);
      console.log('');
      
    } catch (error) {
      console.error(`❌ Failed to test ${pageConfig.name}:`, error.message);
      summary.failedPages++;
      summary.issues.push(`${pageConfig.name}: Test failed - ${error.message}`);
    }
  }
  
  await browser.close();
  
  // Calculate averages
  const validResults = results.filter(r => r.loadTime > 0);
  if (validResults.length > 0) {
    summary.averageLoadTime = Math.round(
      validResults.reduce((sum, r) => sum + r.loadTime, 0) / validResults.length
    );
    
    summary.averageFCP = Math.round(
      validResults.filter(r => r.fcp).reduce((sum, r) => sum + r.fcp, 0) / validResults.filter(r => r.fcp).length
    ) || null;
    
    summary.averageLCP = Math.round(
      validResults.filter(r => r.lcp).reduce((sum, r) => sum + r.lcp, 0) / validResults.filter(r => r.lcp).length
    ) || null;
    
    summary.averageCLS = Number(
      (validResults.filter(r => r.cls).reduce((sum, r) => sum + r.cls, 0) / validResults.filter(r => r.cls).length).toFixed(3)
    ) || null;
  }
  
  // Save detailed results
  const reportData = {
    summary,
    results,
    timestamp: new Date().toISOString(),
    environment: {
      baseUrl: BASE_URL,
      nodeVersion: process.version,
      platform: process.platform
    }
  };
  
  await fs.writeFile('performance-results.json', JSON.stringify(reportData, null, 2));
  
  // Print summary
  console.log('📊 Performance Test Summary:');
  console.log('='.repeat(50));
  console.log(`Pages Tested: ${summary.totalPages}`);
  console.log(`Passed: ${summary.passedPages}`);
  console.log(`Failed: ${summary.failedPages}`);
  console.log(`Average Load Time: ${summary.averageLoadTime}ms`);
  if (summary.averageFCP) console.log(`Average FCP: ${summary.averageFCP}ms`);
  if (summary.averageLCP) console.log(`Average LCP: ${summary.averageLCP}ms`);
  if (summary.averageCLS) console.log(`Average CLS: ${summary.averageCLS}`);
  
  if (summary.issues.length > 0) {
    console.log(`\n⚠️  Issues Found (${summary.issues.length}):`);
    summary.issues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue}`);
    });
  } else {
    console.log('\n✅ No performance issues found!');
  }
  
  console.log('\n📄 Detailed results saved to performance-results.json');
  
  return reportData;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runPerformanceTests()
    .then(() => {
      console.log('\n🎉 Performance testing completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Performance testing failed:', error);
      process.exit(1);
    });
}

export { runPerformanceTests };