-- PROFILES TABLE
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  middle_name TEXT,
  last_name TEXT,
  phone_number TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user', -- 'user', 'admin'
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BOOKINGS TABLE
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  location TEXT NOT NULL,
  farm_size TEXT NOT NULL,
  booking_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'completed'
  amount NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own bookings
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Admins can see everything
CREATE POLICY "Admins can view all bookings" ON bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );