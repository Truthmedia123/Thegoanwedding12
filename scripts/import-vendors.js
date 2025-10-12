import { drizzle } from 'drizzle-orm/d1';
import { vendors, categories } from '../shared/schema.js';
import fs from 'fs';
import path from 'path';

// CSV format expected:
// name,category,description,phone,email,whatsapp,location,address,website,instagram,facebook,services,price_range,featured,verified

async function importVendorsFromCSV(csvFilePath, db) {
  try {
    console.log('Reading CSV file:', csvFilePath);
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    console.log('Headers found:', headers);
    
    const vendorData = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(v => v.trim());
      const vendor = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        switch (header) {
          case 'featured':
          case 'verified':
            vendor[header] = value.toLowerCase() === 'true';
            break;
          case 'services':
            vendor[header] = value ? JSON.stringify(value.split(';')) : null;
            break;
          default:
            vendor[header] = value;
        }
      });
      
      // Add default values
      vendor.rating = 0;
      vendor.reviewCount = 0;
      vendor.createdAt = new Date();
      
      vendorData.push(vendor);
    }
    
    console.log(`Found ${vendorData.length} vendors to import`);
    
    // Insert vendors in batches
    const batchSize = 10;
    for (let i = 0; i < vendorData.length; i += batchSize) {
      const batch = vendorData.slice(i, i + batchSize);
      console.log(`Importing batch ${Math.floor(i/batchSize) + 1}...`);
      
      for (const vendor of batch) {
        try {
          await db.insert(vendors).values(vendor);
          console.log(`✓ Imported: ${vendor.name}`);
        } catch (error) {
          console.error(`✗ Failed to import ${vendor.name}:`, error.message);
        }
      }
    }
    
    console.log('Import completed!');
    
  } catch (error) {
    console.error('Import failed:', error);
  }
}

// Usage: node scripts/import-vendors.js path/to/vendors.csv
async function main() {
  const csvPath = process.argv[2];
  
  if (!csvPath) {
    console.error('Usage: node scripts/import-vendors.js path/to/vendors.csv');
    process.exit(1);
  }
  
  if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found:', csvPath);
    process.exit(1);
  }
  
  // For local development, you'll need to provide the database connection
  // This would typically be done through environment variables
  console.log('Note: This script requires a database connection to be configured');
  console.log('For local development, use: wrangler d1 execute wedding_platform_db --local --file=import.sql');
  console.log('For production, use: wrangler d1 execute wedding_platform_db --file=import.sql');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { importVendorsFromCSV };
