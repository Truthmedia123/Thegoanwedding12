// Script to initialize D1 database schema
console.log('Initializing D1 database schema...');

// This would typically be run with wrangler d1 execute
// For now, we'll just output the SQL commands that need to be run

const schemaSQL = `
CREATE TABLE IF NOT EXISTS vendors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  website TEXT,
  instagram TEXT,
  youtube TEXT,
  facebook TEXT,
  profile_image TEXT,
  cover_image TEXT,
  gallery TEXT,
  services TEXT,
  price_range TEXT,
  featured INTEGER DEFAULT 0,
  verified INTEGER DEFAULT 0,
  rating REAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS weddings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bride_name TEXT NOT NULL,
  groom_name TEXT NOT NULL,
  wedding_date INTEGER NOT NULL,
  venue TEXT NOT NULL,
  venue_address TEXT NOT NULL,
  ceremony_time TEXT NOT NULL,
  reception_time TEXT,
  cover_image TEXT,
  gallery_images TEXT,
  story TEXT,
  slug TEXT NOT NULL,
  max_guests INTEGER DEFAULT 100,
  is_public INTEGER DEFAULT 1,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  created_at INTEGER,
  ceremony_venue TEXT,
  ceremony_venue_address TEXT,
  reception_venue TEXT,
  reception_venue_address TEXT,
  admin_secret_link TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS wedding_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wedding_id INTEGER NOT NULL REFERENCES weddings(id),
  name TEXT NOT NULL,
  description TEXT,
  date INTEGER NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  venue TEXT NOT NULL,
  address TEXT NOT NULL,
  dress_code TEXT,
  is_private INTEGER DEFAULT 0,
  max_guests INTEGER,
  "order" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS rsvp_invitations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wedding_id INTEGER NOT NULL REFERENCES weddings(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  invitation_code TEXT NOT NULL UNIQUE,
  max_guests INTEGER DEFAULT 1,
  allow_plus_one INTEGER DEFAULT 0,
  invited_events TEXT,
  is_family INTEGER DEFAULT 0,
  status TEXT DEFAULT 'sent',
  sent_at INTEGER,
  viewed_at INTEGER,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS rsvps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wedding_id INTEGER NOT NULL REFERENCES weddings(id),
  invitation_id INTEGER NOT NULL REFERENCES rsvp_invitations(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  attending_ceremony INTEGER DEFAULT 1,
  attending_reception INTEGER DEFAULT 1,
  number_of_guests INTEGER DEFAULT 1,
  dietary_restrictions TEXT,
  message TEXT,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS rsvp_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wedding_id INTEGER NOT NULL REFERENCES weddings(id),
  question TEXT NOT NULL,
  type TEXT NOT NULL,
  options TEXT,
  required INTEGER DEFAULT 0,
  event_specific TEXT,
  "order" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS rsvp_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  rsvp_id INTEGER NOT NULL REFERENCES rsvps(id),
  question_id INTEGER NOT NULL REFERENCES rsvp_questions(id),
  answer TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vendor_id INTEGER REFERENCES vendors(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  rating INTEGER NOT NULL,
  comment TEXT NOT NULL,
  images TEXT,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  vendor_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  category TEXT NOT NULL,
  tags TEXT,
  published INTEGER DEFAULT 0,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS business_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  website TEXT,
  instagram TEXT,
  facebook TEXT,
  services TEXT,
  price_range TEXT,
  status TEXT DEFAULT 'pending',
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at INTEGER
);
`;

console.log('To initialize your D1 database, run the following command:');
console.log('');
console.log('npx wrangler d1 execute wedding_platform_db --command="' + schemaSQL.replace(/"/g, '\\"') + '"');
console.log('');
console.log('Or save the schema to a file and run:');
console.log('npx wrangler d1 execute wedding_platform_db --file=./schema.sql');