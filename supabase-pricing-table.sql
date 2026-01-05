-- Create pricing_table table
CREATE TABLE IF NOT EXISTS pricing_table (
  id BIGSERIAL PRIMARY KEY,
  frequency TEXT NOT NULL,
  class_type TEXT,
  middle_high TEXT,
  adult TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE pricing_table ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON pricing_table
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated users to update" ON pricing_table
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert" ON pricing_table
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Insert initial data
INSERT INTO pricing_table (frequency, class_type, middle_high, adult) VALUES
('주2회', '', '', '14만원(VAT포함)'),
('주3회', '', '', '16만원(VAT포함)'),
('주5회', '', '', '18만원(VAT포함)'),
('쿠폰제(10회)', '22만원
(4개월제한)', '도복(입문용)', '10만원');
