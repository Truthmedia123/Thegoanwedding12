#!/usr/bin/env node

/**
 * Production Smoke Test for TheGoanWedding
 * 
 * This script performs basic smoke tests to verify that the application
 * is functioning correctly in a production environment.
 * 
 * Tests include:
 * - Homepage loads correctly
 * - Critical pages are accessible
 * - Directus API is responsive
 * - Search functionality works
 * - Contact form submission
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  baseUrl: process.env.SMOKE_TEST_BASE_URL || 'http://localhost:5173',
  directusUrl: process.env.DIRECTUS_URL || 'http://localhost:8055',
  timeout: 10000 // 10 seconds
};

// Test results storage
const testResults = [];

/**
 * Sleep function for delays between tests
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Log test result
 */
function logResult(testName, status, message = '') {
  const result = {
    name: testName,
    status: status,
    message: message,
    timestamp: new Date().toISOString()
  };
  
  testResults.push(result);
  console.log(`[${status}] ${testName}${message ? `: ${message}` : ''}`);
}

/**
 * Test homepage accessibility
 */
async function testHomepage() {
  try {
    const response = await fetch(CONFIG.baseUrl, {
      timeout: CONFIG.timeout
    });
    
    if (response.ok) {
      logResult('Homepage Accessibility', 'PASS', `Status: ${response.status}`);
      return true;
    } else {
      logResult('Homepage Accessibility', 'FAIL', `Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logResult('Homepage Accessibility', 'FAIL', error.message);
    return false;
  }
}

/**
 * Test critical pages
 */
async function testCriticalPages() {
  const pages = [
    '/vendors',
    '/about',
    '/contact',
    '/privacy',
    '/terms'
  ];
  
  let allPassed = true;
  
  for (const page of pages) {
    try {
      const url = `${CONFIG.baseUrl}${page}`;
      const response = await fetch(url, {
        timeout: CONFIG.timeout
      });
      
      if (response.ok) {
        logResult(`Page Access - ${page}`, 'PASS', `Status: ${response.status}`);
      } else {
        logResult(`Page Access - ${page}`, 'FAIL', `Status: ${response.status}`);
        allPassed = false;
      }
      
      // Brief delay between requests
      await sleep(500);
    } catch (error) {
      logResult(`Page Access - ${page}`, 'FAIL', error.message);
      allPassed = false;
    }
  }
  
  return allPassed;
}

/**
 * Test Directus API connectivity
 */
async function testDirectusAPI() {
  try {
    const response = await fetch(`${CONFIG.directusUrl}/server/info`, {
      timeout: CONFIG.timeout
    });
    
    if (response.ok) {
      const data = await response.json();
      logResult('Directus API Connectivity', 'PASS', `Version: ${data.data?.version || 'Unknown'}`);
      return true;
    } else {
      logResult('Directus API Connectivity', 'FAIL', `Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logResult('Directus API Connectivity', 'FAIL', error.message);
    return false;
  }
}

/**
 * Test search functionality
 */
async function testSearchFunctionality() {
  try {
    // Simple search test - checking if search endpoint responds
    const response = await fetch(`${CONFIG.baseUrl}/api/search?q=test`, {
      timeout: CONFIG.timeout
    });
    
    // We're just checking if the endpoint responds, not validating results
    if (response.status === 200 || response.status === 400) {
      logResult('Search Endpoint Response', 'PASS', `Status: ${response.status}`);
      return true;
    } else {
      logResult('Search Endpoint Response', 'FAIL', `Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logResult('Search Endpoint Response', 'FAIL', error.message);
    return false;
  }
}

/**
 * Test contact form submission (basic validation)
 */
async function testContactForm() {
  try {
    // Test the contact form endpoint exists
    const response = await fetch(`${CONFIG.baseUrl}/api/contact`, {
      method: 'OPTIONS',
      timeout: CONFIG.timeout
    });
    
    if (response.ok || response.status === 405) {
      // 405 (Method Not Allowed) is acceptable as it means endpoint exists
      logResult('Contact Form Endpoint', 'PASS', `Status: ${response.status}`);
      return true;
    } else {
      logResult('Contact Form Endpoint', 'FAIL', `Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logResult('Contact Form Endpoint', 'FAIL', error.message);
    return false;
  }
}

/**
 * Generate test report
 */
function generateReport() {
  const passed = testResults.filter(r => r.status === 'PASS').length;
  const failed = testResults.filter(r => r.status === 'FAIL').length;
  const total = testResults.length;
  
  console.log('\n=== PRODUCTION SMOKE TEST REPORT ===');
  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success Rate: ${total > 0 ? Math.round((passed/total) * 100) : 0}%`);
  
  if (failed > 0) {
    console.log('\nFailed Tests:');
    testResults
      .filter(r => r.status === 'FAIL')
      .forEach(r => console.log(`  - ${r.name}: ${r.message}`));
  }
  
  // Save report to file
  const reportPath = path.join(__dirname, 'smoke-test-report.json');
  const reportData = {
    timestamp: new Date().toISOString(),
    summary: {
      total: total,
      passed: passed,
      failed: failed,
      successRate: total > 0 ? Math.round((passed/total) * 100) : 0
    },
    details: testResults
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  console.log(`\nDetailed report saved to: ${reportPath}`);
  
  return failed === 0; // Return true if all tests passed
}

/**
 * Main test execution
 */
async function runSmokeTests() {
  console.log('Starting Production Smoke Tests...');
  console.log(`Base URL: ${CONFIG.baseUrl}`);
  console.log(`Directus URL: ${CONFIG.directusUrl}\n`);
  
  // Run tests in sequence
  await testHomepage();
  await sleep(1000);
  
  await testCriticalPages();
  await sleep(1000);
  
  await testDirectusAPI();
  await sleep(1000);
  
  await testSearchFunctionality();
  await sleep(1000);
  
  await testContactForm();
  
  // Generate and display report
  const allPassed = generateReport();
  
  console.log('\n=== SMOKE TEST COMPLETE ===');
  if (allPassed) {
    console.log('✅ All smoke tests passed! Ready for production.');
    process.exit(0);
  } else {
    console.log('❌ Some smoke tests failed. Please review before production deployment.');
    process.exit(1);
  }
}

// Run the tests
runSmokeTests().catch(error => {
  console.error('Smoke test execution failed:', error);
  process.exit(1);
});