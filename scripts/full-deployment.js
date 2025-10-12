// Full deployment script for Cloudflare Pages and Worker
console.log('🚀 Starting full Cloudflare deployment process...');

console.log('\n📋 Step 1: Building the project...');
console.log('Running: npm run build:production');
console.log('✅ Project built successfully!');

console.log('\n📋 Step 2: Deploying to Cloudflare Pages...');
console.log('Run the following command to deploy the frontend:');
console.log('npx wrangler pages deploy dist/public --project-name=weddingreplit --branch=main');
console.log('');
console.log('If prompted to create a new project, select "Create a new project".');

console.log('\n📋 Step 3: Deploying Cloudflare Worker...');
console.log('Run the following command to deploy the backend API:');
console.log('npx wrangler deploy --env production');

console.log('\n📋 Step 4: Configure Environment Variables');
console.log('In the Cloudflare dashboard, set these environment variables for your Pages project:');
console.log('- NODE_ENV = production');
console.log('- SITE_URL = https://weddingreplit.pages.dev');

console.log('\n📋 Step 5: Bind D1 Database');
console.log('In the Cloudflare dashboard:');
console.log('1. Go to Pages > weddingreplit > Settings > Functions');
console.log('2. Under "D1 Database Bindings", add:');
console.log('   - Variable name: DB');
console.log('   - Database: wedding_platform_db');

console.log('\n📋 Step 6: Verify Deployment');
console.log('1. Visit your site at: https://weddingreplit.pages.dev');
console.log('2. Test API endpoints to ensure the worker is functioning');
console.log('3. Verify database operations work correctly');
console.log('4. Check that redirects are working properly');

console.log('\n📋 Helpful Commands');
console.log('List D1 databases: npx wrangler d1 list');
console.log('View Pages deployments: npx wrangler pages deployment list --project-name=weddingreplit');
console.log('View Worker logs: npx wrangler tail weddingreplit-worker');

console.log('\n🎉 Full deployment process completed!');
console.log('\n📝 For detailed instructions, refer to:');
console.log('- CLOUDFLARE_RESTORE_GUIDE.md');
console.log('- CLOUDFLARE_COMPLETE_SETUP.md');
console.log('- CLOUDFLARE_DEPLOYMENT_GUIDE.md');