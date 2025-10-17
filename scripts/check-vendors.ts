import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Simple env loader for .env.local
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error(`.env.local not found at ${envPath}`);
  }
  const contents = fs.readFileSync(envPath, 'utf-8');
  const lines = contents.split('\n');
  const env: Record<string, string> = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split('=');
    const value = rest.join('=');
    if (key && value !== undefined) {
      env[key] = value;
    }
  }
  return env;
}

async function main() {
  const env = loadEnv();
  const url = env['VITE_SUPABASE_URL'];
  const key = env['VITE_SUPABASE_ANON_KEY'];
  if (!url || !key) {
    throw new Error('Supabase URL or key missing in .env.local');
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase.from('vendors').select('*');
  if (error) {
    console.error('Error fetching vendors:', error);
    process.exit(1);
  }

  console.log(`Total vendors: ${data?.length || 0}`);
  if (data && data.length) {
    console.log('Sample vendor IDs:', data.slice(0, 5).map((row) => row.id));
    console.log('ID types:', data.slice(0, 5).map((row) => typeof row.id));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
