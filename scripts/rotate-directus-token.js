import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Script to rotate Directus admin token and enforce security best practices
 */

// Function to generate a secure random token
function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Function to generate a strong password
function generateStrongPassword() {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  // Ensure at least one character from each set
  let password = '';
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest with random characters
  const allChars = lowercase + uppercase + numbers + symbols;
  for (let i = 4; i < 16; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

// Function to update Directus environment file
function updateDirectusEnv() {
  const envPath = path.join(process.cwd(), 'directus-cms', '.env');
  
  try {
    // Read the current env file
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Generate new secure values
    const newKey = generateSecureToken(32);
    const newSecret = generateSecureToken(32);
    const newAdminPassword = generateStrongPassword();
    
    // Update the values
    envContent = envContent.replace(/KEY=.*/, `KEY=${newKey}`);
    envContent = envContent.replace(/SECRET=.*/, `SECRET=${newSecret}`);
    envContent = envContent.replace(/ADMIN_PASSWORD=.*/, `ADMIN_PASSWORD=${newAdminPassword}`);
    
    // Write the updated content
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ Directus security configuration updated successfully!');
    console.log('\nNew credentials:');
    console.log(`🔑 KEY: ${newKey}`);
    console.log(`🔒 SECRET: ${newSecret}`);
    console.log(`👤 ADMIN_PASSWORD: ${newAdminPassword}`);
    console.log('\n⚠️  IMPORTANT: Store these credentials securely and update any references to them.');
    
    return {
      key: newKey,
      secret: newSecret,
      adminPassword: newAdminPassword
    };
  } catch (error) {
    console.error('❌ Error updating Directus environment file:', error.message);
    return null;
  }
}

// Function to update application environment files
function updateAppEnv(newToken) {
  const envPaths = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '.env.development'),
    path.join(process.cwd(), '.env.production')
  ];
  
  envPaths.forEach(envPath => {
    if (fs.existsSync(envPath)) {
      try {
        let envContent = fs.readFileSync(envPath, 'utf8');
        
        // Update or add the DIRECTUS_TOKEN
        if (envContent.includes('DIRECTUS_TOKEN=')) {
          envContent = envContent.replace(/DIRECTUS_TOKEN=.*/, `DIRECTUS_TOKEN=${newToken}`);
        } else {
          envContent += `\nDIRECTUS_TOKEN=${newToken}\n`;
        }
        
        fs.writeFileSync(envPath, envContent);
        console.log(`✅ Updated ${path.basename(envPath)} with new Directus token`);
      } catch (error) {
        console.error(`❌ Error updating ${path.basename(envPath)}:`, error.message);
      }
    }
  });
}

// Function to update admin dashboard token
function updateAdminDashboardToken() {
  const readmePath = path.join(process.cwd(), 'ADMIN_WORKFLOW.md');
  
  if (fs.existsSync(readmePath)) {
    try {
      let content = fs.readFileSync(readmePath, 'utf8');
      const newToken = generateSecureToken(16);
      
      // Update the token in the documentation
      content = content.replace(/token=admin-secret-\d+/, `token=admin-secret-${newToken.substring(0, 8)}`);
      
      fs.writeFileSync(readmePath, content);
      console.log('✅ Updated admin dashboard token in documentation');
      console.log(`📝 New admin dashboard URL parameter: token=admin-secret-${newToken.substring(0, 8)}`);
    } catch (error) {
      console.error('❌ Error updating admin dashboard token:', error.message);
    }
  }
}

// Main function
function main() {
  console.log('🔐 TheGoanWedding Security Hardening Script');
  console.log('========================================\n');
  
  // Rotate Directus credentials
  const newCredentials = updateDirectusEnv();
  
  if (newCredentials) {
    // Update application environment files
    updateAppEnv(newCredentials.adminPassword);
    
    // Update admin dashboard token
    updateAdminDashboardToken();
    
    console.log('\n🎉 Security hardening completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Restart your Directus service to apply the new credentials');
    console.log('2. Update any hardcoded references to the old credentials');
    console.log('3. Test that the application still works with the new configuration');
    console.log('4. Store the new credentials in a secure password manager');
  } else {
    console.log('\n❌ Security hardening failed. Please check the error messages above.');
    process.exit(1);
  }
}

// Run the script
main();