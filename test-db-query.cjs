const sqlite3 = require('better-sqlite3');
const db = new sqlite3('./.db/dev.db');

// Test querying a wedding by secret link
try {
  const stmt = db.prepare('SELECT * FROM weddings WHERE admin_secret_link = ?');
  const wedding = stmt.get('admin_secret456');
  
  if (wedding) {
    console.log('Found wedding with secret link:');
    console.log('ID:', wedding.id);
    console.log('Bride:', wedding.bride_name);
    console.log('Groom:', wedding.groom_name);
  } else {
    console.log('No wedding found with the provided secret link');
  }
} catch (error) {
  console.error('Error querying database:', error.message);
}

// Test querying a wedding by secret link that doesn't exist
try {
  const stmt = db.prepare('SELECT * FROM weddings WHERE admin_secret_link = ?');
  const wedding = stmt.get('nonexistent_secret');
  
  if (wedding) {
    console.log('Found wedding with nonexistent secret link:', wedding);
  } else {
    console.log('Correctly returned null for nonexistent secret link');
  }
} catch (error) {
  console.error('Error querying database:', error.message);
}