-- Seed Data for Portl

-- Insert Demo Society
INSERT INTO societies (id, name, address, code)
VALUES (
  '11111111-1111-1111-1111-111111111111', 
  'Portl Grand Residency', 
  '123 Smart City, Sector 4, Bangalore', 
  'PORTL-001'
) ON CONFLICT (id) DO NOTHING;

-- Note: In a real environment, users are created via Supabase Auth first, 
-- which then triggers a function to create the record in public.users.
-- Since this is seed data, you will need to manually sign up via the app 
-- or use Supabase CLI to seed the auth schema if needed. 
-- The user references below will need real UUIDs from your auth.users table.

-- Insert Demo Flats
INSERT INTO flats (id, society_id, tower, flat_number)
VALUES 
  ('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 'Tower A', '101'),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Tower A', '102'),
  ('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111111', 'Tower B', '201')
ON CONFLICT (id) DO NOTHING;

-- Insert Amenities
INSERT INTO amenities (id, society_id, name, description, rules, slots)
VALUES 
  ('33333333-3333-3333-3333-333333333331', '11111111-1111-1111-1111-111111111111', 'Swimming Pool', 'Main society swimming pool', 'Swimsuit mandatory. No food allowed.', '["06:00-07:00", "07:00-08:00", "08:00-09:00", "17:00-18:00", "18:00-19:00"]'),
  ('33333333-3333-3333-3333-333333333332', '11111111-1111-1111-1111-111111111111', 'Badminton Court', 'Indoor badminton court', 'Non-marking shoes only.', '["06:00-07:00", "07:00-08:00", "18:00-19:00", "19:00-20:00", "20:00-21:00"]')
ON CONFLICT (id) DO NOTHING;

-- Insert Notices
INSERT INTO notices (society_id, title, content, category)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Water Supply Interruption', 'Water supply will be interrupted on Sunday from 10 AM to 2 PM for maintenance.', 'Maintenance'),
  ('11111111-1111-1111-1111-111111111111', 'Diwali Celebration', 'Join us for the grand Diwali celebration in the main park on Friday evening!', 'Events');

-- Insert Polls
INSERT INTO polls (society_id, question, options, ends_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Should we hire an additional security guard for the night shift?', '[{"id": 1, "text": "Yes"}, {"id": 2, "text": "No"}]', NOW() + interval '7 days');
