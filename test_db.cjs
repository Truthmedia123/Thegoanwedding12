const { getDb } = require('./server/db.ts');

console.log('Testing database initialization...');

try {
  const db = getDb({});
  console.log('Database initialized successfully');
} catch (error) {
  console.error('Error initializing database:', error.message);
}