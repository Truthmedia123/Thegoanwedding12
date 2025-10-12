#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';

async function generateAuditReport() {
  console.log('📄 Generating audit report...');
  
  let report = `# Accessibility & Performance Audit Report\n\n`;
  report += `Generated on: ${new Date().toISOString()}\n\n`;
  
  // Load performance results
  try {
    const performanceData = await fs.readFile('performance-results.json', 'utf8');
    const perfResults = JSON.parse(performanceData);
    
    report += `## Performance Summary\n\n`;
    report += `- **Pages Tested**: ${perfResults.summary.totalPages}\n`;
    report += `- **Passed**: ${perfResults.summary.passedPages}\n`;
    report += `- **Failed**: ${perfResults.summary.failedPages}\n`;
    report += `- **Average Load Time**: ${perfResults.summary.averageLoadTime}ms\n`;
    
    if (perfResults.summary.averageFCP) {
      report += `- **Average First Contentful Paint**: ${perfResults.summary.averageFCP}ms\n`;
    }
    if (perfResults.summary.averageLCP) {
      report += `- **Average Largest Contentful Paint**: ${perfResults.summary.averageLCP}ms\n`;
    }
    if (perfResults.summary.averageCLS) {
      report += `- **Average Cumulative Layout Shift**: ${perfResults.summary.averageCLS}\n`;
    }
    
    if (perfResults.summary.issues.length > 0) {
      report += `\n### Performance Issues\n\n`;
      perfResults.summary.issues.forEach((issue, index) => {
        report += `${index + 1}. ${issue}\n`;
      });
    }
    
    report += `\n### Detailed Results\n\n`;
    perfResults.results.forEach((result) => {
      report += `#### ${result.pageName}\n`;
      report += `- **URL**: ${result.url}\n`;
      report += `- **Load Time**: ${result.loadTime}ms\n`;
      report += `- **Status Code**: ${result.statusCode}\n`;
      if (result.fcp) report += `- **FCP**: ${result.fcp}ms\n`;
      if (result.lcp) report += `- **LCP**: ${result.lcp}ms\n`;
      if (result.cls) report += `- **CLS**: ${result.cls.toFixed(3)}\n`;
      if (result.errors?.length > 0) {
        report += `- **JavaScript Errors**: ${result.errors.length}\n`;
      }
      if (result.accessibilityIssues?.length > 0) {
        report += `- **Accessibility Issues**: ${result.accessibilityIssues.join(', ')}\n`;
      }
      report += `\n`;
    });
    
  } catch (error) {
    report += `## Performance Results\n\n`;
    report += `❌ Could not load performance results: ${error.message}\n\n`;
  }
  
  // Load accessibility results
  try {
    const axeData = await fs.readFile('merged-axe-results.json', 'utf8');
    const axeResults = JSON.parse(axeData);
    
    report += `## Accessibility Summary\n\n`;
    
    if (axeResults.violations) {
      report += `- **Violations Found**: ${axeResults.violations.length}\n\n`;
      
      if (axeResults.violations.length > 0) {
        report += `### Accessibility Violations\n\n`;
        axeResults.violations.forEach((violation, index) => {
          report += `${index + 1}. **${violation.id}**: ${violation.description}\n`;
          report += `   - Impact: ${violation.impact}\n`;
          report += `   - Nodes affected: ${violation.nodes?.length || 0}\n\n`;
        });
      }
    } else {
      report += `✅ No accessibility violations found!\n\n`;
    }
    
  } catch (error) {
    report += `## Accessibility Results\n\n`;
    report += `❌ Could not load accessibility results: ${error.message}\n\n`;
  }
  
  // Generate recommendations
  report += `## Recommendations\n\n`;
  report += `### Performance Improvements\n`;
  report += `- Optimize images and use next-gen formats (WebP, AVIF)\n`;
  report += `- Implement code splitting for JavaScript bundles\n`;
  report += `- Use lazy loading for below-the-fold content\n`;
  report += `- Minimize render-blocking resources\n\n`;
  
  report += `### Accessibility Improvements\n`;
  report += `- Ensure all images have descriptive alt text\n`;
  report += `- Implement proper heading hierarchy\n`;
  report += `- Add labels to all form inputs\n`;
  report += `- Test with screen readers and keyboard navigation\n\n`;
  
  report += `### SEO Enhancements\n`;
  report += `- Add structured data for wedding vendors\n`;
  report += `- Implement proper meta descriptions\n`;
  report += `- Optimize page titles and headings\n`;
  report += `- Generate XML sitemap\n\n`;
  
  // Convert to HTML
  const htmlReport = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Audit Report - TheGoanWedding</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #2563eb; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
        h2 { color: #1f2937; margin-top: 30px; }
        h3 { color: #374151; }
        .summary { background: #f3f4f6; padding: 20px; border-radius: 8px; }
        .issue { background: #fef2f2; border-left: 4px solid #ef4444; padding: 10px; margin: 10px 0; }
        .success { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 10px; margin: 10px 0; }
        code { background: #f1f5f9; padding: 2px 4px; border-radius: 4px; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
        th { background: #f9fafb; }
    </style>
</head>
<body>
    <h1>🔍 Accessibility & Performance Audit Report</h1>
    <div class="summary">
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Platform:</strong> TheGoanWedding - Modern Wedding Vendor Directory</p>
    </div>
    ${report.replace(/\n/g, '<br>').replace(/#{2,3}\s/g, '<h3>').replace(/<h3>/g, '</p><h3>').replace(/<br><br>/g, '</p><p>')}
</body>
</html>
  `;
  
  await fs.writeFile('audit-report.html', htmlReport);
  await fs.writeFile('audit-report.md', report);
  
  console.log('✅ Audit report generated: audit-report.html');
  console.log('📄 Markdown report saved: audit-report.md');
  
  return report;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAuditReport()
    .then(() => {
      console.log('🎉 Audit report generation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Audit report generation failed:', error);
      process.exit(1);
    });
}

export { generateAuditReport };