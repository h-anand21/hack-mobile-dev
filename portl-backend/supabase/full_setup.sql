-- ===================================================
-- GATELY COMPLETE SUPABASE DATABASE SETUP SCRIPT
-- Run this script in your Supabase SQL Editor:
-- Dashboard -> SQL Editor -> New Query -> Paste & Run
-- ===================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Societies
CREATE TABLE IF NOT EXISTS societies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Users (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'guard', 'resident')),
  name TEXT NOT NULL,
  phone TEXT UNIQUE,
  avatar_url TEXT,
  society_id UUID REFERENCES societies(id) ON DELETE CASCADE,
  fcm_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Flats
CREATE TABLE IF NOT EXISTS flats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  society_id UUID REFERENCES societies(id) ON DELETE CASCADE,
  tower TEXT NOT NULL,
  flat_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(society_id, tower, flat_number)
);

-- 5. Flat Members
CREATE TABLE IF NOT EXISTS flat_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flat_id UUID REFERENCES flats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_owner BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(flat_id, user_id)
);

-- 6. Visitors
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  society_id UUID REFERENCES societies(id) ON DELETE CASCADE,
  flat_id UUID REFERENCES flats(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  purpose TEXT NOT NULL,
  vehicle_number TEXT,
  photo_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'entered', 'exited')),
  rejection_reason TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Visitor Logs
CREATE TABLE IF NOT EXISTS visitor_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id UUID REFERENCES visitors(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('created', 'approved', 'rejected', 'entered', 'exited')),
  actor_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. QR Passes
CREATE TABLE IF NOT EXISTS qr_passes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  society_id UUID REFERENCES societies(id) ON DELETE CASCADE,
  flat_id UUID REFERENCES flats(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_phone TEXT,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_to TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'used', 'expired', 'cancelled')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Complaints
CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  society_id UUID REFERENCES societies(id) ON DELETE CASCADE,
  flat_id UUID REFERENCES flats(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  ai_tags JSONB,
  status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'resolved')),
  assigned_to UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Notices
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  society_id UUID REFERENCES societies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  published_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Polls
CREATE TABLE IF NOT EXISTS polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  society_id UUID REFERENCES societies(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Poll Votes
CREATE TABLE IF NOT EXISTS poll_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  option_id INT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(poll_id, user_id)
);

-- 13. Amenities
CREATE TABLE IF NOT EXISTS amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  society_id UUID REFERENCES societies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  rules TEXT,
  slots JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. Amenity Bookings
CREATE TABLE IF NOT EXISTS amenity_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  amenity_id UUID REFERENCES amenities(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  flat_id UUID REFERENCES flats(id),
  booking_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Security Policies
ALTER TABLE societies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE flats ENABLE ROW LEVEL SECURITY;
ALTER TABLE flat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenity_bookings ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users full read/write access
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Allow All For Auth Users" ON %I;', t);
    EXECUTE format('CREATE POLICY "Allow All For Auth Users" ON %I FOR ALL USING (true) WITH CHECK (true);', t);
  END LOOP;
END $$;

-- Insert Demo Society & Initial Seed Data
INSERT INTO societies (id, name, address, code)
VALUES (
  '11111111-1111-1111-1111-111111111111', 
  'Gately Grand Residency', 
  '123 Smart City, Sector 4, Bangalore', 
  'GATELY-001'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO flats (id, society_id, tower, flat_number)
VALUES 
  ('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 'Tower A', '101'),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Tower A', '102'),
  ('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111111', 'Tower B', '201')
ON CONFLICT (id) DO NOTHING;

INSERT INTO amenities (id, society_id, name, description, rules, slots)
VALUES 
  ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', 'Swimming Pool', 'Main society swimming pool', 'Swimsuit mandatory. No food allowed.', '["06:00-07:00", "07:00-08:00", "08:00-09:00", "17:00-18:00", "18:00-19:00"]'),
  ('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', 'Badminton Court', 'Indoor badminton court', 'Non-marking shoes only.', '["06:00-07:00", "07:00-08:00", "18:00-19:00", "19:00-20:00", "20:00-21:00"]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO notices (society_id, title, content, category)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Water Supply Interruption', 'Water supply will be interrupted on Sunday from 10 AM to 2 PM for maintenance.', 'Maintenance'),
  ('11111111-1111-1111-1111-111111111111', 'Diwali Celebration', 'Join us for the grand Diwali celebration in the main park on Friday evening!', 'Events');

INSERT INTO polls (society_id, question, options, ends_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Should we hire an additional security guard for the night shift?', '[{"id": 1, "text": "Yes"}, {"id": 2, "text": "No"}]', NOW() + interval '7 days');

