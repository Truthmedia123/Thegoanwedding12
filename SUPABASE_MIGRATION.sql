-- Supabase Migration: Admin Control Panel
-- Run this in Supabase SQL Editor

-- ==============================================
-- 1. PROFILES TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 2. BLOGS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 3. VENDOR ANALYTICS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS vendor_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id INTEGER,
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for analytics performance
CREATE INDEX IF NOT EXISTS idx_vendor_analytics_vendor_event_created 
ON vendor_analytics (vendor_id, event_type, created_at);

-- ==============================================
-- 4. SETTINGS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- 5. AUDIT LOGS TABLE
-- ==============================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  diff_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================
-- ENABLE ROW LEVEL SECURITY
-- ==============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ==============================================
-- RLS POLICIES - PROFILES
-- ==============================================

-- Public can read profiles
CREATE POLICY "Public can read profiles" ON profiles
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Only admins can update roles
CREATE POLICY "Admins can update roles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ==============================================
-- RLS POLICIES - BLOGS
-- ==============================================

-- Public can read published blogs
CREATE POLICY "Public can read published blogs" ON blogs
  FOR SELECT USING (status = 'published');

-- Admins can manage all blogs
CREATE POLICY "Admins can manage blogs" ON blogs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ==============================================
-- RLS POLICIES - VENDOR ANALYTICS
-- ==============================================

-- Public can insert analytics events
CREATE POLICY "Public can insert analytics" ON vendor_analytics
  FOR INSERT WITH CHECK (true);

-- Admins can read all analytics
CREATE POLICY "Admins can read analytics" ON vendor_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ==============================================
-- RLS POLICIES - SETTINGS
-- ==============================================

-- Only admins can access settings
CREATE POLICY "Admins can manage settings" ON settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ==============================================
-- RLS POLICIES - AUDIT LOGS
-- ==============================================

-- Only admins can access audit logs
CREATE POLICY "Admins can manage audit logs" ON audit_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ==============================================
-- TRIGGERS AND FUNCTIONS
-- ==============================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON blogs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- INSERT DEFAULT DATA
-- ==============================================

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
('site_title', '"TheGoanWedding"', 'Site title'),
('site_description', '"Premier Wedding Vendor Directory for Goa"', 'Site description'),
('theme_colors', '{"primary": "#ec4899", "secondary": "#8b5cf6", "accent": "#10b981"}', 'Theme colors'),
('logo_url', '""', 'Site logo URL'),
('favicon_url', '""', 'Favicon URL'),
('ga_tracking_id', '"G-YBTQGR4T4Y"', 'Google Analytics tracking ID'),
('clarity_project_id', '"tnghvs6g11"', 'Microsoft Clarity project ID')
ON CONFLICT (key) DO NOTHING;
