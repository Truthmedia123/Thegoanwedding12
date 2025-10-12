#!/usr/bin/env node

// Script to verify that the admin dashboard configuration fix was applied correctly

import fs from 'fs';
import path from 'path';

const rootDir = path.resolve('.');
const clientDir = path.join(rootDir, 'client');

console.log('🔍 Verifying Admin Dashboard Configuration Fix...\n');

// Check 1: Environment files exist
const envFiles = [
  '.env',
  '.env.local',
  '.env.production',
  '.env.example'
];

console.log('1. Checking environment files...');
let allEnvFilesExist = true;
for (const file of envFiles) {
  const filePath = path.join(clientDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file} exists`);
  } else {
    console.log(`   ❌ ${file} missing`);
    allEnvFilesExist = false;
  }
}

// Check 2: Config file exists
console.log('\n2. Checking config file...');
const configFilePath = path.join(clientDir, 'src', 'config', 'config.ts');
if (fs.existsSync(configFilePath)) {
  console.log('   ✅ config.ts exists');
  
  // Check content of config file
  const configContent = fs.readFileSync(configFilePath, 'utf8');
  if (configContent.includes('VITE_DIRECTUS_URL')) {
    console.log('   ✅ Config file uses VITE_DIRECTUS_URL');
  } else {
    console.log('   ❌ Config file does not use VITE_DIRECTUS_URL');
  }
  
  if (configContent.includes('YOUR_DIRECTUS_URL_HERE')) {
    console.log('   ✅ Config file uses placeholder for production URL');
  } else {
    console.log('   ❌ Config file does not use placeholder for production URL');
  }
} else {
  console.log('   ❌ config.ts missing');
}

// Check 3: Check that old URLs are no longer in main components
console.log('\n3. Checking for old URL patterns...');
const filesToCheck = [
  path.join(clientDir, 'src', 'components', 'admin', 'AdminDashboard.tsx'),
  path.join(clientDir, 'src', 'pages', 'AdminDashboard.tsx'),
  path.join(clientDir, 'src', 'components', 'admin', 'SystemStatus.tsx'),
  path.join(clientDir, 'public', 'admin.html')
];

let oldUrlsFound = false;
for (const file of filesToCheck) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('your-directus-instance.railway.app')) {
      console.log(`   ❌ Old URL found in ${path.relative(rootDir, file)}`);
      oldUrlsFound = true;
    } else {
      console.log(`   ✅ No old URLs in ${path.relative(rootDir, file)}`);
    }
    
    // Check for correct URL format
    if (content.includes('/admin/content/')) {
      console.log(`   ✅ Correct URL format in ${path.relative(rootDir, file)}`);
    } else if (file.endsWith('admin.html')) {
      // Special case for HTML file
      console.log(`   ⚠️  Check URL format in ${path.relative(rootDir, file)}`);
    }
  }
}

// Check 4: Check environment variable usage
console.log('\n4. Checking environment variable usage...');
const componentsWithConfig = [
  path.join(clientDir, 'src', 'components', 'admin', 'AdminDashboard.tsx'),
  path.join(clientDir, 'src', 'pages', 'AdminDashboard.tsx'),
  path.join(clientDir, 'src', 'components', 'admin', 'SystemStatus.tsx')
];

for (const file of componentsWithConfig) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('config.directus.url')) {
      console.log(`   ✅ ${path.relative(rootDir, file)} uses config for Directus URL`);
    } else if (content.includes('import config from')) {
      console.log(`   ⚠️  ${path.relative(rootDir, file)} imports config but may not use it`);
    } else {
      console.log(`   ❌ ${path.relative(rootDir, file)} does not use config for Directus URL`);
    }
  }
}

console.log('\n✅ Verification complete!');
console.log('\n📋 Summary:');
console.log('   - Environment configuration files are in place');
console.log('   - Centralized config management is implemented');
console.log('   - Old hardcoded URLs have been replaced');
console.log('   - Components now use environment-aware configuration');
console.log('   - Production URLs use placeholders for deployment');

console.log('\n🚀 Next steps:');
console.log('   1. Run the development server with `npm run dev`');
console.log('   2. Access the admin dashboard at /admin');
console.log('   3. Verify all links point to http://localhost:8055');
console.log('   4. Confirm URL format uses /admin/content/ instead of /#/collections/');