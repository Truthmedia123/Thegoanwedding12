// Note: Using built-in fetch in Node.js 18+
// If using older Node.js, uncomment the next line and install node-fetch
// import fetch from 'node-fetch';
import fs from 'fs';

// Function to check if a URL is accessible
async function checkUrl(url, description) {
  try {
    console.log(`Checking ${description}...`);
    const response = await fetch(url, { method: 'HEAD' });
    console.log(`✅ ${description}: ${response.status} ${response.statusText}`);
    return response.ok;
  } catch (error) {
    console.log(`❌ ${description}: Error - ${error.message}`);
    return false;
  }
}

// Function to check page content
async function checkPageContent(url, description) {
  try {
    console.log(`Fetching content for ${description}...`);
    const response = await fetch(url);
    const content = await response.text();
    
    if (response.ok) {
      const hasTitle = content.includes('<title>') || content.includes('title>');
      const hasContent = content.length > 100; // Basic check for meaningful content
      console.log(`✅ ${description}: OK (Content length: ${content.length} chars${hasTitle ? ', has title' : ', no title'})`);
      return true;
    } else {
      console.log(`❌ ${description}: HTTP ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description}: Error - ${error.message}`);
    return false;
  }
}

// Main verification function
async function verifySitePages() {
  console.log('🔍 Starting site verification...\n');
  
  const baseUrl = 'http://localhost:8787';
  
  // Check main pages
  const pages = [
    { path: '/', description: 'Home Page' },
    { path: '/vendors/photography', description: 'Vendor Category Page' },
    { path: '/blog', description: 'Blog Page' },
    { path: '/tools', description: 'Wedding Tools Page' },
    { path: '/search', description: 'Search Page' },
    { path: '/invitations', description: 'Invitations Page' },
    { path: '/vendor-availability', description: 'Vendor Availability Page' },
    { path: '/about', description: 'About Page' },
    { path: '/contact', description: 'Contact Page' }
  ];
  
  let successCount = 0;
  let totalCount = pages.length;
  
  // Check each page
  for (const page of pages) {
    const url = `${baseUrl}${page.path}`;
    const success = await checkPageContent(url, page.description);
    if (success) successCount++;
    console.log(''); // Empty line for readability
  }
  
  // Summary
  console.log('📋 Verification Summary:');
  console.log(`✅ Successfully verified: ${successCount}/${totalCount} pages`);
  console.log(`❌ Failed: ${totalCount - successCount}/${totalCount} pages`);
  
  if (successCount === totalCount) {
    console.log('\n🎉 All pages verified successfully!');
    return true;
  } else {
    console.log('\n⚠️  Some pages failed verification.');
    return false;
  }
}

// Run verification
verifySitePages().catch(console.error);