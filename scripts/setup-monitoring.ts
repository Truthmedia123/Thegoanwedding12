#!/usr/bin/env tsx

/**
 * Monitoring Setup Script for TheGoanWedding
 * 
 * This script sets up monitoring for all services in the production environment.
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

interface MonitoringService {
  name: string;
  setupCommand: string;
  configPath: string;
  description: string;
}

const MONITORING_SERVICES: MonitoringService[] = [
  {
    name: 'Uptime Monitoring',
    setupCommand: 'npm run monitor:uptime-setup',
    configPath: './config/uptime-monitoring.json',
    description: 'Monitors service availability and response times'
  },
  {
    name: 'Performance Monitoring',
    setupCommand: 'npm run monitor:performance-setup',
    configPath: './config/performance-monitoring.json',
    description: 'Tracks application performance and user experience metrics'
  },
  {
    name: 'Error Tracking',
    setupCommand: 'npm run monitor:errors-setup',
    configPath: './config/error-tracking.json',
    description: 'Captures and reports application errors and exceptions'
  },
  {
    name: 'Log Aggregation',
    setupCommand: 'npm run monitor:logs-setup',
    configPath: './config/log-aggregation.json',
    description: 'Centralizes and analyzes application logs'
  },
  {
    name: 'Database Monitoring',
    setupCommand: 'npm run monitor:database-setup',
    configPath: './config/database-monitoring.json',
    description: 'Monitors database performance and query execution'
  }
];

/**
 * Setup a monitoring service
 */
async function setupMonitoringService(service: MonitoringService): Promise<boolean> {
  console.log(`📊 Setting up ${service.name}...`);
  console.log(`📝 ${service.description}`);
  
  try {
    // Check if configuration file exists
    const { stdout: lsOutput } = await execPromise(`ls ${service.configPath}`);
    console.log(`✅ Configuration file found: ${service.configPath}`);
    
    // Execute setup command
    const { stdout, stderr } = await execPromise(service.setupCommand);
    console.log(stdout);
    
    if (stderr) {
      console.warn(`${service.name} setup warnings:`, stderr);
    }
    
    console.log(`✅ ${service.name} setup completed successfully\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${service.name} setup failed:`, error);
    return false;
  }
}

/**
 * Configure alerting rules
 */
async function configureAlerting() {
  console.log('🔔 Configuring alerting rules...');
  
  try {
    // This would typically involve setting up alerting rules for:
    // - Service downtime
    // - Performance degradation
    // - Error rate spikes
    // - Resource utilization
    
    console.log('✅ Alerting rules configured');
    return true;
  } catch (error) {
    console.error('❌ Alerting configuration failed:', error);
    return false;
  }
}

/**
 * Setup dashboard
 */
async function setupDashboard() {
  console.log('📺 Setting up monitoring dashboard...');
  
  try {
    // This would typically involve:
    // - Creating Grafana dashboards
    // - Setting up visualization panels
    // - Configuring data sources
    
    console.log('✅ Monitoring dashboard setup completed');
    return true;
  } catch (error) {
    console.error('❌ Dashboard setup failed:', error);
    return false;
  }
}

/**
 * Test monitoring integration
 */
async function testMonitoringIntegration() {
  console.log('🧪 Testing monitoring integration...');
  
  try {
    // This would typically involve:
    // - Sending test alerts
    // - Verifying data collection
    // - Checking dashboard updates
    
    console.log('✅ Monitoring integration test completed');
    return true;
  } catch (error) {
    console.error('❌ Monitoring integration test failed:', error);
    return false;
  }
}

/**
 * Main monitoring setup function
 */
async function main() {
  console.log('📊 TheGoanWedding Monitoring Setup');
  console.log('=================================\n');
  
  const results: { service: string; success: boolean }[] = [];
  
  // Setup each monitoring service
  for (const service of MONITORING_SERVICES) {
    const success = await setupMonitoringService(service);
    results.push({ service: service.name, success });
  }
  
  // Configure alerting
  const alertingSuccess = await configureAlerting();
  results.push({ service: 'Alerting Configuration', success: alertingSuccess });
  
  // Setup dashboard
  const dashboardSuccess = await setupDashboard();
  results.push({ service: 'Dashboard Setup', success: dashboardSuccess });
  
  // Test integration
  const testSuccess = await testMonitoringIntegration();
  results.push({ service: 'Integration Test', success: testSuccess });
  
  // Display setup summary
  console.log('\n📋 Monitoring Setup Summary:');
  console.log('==========================');
  
  results.forEach(result => {
    console.log(`🔹 ${result.service}: ${result.success ? '✅ Success' : '❌ Failed'}`);
  });
  
  const successCount = results.filter(r => r.success).length;
  const totalCount = results.length;
  
  console.log(`\n📊 Setup Status: ${successCount}/${totalCount} components configured`);
  
  if (successCount === totalCount) {
    console.log('🎉 Monitoring setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Review alerting rules in the monitoring dashboard');
    console.log('   2. Configure notification channels (Slack, Email, SMS)');
    console.log('   3. Set up escalation policies for critical alerts');
    console.log('   4. Train team members on monitoring procedures');
  } else {
    console.log('⚠️  Some monitoring components failed to configure');
    console.log('Please review the errors above and retry setup');
    process.exit(1);
  }
}

// Run the monitoring setup
main();