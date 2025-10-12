import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../client/public/assets');
const outputDir = path.join(__dirname, '../dist/public/assets');

// Image optimization configurations
const imageConfigs = {
  webp: {
    quality: 80,
    format: 'webp'
  },
  avif: {
    quality: 70,
    format: 'avif'
  },
  jpeg: {
    quality: 85,
    format: 'jpeg'
  },
  png: {
    quality: 90,
    format: 'png'
  }
};

// Responsive image sizes
const responsiveSizes = [
  { width: 320, suffix: 'sm' },
  { width: 640, suffix: 'md' },
  { width: 1024, suffix: 'lg' },
  { width: 1280, suffix: 'xl' },
  { width: 1920, suffix: '2xl' }
];

async function ensureDirectoryExists(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function optimizeImage(inputPath, outputDir, filename) {
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  
  console.log(`Optimizing ${filename} (${metadata.width}x${metadata.height})`);
  
  const results = [];
  
  // Generate responsive sizes
  for (const size of responsiveSizes) {
    if (metadata.width >= size.width) {
      for (const [format, config] of Object.entries(imageConfigs)) {
        const outputPath = path.join(outputDir, `${filename}-${size.suffix}.${format}`);
        
        await image
          .resize(size.width, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          .toFormat(config.format, { quality: config.quality })
          .toFile(outputPath);
        
        const stats = await fs.stat(outputPath);
        results.push({
          path: outputPath,
          format,
          size: size.suffix,
          width: size.width,
          fileSize: stats.size
        });
      }
    }
  }
  
  // Generate original size in all formats
  for (const [format, config] of Object.entries(imageConfigs)) {
    const outputPath = path.join(outputDir, `${filename}.${format}`);
    
    await image
      .toFormat(config.format, { quality: config.quality })
      .toFile(outputPath);
    
    const stats = await fs.stat(outputPath);
    results.push({
      path: outputPath,
      format,
      size: 'original',
      width: metadata.width,
      fileSize: stats.size
    });
  }
  
  return results;
}

async function generateImageManifest(optimizedImages) {
  const manifest = {};
  
  for (const image of optimizedImages) {
    const baseName = path.basename(image.path, `.${image.format}`);
    const originalName = baseName.replace(/-(sm|md|lg|xl|2xl)$/, '');
    
    if (!manifest[originalName]) {
      manifest[originalName] = {};
    }
    
    if (!manifest[originalName][image.format]) {
      manifest[originalName][image.format] = {};
    }
    
    manifest[originalName][image.format][image.size] = {
      path: image.path.replace(/.*\/dist\/public/, ''),
      width: image.width,
      fileSize: image.fileSize
    };
  }
  
  return manifest;
}

async function createResponsiveImageComponent(manifest) {
  const componentCode = `// Auto-generated responsive image component
import React from 'react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  loading = 'lazy',
  priority = false
}) => {
  const imageManifest = ${JSON.stringify(manifest, null, 2)};
  
  const getImageSrc = (imageName: string, format: string = 'webp') => {
    const image = imageManifest[imageName];
    if (!image || !image[format]) return src;
    
    // Return the largest available size
    const sizes = ['2xl', 'xl', 'lg', 'md', 'sm', 'original'];
    for (const size of sizes) {
      if (image[format][size]) {
        return image[format][size].path;
      }
    }
    
    return src;
  };
  
  const getSrcSet = (imageName: string, format: string = 'webp') => {
    const image = imageManifest[imageName];
    if (!image || !image[format]) return '';
    
    const srcSet = [];
    const sizes = ['sm', 'md', 'lg', 'xl', '2xl'];
    
    for (const size of sizes) {
      if (image[format][size]) {
        srcSet.push(\`\${image[format][size].path} \${image[format][size].width}w\`);
      }
    }
    
    return srcSet.join(', ');
  };
  
  const imageName = src.replace(/.*\\//, '').replace(/\\.[^.]*$/, '');
  const webpSrc = getImageSrc(imageName, 'webp');
  const webpSrcSet = getSrcSet(imageName, 'webp');
  const fallbackSrc = getImageSrc(imageName, 'jpeg');
  const fallbackSrcSet = getSrcSet(imageName, 'jpeg');
  
  return (
    <picture>
      {webpSrcSet && (
        <source
          srcSet={webpSrcSet}
          sizes={sizes}
          type="image/webp"
        />
      )}
      <img
        src={fallbackSrc}
        srcSet={fallbackSrcSet}
        sizes={sizes}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : loading}
        decoding="async"
      />
    </picture>
  );
};
`;

  const outputPath = path.join(__dirname, '../client/src/components/ResponsiveImage.tsx');
  await fs.writeFile(outputPath, componentCode);
  console.log('Generated ResponsiveImage component');
}

async function main() {
  try {
    console.log('Starting image optimization...');
    
    // Ensure output directory exists
    await ensureDirectoryExists(outputDir);
    
    // Read all images from input directory
    const files = await fs.readdir(inputDir);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i.test(file)
    );
    
    if (imageFiles.length === 0) {
      console.log('No images found to optimize');
      return;
    }
    
    console.log(`Found ${imageFiles.length} images to optimize`);
    
    const allOptimizedImages = [];
    
    // Optimize each image
    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file);
      const filename = path.parse(file).name;
      
      try {
        const results = await optimizeImage(inputPath, outputDir, filename);
        allOptimizedImages.push(...results);
      } catch (error) {
        console.error(`Error optimizing ${file}:`, error.message);
      }
    }
    
    console.log(`Optimized ${allOptimizedImages.length} image variants`);
    
    // Generate manifest
    const manifest = await generateImageManifest(allOptimizedImages);
    const manifestPath = path.join(outputDir, 'image-manifest.json');
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('Generated image manifest');
    
    // Generate responsive image component
    await createResponsiveImageComponent(manifest);
    
    // Print optimization summary
    const totalSize = allOptimizedImages.reduce((sum, img) => sum + img.fileSize, 0);
    const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
    
    console.log('\\nOptimization Summary:');
    console.log(`Total images: ${allOptimizedImages.length}`);
    console.log(`Total size: ${totalSizeMB} MB`);
    console.log(`Average size per image: ${(totalSize / allOptimizedImages.length / 1024).toFixed(2)} KB`);
    
    // Format breakdown
    const formatBreakdown = {};
    allOptimizedImages.forEach(img => {
      formatBreakdown[img.format] = (formatBreakdown[img.format] || 0) + 1;
    });
    
    console.log('\\nFormat breakdown:');
    Object.entries(formatBreakdown).forEach(([format, count]) => {
      console.log(`  ${format}: ${count} images`);
    });
    
    console.log('\\nImage optimization completed successfully!');
    
  } catch (error) {
    console.error('Error during image optimization:', error);
    process.exit(1);
  }
}

// Run the optimization
main();