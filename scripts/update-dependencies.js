#!/usr/bin/env node

/**
 * Dependency Update Script
 * 
 * This script helps maintain the project's dependencies by:
 * 1. Checking for security vulnerabilities
 * 2. Updating dependencies to their latest versions
 * 3. Regenerating the lockfile
 * 4. Running a test build to ensure everything still works
 */

import { execSync } from 'child_process';
import { promisify } from 'util';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

const exec = promisify(execSync);

async function runCommand(command, options = {}) {
  try {
    console.log(`Running: ${command}`);
    const result = await exec(command, { 
      stdio: 'inherit',
      ...options
    });
    return result;
  } catch (error) {
    console.error(`Error running command: ${command}`);
    console.error(error.message);
    throw error;
  }
}

async function checkVulnerabilities() {
  console.log('Checking for security vulnerabilities...');
  try {
    await runCommand('npm audit');
    console.log('No vulnerabilities found.');
  } catch (error) {
    console.log('Vulnerabilities detected. Attempting to fix...');
    try {
      await runCommand('npm audit fix --force');
      console.log('Vulnerabilities fixed.');
    } catch (fixError) {
      console.warn('Some vulnerabilities could not be automatically fixed. Please review manually.');
    }
  }
}

async function updateDependencies() {
  console.log('Updating dependencies...');
  await runCommand('npm update');
}

async function regenerateLockfile() {
  console.log('Regenerating lockfile...');
  await runCommand('npm install --package-lock-only');
}

async function runTestBuild() {
  console.log('Running test build...');
  try {
    await runCommand('npm run build:production');
    console.log('Test build completed successfully.');
  } catch (error) {
    console.error('Test build failed. Please check the build configuration.');
    throw error;
  }
}

async function main() {
  console.log('Starting dependency update process...');
  
  try {
    // Check current status
    await checkVulnerabilities();
    
    // Update dependencies
    await updateDependencies();
    
    // Regenerate lockfile
    await regenerateLockfile();
    
    // Run test build
    await runTestBuild();
    
    console.log('Dependency update process completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Test the application locally');
    console.log('2. Run the development server to ensure everything works');
    console.log('3. Commit the updated package.json and package-lock.json files');
    
  } catch (error) {
    console.error('Dependency update process failed:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main as updateDependencies };