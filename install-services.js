#!/usr/bin/env node

/**
 * Service Installation Script for TheGoanWedding
 * 
 * This script helps install the required services for the development environment.
 */

const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

async function installServices() {
  console.log('🔧 Installing required services for TheGoanWedding...\n');
  
  try {
    // Check if Node.js is installed
    console.log('🔍 Checking Node.js installation...');
    const nodeVersion = await execPromise('node --version');
    console.log(`✅ Node.js: ${nodeVersion.stdout.trim()}`);
    
    // Check if npm is installed
    console.log('\n🔍 Checking npm installation...');
    const npmVersion = await execPromise('npm --version');
    console.log(`✅ npm: ${npmVersion.stdout.trim()}`);
    
    // Install Directus globally
    console.log('\n🚀 Installing Directus globally...');
    await execPromise('npm install -g directus', { stdio: 'inherit' });
    console.log('✅ Directus installed successfully');
    
    // Install Meilisearch globally
    console.log('\n🚀 Installing Meilisearch globally...');
    await execPromise('npm install -g meilisearch', { stdio: 'inherit' });
    console.log('✅ Meilisearch installed successfully');
    
    // Install Directus dependencies locally
    console.log('\n🚀 Installing Directus dependencies...');
    await execPromise('cd directus-cms && npm install', { stdio: 'inherit' });
    console.log('✅ Directus dependencies installed successfully');
    
    console.log('\n🎉 All services installed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Run "npm run dev:all" to start all services');
    console.log('2. Or start services manually:');
    console.log('   - Terminal 1: cd directus-cms && npx directus start');
    console.log('   - Terminal 2: meilisearch --http-addr localhost:7700');
    console.log('   - Terminal 3: npm run pages:dev');
    console.log('   - Terminal 4: npm run dev:dashboard');
    console.log('\n🌐 Access your services at:');
    console.log('   - Main App: http://localhost:8787');
    console.log('   - Directus Admin: http://localhost:8055/admin');
    console.log('   - Meilisearch Dashboard: http://localhost:7700');
    console.log('   - Dev Dashboard: http://localhost:3000');
    
  } catch (error) {
    console.error('\n❌ Installation failed:', error.message);
    console.log('\n🔧 Manual installation steps:');
    console.log('1. npm install -g directus');
    console.log('2. npm install -g meilisearch');
    console.log('3. cd directus-cms && npm install');
    console.log('4. npm run dev:all');
  }
}

// Run the installation
installServices();