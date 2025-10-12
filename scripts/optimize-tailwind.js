import fs from 'fs';
import path from 'path';

/**
 * Script to optimize Tailwind CSS configuration for smaller bundle size
 */

// Function to analyze CSS usage and suggest optimizations
function analyzeTailwindUsage() {
  console.log('🔍 Analyzing Tailwind CSS usage...');
  
  // Check which components are using Tailwind classes
  const srcDir = path.join(process.cwd(), 'client', 'src');
  const files = getAllFiles(srcDir, ['.tsx', '.ts', '.jsx', '.js']);
  
  const classUsage = new Map();
  const unusedClasses = new Set();
  
  // Read all files and extract Tailwind classes
  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      // Simple regex to find class names (this is a basic implementation)
      const classMatches = content.match(/class(Name)?=("|'){1,2}([^"']+)/g);
      
      if (classMatches) {
        classMatches.forEach(match => {
          const classes = match.split('"')[1] || match.split("'")[1];
          if (classes) {
            classes.split(' ').forEach(className => {
              if (className) {
                classUsage.set(className, (classUsage.get(className) || 0) + 1);
              }
            });
          }
        });
      }
    } catch (error) {
      console.warn(`⚠️  Could not read file ${file}: ${error.message}`);
    }
  });
  
  console.log(`✅ Analyzed ${files.length} files`);
  console.log(`📊 Found ${classUsage.size} unique classes in use`);
  
  return { classUsage, unusedClasses };
}

// Function to get all files with specific extensions
function getAllFiles(dir, extensions) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(file, extensions));
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(file);
      }
    }
  });
  
  return results;
}

// Function to optimize Tailwind configuration
function optimizeTailwindConfig() {
  console.log('⚙️  Optimizing Tailwind configuration...');
  
  const configPath = path.join(process.cwd(), 'tailwind.config.ts');
  
  try {
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    // Add purge options to reduce CSS bundle size
    const purgeConfig = `
  purge: {
    content: [
      './client/index.html',
      './client/src/**/*.{js,jsx,ts,tsx}',
      './client/src/components/**/*.{js,jsx,ts,tsx}',
      './client/src/pages/**/*.{js,jsx,ts,tsx}'
    ],
    options: {
      safelist: [
        // Add any classes that are dynamically generated
        'bg-red-500',
        'text-white',
        // Add more as needed
      ],
      blocklist: [
        // Add any classes you want to exclude
        // 'text-9xl', // Example: exclude extremely large text classes
      ]
    }
  },`;
    
    // Check if purge is already configured
    if (!configContent.includes('purge:')) {
      // Insert purge configuration after the content array
      configContent = configContent.replace(
        /(content: \[[^\]]*\],)/,
        `$1${purgeConfig}`
      );
      
      fs.writeFileSync(configPath, configContent);
      console.log('✅ Added purge configuration to Tailwind config');
    } else {
      console.log('✅ Purge configuration already exists');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error optimizing Tailwind config:', error.message);
    return false;
  }
}

// Function to suggest image optimizations
function suggestImageOptimizations() {
  console.log('🖼️  Analyzing image optimization opportunities...');
  
  const publicDir = path.join(process.cwd(), 'client', 'public');
  const imageFiles = getAllFiles(publicDir, ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']);
  
  console.log(`✅ Found ${imageFiles.length} image files`);
  
  // Check for large images that could be optimized
  const largeImages = [];
  imageFiles.forEach(file => {
    try {
      const stats = fs.statSync(file);
      const sizeInKB = stats.size / 1024;
      
      if (sizeInKB > 100) { // Images larger than 100KB
        largeImages.push({
          file: path.relative(publicDir, file),
          size: `${sizeInKB.toFixed(2)} KB`
        });
      }
    } catch (error) {
      console.warn(`⚠️  Could not get stats for ${file}: ${error.message}`);
    }
  });
  
  if (largeImages.length > 0) {
    console.log('⚠️  Large images found that could be optimized:');
    largeImages.slice(0, 5).forEach(img => {
      console.log(`  - ${img.file} (${img.size})`);
    });
    
    if (largeImages.length > 5) {
      console.log(`  ... and ${largeImages.length - 5} more`);
    }
  } else {
    console.log('✅ No large images found');
  }
  
  return largeImages;
}

// Function to suggest unused CSS removal
function suggestUnusedCSSRemoval() {
  console.log('🧹 Analyzing unused CSS...');
  
  // This is a placeholder for more advanced unused CSS detection
  console.log('💡 Suggestions for removing unused CSS:');
  console.log('  1. Use PurgeCSS in production builds');
  console.log('  2. Remove unused components from Tailwind safelist');
  console.log('  3. Audit custom CSS files for unused styles');
  console.log('  4. Use CSS minification in production');
}

// Main function
function main() {
  console.log('🚀 TheGoanWedding Performance Optimization Script');
  console.log('=============================================\n');
  
  // Analyze Tailwind usage
  const usageData = analyzeTailwindUsage();
  
  // Optimize Tailwind configuration
  const configOptimized = optimizeTailwindConfig();
  
  // Suggest image optimizations
  const largeImages = suggestImageOptimizations();
  
  // Suggest unused CSS removal
  suggestUnusedCSSRemoval();
  
  console.log('\n🎉 Performance optimization analysis completed!');
  console.log('\n📋 Recommendations:');
  console.log('1. Run Lighthouse audit to get detailed performance scores');
  console.log('2. Optimize large images using compression tools');
  console.log('3. Review and refine Tailwind safelist based on actual usage');
  console.log('4. Consider lazy loading for images below the fold');
  console.log('5. Implement code splitting for JavaScript bundles');
  
  if (configOptimized) {
    console.log('\n🔧 Next steps:');
    console.log('1. Restart development server to apply Tailwind changes');
    console.log('2. Test that all UI components still render correctly');
    console.log('3. Run production build to verify bundle size reduction');
  }
}

// Run the script
main();