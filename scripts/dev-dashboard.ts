#!/usr/bin/env tsx

/**
 * Development Dashboard for TheGoanWedding
 * 
 * This script creates a local development dashboard at http://localhost:3000
 * that shows service status and provides quick access to development tools.
 */

import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync } from 'fs';
import { join } from 'path';

const execPromise = promisify(exec);

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('client/public'));
app.set('view engine', 'ejs');

// Service status check function
async function checkServiceStatus(url: string): Promise<{ status: string; responseTime?: number }> {
  try {
    const start = Date.now();
    const response = await fetch(url, { method: 'HEAD', timeout: 5000 });
    const end = Date.now();
    
    return {
      status: response.ok ? 'running' : 'error',
      responseTime: end - start
    };
  } catch (error) {
    return {
      status: 'stopped'
    };
  }
}

// Get git information
async function getGitInfo() {
  try {
    const { stdout: branch } = await execPromise('git rev-parse --abbrev-ref HEAD');
    const { stdout: commit } = await execPromise('git rev-parse HEAD');
    const { stdout: changes } = await execPromise('git status --porcelain');
    
    return {
      branch: branch.trim(),
      commit: commit.trim().substring(0, 7),
      hasChanges: changes.trim().length > 0
    };
  } catch (error) {
    return {
      branch: 'unknown',
      commit: 'unknown',
      hasChanges: false
    };
  }
}

// Get environment variables status
function getEnvStatus() {
  const requiredVars = [
    'DIRECTUS_URL',
    'DIRECTUS_TOKEN',
    'USE_DIRECTUS',
    'MEILISEARCH_HOST',
    'MEILISEARCH_API_KEY'
  ];
  
  const status: Record<string, boolean> = {};
  
  for (const envVar of requiredVars) {
    status[envVar] = !!process.env[envVar];
  }
  
  return status;
}

// Dashboard route
app.get('/', async (req, res) => {
  try {
    // Check service statuses
    const directusStatus = await checkServiceStatus('http://localhost:8055');
    const meilisearchStatus = await checkServiceStatus('http://localhost:7700');
    const appStatus = await checkServiceStatus('http://localhost:8787');
    
    // Get git information
    const gitInfo = await getGitInfo();
    
    // Get environment variables status
    const envStatus = getEnvStatus();
    
    // Get package.json info
    const packageJson = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf-8')
    );
    
    // Render dashboard
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TheGoanWedding Development Dashboard</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Crimson+Text:wght@400;600&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <style>
          :root {
            --goan-coral: #dc2626;
            --goan-sea-blue: #0ea5e9;
            --goan-sand: #fef3c7;
            --goan-palm: #16a34a;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Crimson Text', serif;
            background-color: #f8fafc;
            color: #1e293b;
            line-height: 1.6;
          }
          
          header {
            background: linear-gradient(135deg, var(--goan-coral), var(--goan-sea-blue));
            color: white;
            padding: 1rem 0;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .container {
            width: 90%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
          }
          
          .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .logo {
            font-size: 1.8rem;
            font-weight: 700;
          }
          
          .logo span:first-child {
            color: var(--goan-coral);
          }
          
          .logo span:last-child {
            color: var(--goan-sea-blue);
          }
          
          main {
            padding: 2rem 0;
          }
          
          .dashboard-header {
            text-align: center;
            margin-bottom: 2rem;
          }
          
          .dashboard-header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            color: #1e293b;
          }
          
          .dashboard-header p {
            font-size: 1.2rem;
            color: #64748b;
          }
          
          .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }
          
          .status-card {
            background: white;
            border-radius: 10px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s, box-shadow 0.3s;
          }
          
          .status-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
          }
          
          .status-card h2 {
            font-size: 1.3rem;
            margin-bottom: 1rem;
            color: #1e293b;
            display: flex;
            align-items: center;
          }
          
          .status-card h2 i {
            margin-right: 0.5rem;
          }
          
          .status-item {
            display: flex;
            justify-content: space-between;
            padding: 0.75rem 0;
            border-bottom: 1px solid #e2e8f0;
          }
          
          .status-item:last-child {
            border-bottom: none;
          }
          
          .status-label {
            font-weight: 500;
          }
          
          .status-value {
            display: flex;
            align-items: center;
          }
          
          .status-indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 0.5rem;
          }
          
          .status-success {
            background-color: #10b981;
          }
          
          .status-warning {
            background-color: #f59e0b;
          }
          
          .status-error {
            background-color: #ef4444;
          }
          
          .quick-links {
            background: white;
            border-radius: 10px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            margin-bottom: 2rem;
          }
          
          .quick-links h2 {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            color: #1e293b;
            display: flex;
            align-items: center;
          }
          
          .quick-links h2 i {
            margin-right: 0.5rem;
          }
          
          .links-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
          }
          
          .link-card {
            background: #f1f5f9;
            border-radius: 8px;
            padding: 1rem;
            text-align: center;
            transition: background-color 0.3s;
          }
          
          .link-card:hover {
            background: #e2e8f0;
          }
          
          .link-card i {
            font-size: 2rem;
            color: var(--goan-coral);
            margin-bottom: 0.5rem;
          }
          
          .link-card h3 {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
          }
          
          .link-card a {
            display: inline-block;
            background: var(--goan-coral);
            color: white;
            text-decoration: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            font-weight: 500;
            transition: background-color 0.3s;
          }
          
          .link-card a:hover {
            background: #b91c1c;
          }
          
          .project-info {
            background: white;
            border-radius: 10px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          }
          
          .project-info h2 {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            color: #1e293b;
            display: flex;
            align-items: center;
          }
          
          .project-info h2 i {
            margin-right: 0.5rem;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
          }
          
          .info-item {
            padding: 1rem;
            background: #f8fafc;
            border-radius: 8px;
          }
          
          .info-item h3 {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
            color: #1e293b;
          }
          
          footer {
            background-color: #1e293b;
            color: white;
            text-align: center;
            padding: 2rem 0;
            margin-top: 2rem;
          }
          
          @media (max-width: 768px) {
            .header-content {
              flex-direction: column;
            }
          }
        </style>
      </head>
      <body>
        <header>
          <div class="container">
            <div class="header-content">
              <div class="logo">
                <span>TheGoan</span><span>Wedding</span>
              </div>
              <h1>Development Dashboard</h1>
            </div>
          </div>
        </header>
        
        <main>
          <div class="container">
            <div class="dashboard-header">
              <h1>Development Environment</h1>
              <p>Monitor services and access development tools</p>
            </div>
            
            <div class="status-grid">
              <div class="status-card">
                <h2><i class="fas fa-crown"></i> Directus CMS</h2>
                <div class="status-item">
                  <span class="status-label">Status:</span>
                  <span class="status-value">
                    <span class="status-indicator ${directusStatus.status === 'running' ? 'status-success' : 'status-error'}"></span>
                    <span>${directusStatus.status === 'running' ? 'Running' : 'Stopped'}</span>
                  </span>
                </div>
                <div class="status-item">
                  <span class="status-label">URL:</span>
                  <span class="status-value">
                    <a href="http://localhost:8055" target="_blank">http://localhost:8055</a>
                  </span>
                </div>
                ${directusStatus.responseTime ? `
                <div class="status-item">
                  <span class="status-label">Response Time:</span>
                  <span class="status-value">${directusStatus.responseTime}ms</span>
                </div>
                ` : ''}
              </div>
              
              <div class="status-card">
                <h2><i class="fas fa-search"></i> Meilisearch</h2>
                <div class="status-item">
                  <span class="status-label">Status:</span>
                  <span class="status-value">
                    <span class="status-indicator ${meilisearchStatus.status === 'running' ? 'status-success' : 'status-error'}"></span>
                    <span>${meilisearchStatus.status === 'running' ? 'Running' : 'Stopped'}</span>
                  </span>
                </div>
                <div class="status-item">
                  <span class="status-label">URL:</span>
                  <span class="status-value">
                    <a href="http://localhost:7700" target="_blank">http://localhost:7700</a>
                  </span>
                </div>
                ${meilisearchStatus.responseTime ? `
                <div class="status-item">
                  <span class="status-label">Response Time:</span>
                  <span class="status-value">${meilisearchStatus.responseTime}ms</span>
                </div>
                ` : ''}
              </div>
              
              <div class="status-card">
                <h2><i class="fas fa-code"></i> React App</h2>
                <div class="status-item">
                  <span class="status-label">Status:</span>
                  <span class="status-value">
                    <span class="status-indicator ${appStatus.status === 'running' ? 'status-success' : 'status-error'}"></span>
                    <span>${appStatus.status === 'running' ? 'Running' : 'Stopped'}</span>
                  </span>
                </div>
                <div class="status-item">
                  <span class="status-label">URL:</span>
                  <span class="status-value">
                    <a href="http://localhost:8787" target="_blank">http://localhost:8787</a>
                  </span>
                </div>
                ${appStatus.responseTime ? `
                <div class="status-item">
                  <span class="status-label">Response Time:</span>
                  <span class="status-value">${appStatus.responseTime}ms</span>
                </div>
                ` : ''}
              </div>
            </div>
            
            <div class="quick-links">
              <h2><i class="fas fa-bolt"></i> Quick Access</h2>
              <div class="links-grid">
                <div class="link-card">
                  <i class="fas fa-user-crown"></i>
                  <h3>Directus Admin</h3>
                  <p>Manage content and data</p>
                  <a href="http://localhost:8055/admin" target="_blank">Open Admin</a>
                </div>
                
                <div class="link-card">
                  <i class="fas fa-search"></i>
                  <h3>Meilisearch Dashboard</h3>
                  <p>Search engine management</p>
                  <a href="http://localhost:7700" target="_blank">Open Dashboard</a>
                </div>
                
                <div class="link-card">
                  <i class="fas fa-file-alt"></i>
                  <h3>API Documentation</h3>
                  <p>View API endpoints</p>
                  <a href="http://localhost:8787/api/docs" target="_blank">View Docs</a>
                </div>
                
                <div class="link-card">
                  <i class="fas fa-book"></i>
                  <h3>Storybook</h3>
                  <p>Component documentation</p>
                  <a href="http://localhost:8787/storybook" target="_blank">Open Storybook</a>
                </div>
              </div>
            </div>
            
            <div class="project-info">
              <h2><i class="fas fa-info-circle"></i> Project Information</h2>
              <div class="info-grid">
                <div class="info-item">
                  <h3>Git Information</h3>
                  <p><strong>Branch:</strong> ${gitInfo.branch}</p>
                  <p><strong>Commit:</strong> ${gitInfo.commit}</p>
                  <p><strong>Changes:</strong> ${gitInfo.hasChanges ? 'Uncommitted changes' : 'No changes'}</p>
                </div>
                
                <div class="info-item">
                  <h3>Environment Variables</h3>
                  ${Object.entries(envStatus).map(([key, value]) => `
                    <p>
                      <strong>${key}:</strong> 
                      <span class="status-indicator ${value ? 'status-success' : 'status-error'}"></span>
                      ${value ? 'Set' : 'Not set'}
                    </p>
                  `).join('')}
                </div>
                
                <div class="info-item">
                  <h3>Project Details</h3>
                  <p><strong>Name:</strong> ${packageJson.name}</p>
                  <p><strong>Version:</strong> ${packageJson.version}</p>
                  <p><strong>License:</strong> ${packageJson.license}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <footer>
          <div class="container">
            <p>&copy; 2025 TheGoanWedding.com. All rights reserved.</p>
            <p>Development Dashboard v1.0</p>
          </div>
        </footer>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Error rendering dashboard:', error);
    res.status(500).send(`
      <h1>Error Loading Dashboard</h1>
      <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
    `);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Development Dashboard running at http://localhost:${PORT}`);
  console.log(`📊 Access the dashboard in your browser to monitor services and access tools`);
});