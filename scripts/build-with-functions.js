import { execSync } from 'child_process';
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Build the client
console.log('Building client...');
execSync('npm run build', { stdio: 'inherit', cwd: rootDir });

// Copy functions to dist
console.log('Copying functions...');
const functionsDir = join(rootDir, 'functions');
const distFunctionsDir = join(rootDir, 'dist', 'functions');

function copyDir(src, dest) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }
  
  const entries = readdirSync(src);
  
  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    
    if (statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

if (existsSync(functionsDir)) {
  copyDir(functionsDir, distFunctionsDir);
  console.log('Functions copied successfully!');
} else {
  console.log('No functions directory found');
}

console.log('Build complete!');
