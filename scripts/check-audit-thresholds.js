#!/usr/bin/env node

import fs from 'fs/promises';

const THRESHOLDS = {
  performance: {
    loadTime: 5000,      // Max load time in ms
    fcp: 2000,           // First Contentful Paint
    lcp: 4000,           // Largest Contentful Paint
    cls: 0.1,            // Cumulative Layout Shift
    tbt: 300,            // Total Blocking Time
    tti: 5000            // Time to Interactive
  },
  accessibility: {
    maxViolations: 0,    // Maximum acceptable violations
    criticalViolations: 0 // Critical/serious violations
  },
  seo: {
    minScore: 90         // Minimum SEO score
  }
};

async function checkAuditThresholds() {
  console.log('🎯 Checking audit results against thresholds...');
  
  let hasFailures = false;
  const failures = [];
  const warnings = [];
  
  // Check performance results
  try {
    const performanceData = await fs.readFile('performance-results.json', 'utf8');
    const perfResults = JSON.parse(performanceData);
    
    console.log('\n📊 Performance Threshold Check:');
    console.log('='.repeat(40));
    
    // Check average load time
    if (perfResults.summary.averageLoadTime > THRESHOLDS.performance.loadTime) {
      const failure = `Average load time (${perfResults.summary.averageLoadTime}ms) exceeds threshold (${THRESHOLDS.performance.loadTime}ms)`;
      failures.push(failure);
      console.log(`❌ ${failure}`);
      hasFailures = true;
    } else {
      console.log(`✅ Average load time: ${perfResults.summary.averageLoadTime}ms (threshold: ${THRESHOLDS.performance.loadTime}ms)`);
    }
    
    // Check First Contentful Paint
    if (perfResults.summary.averageFCP && perfResults.summary.averageFCP > THRESHOLDS.performance.fcp) {
      const failure = `Average FCP (${perfResults.summary.averageFCP}ms) exceeds threshold (${THRESHOLDS.performance.fcp}ms)`;
      failures.push(failure);
      console.log(`❌ ${failure}`);
      hasFailures = true;
    } else if (perfResults.summary.averageFCP) {
      console.log(`✅ Average FCP: ${perfResults.summary.averageFCP}ms (threshold: ${THRESHOLDS.performance.fcp}ms)`);
    }
    
    // Check Largest Contentful Paint
    if (perfResults.summary.averageLCP && perfResults.summary.averageLCP > THRESHOLDS.performance.lcp) {
      const failure = `Average LCP (${perfResults.summary.averageLCP}ms) exceeds threshold (${THRESHOLDS.performance.lcp}ms)`;
      failures.push(failure);
      console.log(`❌ ${failure}`);
      hasFailures = true;
    } else if (perfResults.summary.averageLCP) {
      console.log(`✅ Average LCP: ${perfResults.summary.averageLCP}ms (threshold: ${THRESHOLDS.performance.lcp}ms)`);
    }
    
    // Check Cumulative Layout Shift
    if (perfResults.summary.averageCLS && perfResults.summary.averageCLS > THRESHOLDS.performance.cls) {
      const failure = `Average CLS (${perfResults.summary.averageCLS}) exceeds threshold (${THRESHOLDS.performance.cls})`;
      failures.push(failure);
      console.log(`❌ ${failure}`);
      hasFailures = true;
    } else if (perfResults.summary.averageCLS) {
      console.log(`✅ Average CLS: ${perfResults.summary.averageCLS} (threshold: ${THRESHOLDS.performance.cls})`);
    }
    
    // Check failed pages
    if (perfResults.summary.failedPages > 0) {
      const failure = `${perfResults.summary.failedPages} pages failed to load properly`;
      failures.push(failure);
      console.log(`❌ ${failure}`);
      hasFailures = true;
    } else {
      console.log(`✅ All ${perfResults.summary.totalPages} pages loaded successfully`);
    }
    
    // Check performance issues
    if (perfResults.summary.issues.length > 0) {
      console.log(`\n⚠️  Performance Issues Found (${perfResults.summary.issues.length}):`);
      perfResults.summary.issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`);
        
        // Categorize issues
        if (issue.includes('Slow load time') || issue.includes('JavaScript errors')) {
          failures.push(issue);
          hasFailures = true;
        } else {
          warnings.push(issue);
        }
      });
    }
    
  } catch (error) {
    console.log(`❌ Could not check performance results: ${error.message}`);
    failures.push('Performance audit data unavailable');
    hasFailures = true;
  }
  
  // Check accessibility results
  try {
    const axeData = await fs.readFile('merged-axe-results.json', 'utf8');
    const axeResults = JSON.parse(axeData);
    
    console.log('\n♿ Accessibility Threshold Check:');
    console.log('='.repeat(40));
    
    const violations = axeResults.violations || [];
    const criticalViolations = violations.filter(v => 
      v.impact === 'critical' || v.impact === 'serious'
    );
    
    if (violations.length > THRESHOLDS.accessibility.maxViolations) {
      const failure = `Found ${violations.length} accessibility violations (threshold: ${THRESHOLDS.accessibility.maxViolations})`;
      failures.push(failure);
      console.log(`❌ ${failure}`);
      hasFailures = true;
    } else {
      console.log(`✅ Accessibility violations: ${violations.length} (threshold: ${THRESHOLDS.accessibility.maxViolations})`);
    }
    
    if (criticalViolations.length > THRESHOLDS.accessibility.criticalViolations) {
      const failure = `Found ${criticalViolations.length} critical accessibility violations (threshold: ${THRESHOLDS.accessibility.criticalViolations})`;
      failures.push(failure);
      console.log(`❌ ${failure}`);
      hasFailures = true;
    } else {
      console.log(`✅ Critical accessibility violations: ${criticalViolations.length} (threshold: ${THRESHOLDS.accessibility.criticalViolations})`);
    }
    
    // Log violation details for critical issues
    if (criticalViolations.length > 0) {
      console.log('\n🚨 Critical Accessibility Issues:');
      criticalViolations.forEach((violation, index) => {
        console.log(`   ${index + 1}. ${violation.id}: ${violation.description}`);
        console.log(`      Impact: ${violation.impact}, Nodes: ${violation.nodes?.length || 0}`);
      });
    }
    
  } catch (error) {
    console.log(`⚠️  Could not check accessibility results: ${error.message}`);
    warnings.push('Accessibility audit data unavailable');
  }
  
  // Summary
  console.log('\n📋 Audit Summary:');
  console.log('='.repeat(40));
  console.log(`Failures: ${failures.length}`);
  console.log(`Warnings: ${warnings.length}`);
  
  if (failures.length > 0) {
    console.log('\n🚨 Critical Issues:');
    failures.forEach((failure, index) => {
      console.log(`   ${index + 1}. ${failure}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach((warning, index) => {
      console.log(`   ${index + 1}. ${warning}`);
    });
  }
  
  // Save threshold check results
  const thresholdResults = {
    passed: !hasFailures,
    failures,
    warnings,
    thresholds: THRESHOLDS,
    timestamp: new Date().toISOString()
  };
  
  await fs.writeFile('threshold-check-results.json', JSON.stringify(thresholdResults, null, 2));
  
  if (hasFailures) {
    console.log('\n❌ Audit failed - critical issues found!');
    process.exit(1);
  } else {
    console.log('\n✅ Audit passed - all thresholds met!');
    if (warnings.length > 0) {
      console.log(`   Note: ${warnings.length} warnings require attention`);
    }
    process.exit(0);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  checkAuditThresholds().catch((error) => {
    console.error('❌ Threshold check failed:', error);
    process.exit(1);
  });
}

export { checkAuditThresholds, THRESHOLDS };