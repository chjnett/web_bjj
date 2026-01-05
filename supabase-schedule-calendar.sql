-- Create schedule_calendar table
CREATE TABLE IF NOT EXISTS schedule_calendar (
  id BIGSERIAL PRIMARY KEY,
  category TEXT,
  time_slot TEXT NOT NULL,
  mon TEXT,
  tue TEXT,
  wed TEXT,
  thu TEXT,
  fri TEXT,
  sat TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE schedule_calendar ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON schedule_calendar
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated users to update" ON schedule_calendar
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert" ON schedule_calendar
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Insert initial data
INSERT INTO schedule_calendar (category, time_slot, mon, tue, wed, thu, fri, sat) VALUES
('키즈수업', '초등1부 2:30~3:20', '도복 수련', '', '도복 수련', '', '도복 수련', ''),
('키즈수업', '유초등2부 4:30~5:20', '', '', '도복 수련', '', '', ''),
('키즈수업', '초등3부 5:30~6:20', '', '', '도복 수련', '', '', ''),
('오후', '8:00 ~ 9:00', '도복', '도복', '도복', '도복', '도복', ''),
('오후', '9:00 ~ 10:00', '오픈매트', '도복', '오픈매트', '도복
노기(하계)', '', '');
