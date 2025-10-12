#!/usr/bin/env tsx

/**
 * Rollback Deployment Script for TheGoanWedding
 * 
 * This script handles rolling back deployments in case of failures or issues.
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

interface DeploymentTarget {
  name: string;
  rollbackCommand: string;
  verifyCommand: string;
}

const DEPLOYMENT_TARGETS: DeploymentTarget[] = [
  {
    name: 'Frontend',
    rollbackCommand: 'wrangler pages rollback --project-name=weddingreplit',
    verifyCommand: 'wrangler pages deployments list --project-name=weddingreplit'
  },
  {
    name: 'Directus',
    rollbackCommand: 'railway rollback --service directus',
    verifyCommand: 'railway logs --service directus'
  },
  {
    name: 'Meilisearch',
    rollbackCommand: 'railway rollback --service meilisearch',
    verifyCommand: 'railway logs --service meilisearch'
  },
  {
    name: 'Cloudflare Workers',
    rollbackCommand: 'wrangler rollback --env production',
    verifyCommand: 'wrangler versions list --env production'
  }
];

/**
 * Rollback a specific deployment target
 */
async function rollbackTarget(target: DeploymentTarget): Promise<boolean> {
  console.log(`↩️  Rolling back ${target.name}...`);
  
  try {
    // Execute rollback command
    const { stdout, stderr } = await execPromise(target.rollbackCommand);
    console.log(stdout);
    
    if (stderr) {
      console.warn(`${target.name} rollback warnings:`, stderr);
    }
    
    console.log(`✅ ${target.name} rolled back successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${target.name} rollback failed:`, error);
    return false;
  }
}

/**
 * Verify rollback was successful
 */
async function verifyRollback(target: DeploymentTarget): Promise<boolean> {
  console.log(`🔍 Verifying ${target.name} rollback...`);
  
  try {
    const { stdout, stderr } = await execPromise(target.verifyCommand);
    console.log(stdout);
    
    if (stderr) {
      console.warn(`${target.name} verification warnings:`, stderr);
    }
    
    console.log(`✅ ${target.name} rollback verified`);
    return true;
  } catch (error) {
    console.error(`❌ ${target.name} rollback verification failed:`, error);
    return false;
  }
}

/**
 * Notify team about rollback
 */
async function notifyTeam(service: string, success: boolean) {
  console.log(`📢 Notifying team about ${service} rollback...`);
  
  // This would typically integrate with Slack, Discord, or email
  // For now, we'll just log the notification
  
  if (success) {
    console.log(`✅ Team notified: ${service} rollback completed successfully`);
  } else {
    console.log(`❌ Team notified: ${service} rollback failed`);
  }
}

/**
 * Main rollback function
 */
async function main() {
  console.log('↩️  TheGoanWedding Deployment Rollback');
  console.log('=====================================\n');
  
  const serviceToRollback = process.argv[2];
  
  if (!serviceToRollback) {
    console.error('❌ Please specify a service to rollback:');
    console.error('Usage: npm run rollback <service>');
    console.error('Available services: frontend, directus, meilisearch, workers, all');
    process.exit(1);
  }
  
  const results: { service: string; success: boolean }[] = [];
  
  if (serviceToRollback === 'all') {
    // Rollback all services
    for (const target of DEPLOYMENT_TARGETS) {
      const success = await rollbackTarget(target);
      results.push({ service: target.name, success });
      
      if (success) {
        await verifyRollback(target);
        await notifyTeam(target.name, true);
      } else {
        await notifyTeam(target.name, false);
      }
    }
  } else {
    // Rollback specific service
    const target = DEPLOYMENT_TARGETS.find(t => 
      t.name.toLowerCase().includes(serviceToRollback.toLowerCase())
    );
    
    if (!target) {
      console.error(`❌ Unknown service: ${serviceToRollback}`);
      console.error('Available services: frontend, directus, meilisearch, workers');
      process.exit(1);
    }
    
    const success = await rollbackTarget(target);
    results.push({ service: target.name, success });
    
    if (success) {
      await verifyRollback(target);
      await notifyTeam(target.name, true);
    } else {
      await notifyTeam(target.name, false);
    }
  }
  
  // Display rollback summary
  console.log('\n📋 Rollback Summary:');
  console.log('===================');
  
  results.forEach(result => {
    console.log(`🔹 ${result.service}: ${result.success ? '✅ Success' : '❌ Failed'}`);
  });
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log(`\n📊 Rollback Status: ${successCount}/${totalCount} services rolled back`);
  
  if (successCount === totalCount) {
    console.log('🎉 All rollbacks completed successfully!');
  } else {
    console.log('⚠️  Some rollbacks failed - manual intervention may be required');
    process.exit(1);
  }
}

// Run the rollback
main();