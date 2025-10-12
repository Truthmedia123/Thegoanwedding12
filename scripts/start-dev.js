#!/usr/bin/env node

/**
 * Development Environment Startup Script
 * 
 * This script checks dependencies, starts all services, and opens browser tabs
 * for TheGoanWedding development environment.
 */

import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import { platform } from 'os';
import { existsSync } from 'fs';

const execPromise = promisify(exec);

// Service URLs
const SERVICES = {
  directus: 'http://localhost:8055',
  meilisearch: 'http://localhost:7700',
  app: 'http://localhost:8787',
  dashboard: 'http://localhost:3000/dev-dashboard'
};

// Service processes
let processes = {};

/**
 * Check if a port is in use
 */
async function isPortInUse(port) {
  try {
    const { stdout } = await execPromise(`netstat -ano | findstr :${port}`);
    return stdout.includes(`:${port}`);
  } catch (error) {
    return false;
  }
}

/**
 * Check if dependencies are installed
 */
async function checkDependencies() {
  console.log('🔍 Checking dependencies...');
  
  // Check Node.js
  try {
    const { stdout } = await execPromise('node --version');
    console.log(`✅ Node.js: ${stdout.trim()}`);
  } catch (error) {
    console.error('❌ Node.js is not installed or not in PATH');
    process.exit(1);
  }
  
  // Check npm
  try {
    const { stdout } = await execPromise('npm --version');
    console.log(`✅ npm: ${stdout.trim()}`);
  } catch (error) {
    console.error('❌ npm is not installed or not in PATH');
    process.exit(1);
  }
  
  // Check if node_modules exists
  if (!existsSync('node_modules')) {
    console.log('⚠️  node_modules not found. Running npm install...');
    try {
      await execPromise('npm install');
      console.log('✅ Dependencies installed');
    } catch (error) {
      console.error('❌ Failed to install dependencies:', error.message);
      process.exit(1);
    }
  } else {
    console.log('✅ Dependencies already installed');
  }
  
  // Check Directus dependencies
  if (!existsSync('directus-cms/node_modules')) {
    console.log('⚠️  Directus dependencies not found. Running npm install in directus-cms...');
    try {
      await execPromise('cd directus-cms && npm install');
      console.log('✅ Directus dependencies installed');
    } catch (error) {
      console.error('❌ Failed to install Directus dependencies:', error.message);
      process.exit(1);
    }
  } else {
    console.log('✅ Directus dependencies already installed');
  }
  
  // Check Meilisearch
  try {
    await execPromise('meilisearch --version');
    console.log('✅ Meilisearch: Installed');
  } catch (error) {
    console.warn('⚠️  Meilisearch is not installed or not in PATH. Please install it from https://www.meilisearch.com/');
  }
}

/**
 * Start a service
 */
function startService(name, command, cwd = '.', delay = 0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`🚀 Starting ${name}...`);
      
      const proc = spawn(command, {
        shell: true,
        cwd,
        stdio: 'inherit'
      });
      
      processes[name] = proc;
      
      proc.on('error', (error) => {
        console.error(`❌ Error starting ${name}:`, error.message);
      });
      
      proc.on('close', (code) => {
        console.log(`⚠️  ${name} process exited with code ${code}`);
        delete processes[name];
      });
      
      // Give the service a moment to start
      setTimeout(() => resolve(), 2000);
    }, delay);
  });
}

/**
 * Open URL in browser
 */
function openBrowser(url) {
  const os = platform();
  let command;
  
  switch (os) {
    case 'win32':
      command = `start "" "${url}"`;
      break;
    case 'darwin':
      command = `open "${url}"`;
      break;
    default:
      command = `xdg-open "${url}"`;
  }
  
  exec(command, (error) => {
    if (error) {
      console.error(`⚠️  Could not open browser for ${url}:`, error.message);
    } else {
      console.log(`🌐 Opened ${url} in browser`);
    }
  });
}

/**
 * Display startup status
 */
function displayStatus() {
  console.log('\n📊 Development Environment Status:');
  console.log('=====================================');
  
  Object.entries(SERVICES).forEach(([name, url]) => {
    console.log(`🔹 ${name}: ${url}`);
  });
  
  console.log('\n📝 Quick Access:');
  console.log('=================');
  console.log('Directus Admin: http://localhost:8055/admin');
  console.log('Meilisearch Dashboard: http://localhost:7700');
  console.log('Application: http://localhost:8787');
  console.log('Development Dashboard: http://localhost:3000/dev-dashboard');
  
  console.log('\n⌨️  Commands:');
  console.log('=============');
  console.log('Ctrl+C to stop all services');
}

/**
 * Check service health
 */
async function checkServiceHealth(url, serviceName) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, { 
      method: 'HEAD', 
      signal: controller.signal 
    });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log(`✅ ${serviceName} is running`);
      return true;
    } else {
      console.log(`⚠️  ${serviceName} responded with status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${serviceName} is not responding: ${error.message}`);
    return false;
  }
}

/**
 * Gracefully shutdown all processes
 */
function shutdown() {
  console.log('\n🛑 Shutting down services...');
  
  Object.entries(processes).forEach(([name, proc]) => {
    console.log(`⏹️  Stopping ${name}...`);
    proc.kill();
  });
  
  process.exit(0);
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🎉 TheGoanWedding Development Environment Startup');
    console.log('==================================================\n');
    
    // Check dependencies
    await checkDependencies();
    
    // Check for port conflicts
    console.log('\n🔍 Checking for port conflicts...');
    const ports = [8055, 7700, 8787, 3000];
    const conflicts = [];
    
    for (const port of ports) {
      if (await isPortInUse(port)) {
        conflicts.push(port);
      }
    }
    
    if (conflicts.length > 0) {
      console.warn(`⚠️  Ports in use: ${conflicts.join(', ')}. You may need to stop other processes.`);
    } else {
      console.log('✅ No port conflicts detected');
    }
    
    // Start services in order
    console.log('\n🚀 Starting services...\n');
    
    // Start Directus
    await startService('Directus', 'npm start', 'directus-cms');
    
    // Start Meilisearch
    await startService('Meilisearch', 'meilisearch --http-addr localhost:7700', '.', 1000);
    
    // Start Development Dashboard
    await startService('Dev Dashboard', 'npm run dev:dashboard', '.', 2000);
    
    // Start React app
    await startService('React App', 'npm run pages:dev', '.', 3000);
    
    // Wait a bit for services to stabilize
    console.log('\n⏳ Waiting for services to initialize...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check service health
    console.log('\n🏥 Checking service health...');
    await checkServiceHealth('http://localhost:8055', 'Directus');
    await checkServiceHealth('http://localhost:7700', 'Meilisearch');
    await checkServiceHealth('http://localhost:8787', 'React App');
    await checkServiceHealth('http://localhost:3000', 'Dev Dashboard');
    
    // Open browser tabs
    console.log('\n🌐 Opening browser tabs...\n');
    openBrowser(SERVICES.directus);
    openBrowser(SERVICES.meilisearch);
    openBrowser(SERVICES.app);
    openBrowser(SERVICES.dashboard);
    
    // Display status
    displayStatus();
    
    console.log('\n🎉 Development environment is ready!');
    
    // Handle graceful shutdown
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    
  } catch (error) {
    console.error('❌ Startup failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();