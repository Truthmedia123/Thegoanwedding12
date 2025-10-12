#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES_DIR = path.join(__dirname, '..', 'client', 'public', 'locales');
const SOURCE_LOCALE = 'en.json';
const TARGET_LOCALES = ['kn.json', 'pt.json'];

/**
 * Recursively flattens a nested object into dot notation keys
 * Example: { common: { loading: "Loading..." } } -> { "common.loading": "Loading..." }
 */
function flattenObject(obj, prefix = '') {
  const flattened = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else {
      flattened[newKey] = value;
    }
  }
  
  return flattened;
}

/**
 * Reconstructs a nested object from flattened dot notation keys
 * Example: { "common.loading": "Loading..." } -> { common: { loading: "Loading..." } }
 */
function unflattenObject(flatObj) {
  const result = {};
  
  for (const [key, value] of Object.entries(flatObj)) {
    const keys = key.split('.');
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!(k in current)) {
        current[k] = {};
      }
      current = current[k];
    }
    
    current[keys[keys.length - 1]] = value;
  }
  
  return result;
}

/**
 * Sorts object keys alphabetically at all levels
 */
function sortObjectKeys(obj) {
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
    return obj;
  }
  
  const sorted = {};
  const keys = Object.keys(obj).sort();
  
  for (const key of keys) {
    sorted[key] = sortObjectKeys(obj[key]);
  }
  
  return sorted;
}

/**
 * Merges new keys from source into target, preserving existing translations
 */
function mergeTranslations(sourceFlat, targetFlat) {
  const merged = { ...targetFlat };
  
  // Add any new keys from source that don't exist in target
  for (const [key, value] of Object.entries(sourceFlat)) {
    if (!(key in merged)) {
      merged[key] = ''; // Empty string for missing translations
      console.log(`  ➕ Added new key: ${key}`);
    }
  }
  
  // Remove any keys from target that no longer exist in source
  for (const key of Object.keys(merged)) {
    if (!(key in sourceFlat)) {
      delete merged[key];
      console.log(`  ➖ Removed obsolete key: ${key}`);
    }
  }
  
  return merged;
}

/**
 * Main sync function
 */
async function syncTranslations() {
  try {
    console.log('🌐 Starting translation synchronization...\n');
    
    // Read source (English) translations
    const sourcePath = path.join(LOCALES_DIR, SOURCE_LOCALE);
    const sourceContent = await fs.readFile(sourcePath, 'utf-8');
    const sourceTranslations = JSON.parse(sourceContent);
    const sourceFlat = flattenObject(sourceTranslations);
    
    console.log(`📖 Loaded ${Object.keys(sourceFlat).length} keys from ${SOURCE_LOCALE}`);
    
    // Process each target locale
    for (const targetLocale of TARGET_LOCALES) {
      console.log(`\n🔄 Processing ${targetLocale}:`);
      
      const targetPath = path.join(LOCALES_DIR, targetLocale);
      let targetTranslations = {};
      let targetFlat = {};
      
      // Try to read existing target file
      try {
        const targetContent = await fs.readFile(targetPath, 'utf-8');
        targetTranslations = JSON.parse(targetContent);
        targetFlat = flattenObject(targetTranslations);
        console.log(`  📖 Loaded ${Object.keys(targetFlat).length} existing keys`);
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.log(`  📝 Creating new file ${targetLocale}`);
        } else {
          console.error(`  ❌ Error reading ${targetLocale}:`, error.message);
          continue;
        }
      }
      
      // Merge translations
      const mergedFlat = mergeTranslations(sourceFlat, targetFlat);
      const mergedNested = unflattenObject(mergedFlat);
      const sortedNested = sortObjectKeys(mergedNested);
      
      // Write back to file
      const formattedJson = JSON.stringify(sortedNested, null, 2);
      await fs.writeFile(targetPath, formattedJson, 'utf-8');
      
      console.log(`  ✅ Updated ${targetLocale} with ${Object.keys(mergedFlat).length} keys`);
    }
    
    // Generate translation status report
    console.log('\n📊 Translation Status Report:');
    console.log('='.repeat(50));
    
    for (const targetLocale of TARGET_LOCALES) {
      const targetPath = path.join(LOCALES_DIR, targetLocale);
      const targetContent = await fs.readFile(targetPath, 'utf-8');
      const targetTranslations = JSON.parse(targetContent);
      const targetFlat = flattenObject(targetTranslations);
      
      const totalKeys = Object.keys(targetFlat).length;
      const translatedKeys = Object.values(targetFlat).filter(value => value !== '').length;
      const completionRate = ((translatedKeys / totalKeys) * 100).toFixed(1);
      
      console.log(`${targetLocale.padEnd(10)} ${translatedKeys.toString().padStart(3)}/${totalKeys.toString().padStart(3)} (${completionRate}%)`);
    }
    
    console.log('\n✅ Translation synchronization completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during translation sync:', error.message);
    process.exit(1);
  }
}

/**
 * Validation function to check for common issues
 */
async function validateTranslations() {
  console.log('\n🔍 Validating translations...');
  
  const issues = [];
  
  try {
    // Check source file
    const sourcePath = path.join(LOCALES_DIR, SOURCE_LOCALE);
    const sourceContent = await fs.readFile(sourcePath, 'utf-8');
    const sourceTranslations = JSON.parse(sourceContent);
    const sourceFlat = flattenObject(sourceTranslations);
    
    // Check for empty values in source
    for (const [key, value] of Object.entries(sourceFlat)) {
      if (!value || value.trim() === '') {
        issues.push(`❌ Empty value in source: ${key}`);
      }
    }
    
    // Check each target locale
    for (const targetLocale of TARGET_LOCALES) {
      const targetPath = path.join(LOCALES_DIR, targetLocale);
      
      try {
        const targetContent = await fs.readFile(targetPath, 'utf-8');
        const targetTranslations = JSON.parse(targetContent);
        const targetFlat = flattenObject(targetTranslations);
        
        // Check for missing keys
        for (const key of Object.keys(sourceFlat)) {
          if (!(key in targetFlat)) {
            issues.push(`❌ Missing key in ${targetLocale}: ${key}`);
          }
        }
        
        // Check for extra keys
        for (const key of Object.keys(targetFlat)) {
          if (!(key in sourceFlat)) {
            issues.push(`⚠️  Extra key in ${targetLocale}: ${key}`);
          }
        }
        
      } catch (error) {
        issues.push(`❌ Invalid JSON in ${targetLocale}: ${error.message}`);
      }
    }
    
    if (issues.length === 0) {
      console.log('✅ All translations are valid!');
    } else {
      console.log(`⚠️  Found ${issues.length} issues:`);
      issues.forEach(issue => console.log(`  ${issue}`));
    }
    
  } catch (error) {
    console.error('❌ Error during validation:', error.message);
  }
}

// CLI handling
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'validate':
      await validateTranslations();
      break;
    case 'sync':
    default:
      await syncTranslations();
      if (command !== 'sync-only') {
        await validateTranslations();
      }
      break;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { syncTranslations, validateTranslations };