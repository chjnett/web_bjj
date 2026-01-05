-- OSJ 청라 주짓수 Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create news_posts table
CREATE TABLE IF NOT EXISTS news_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create schedules table
CREATE TABLE IF NOT EXISTS schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_name TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pricing table
CREATE TABLE IF NOT EXISTS pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  price TEXT NOT NULL,
  benefits JSONB DEFAULT '[]'::jsonb,
  type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  visitor_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_news_posts_created_at ON news_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_schedules_start_time ON schedules(start_time);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);

-- Insert default schedules
INSERT INTO schedules (class_name, start_time, end_time, description) VALUES
('키즈 1부', '14:30', '15:30', '초등 저학년'),
('키즈 2부', '16:30', '17:30', '초등 고학년'),
('키즈 3부', '17:30', '18:30', '중학생'),
('성인 1부', '20:00', '21:00', '기초/초급'),
('성인 2부', '21:00', '22:00', '중급/고급')
ON CONFLICT DO NOTHING;

-- Insert default pricing
INSERT INTO pricing (title, price, benefits, type) VALUES
('주 2회', '110,000', '["월 8회 수업", "도복 대여 가능", "샤워실 이용"]'::jsonb, 'basic'),
('주 3회', '140,000', '["월 12회 수업", "도복 대여 가능", "샤워실 이용", "개인 락커"]'::jsonb, 'standard'),
('주 5회 (무제한)', '180,000', '["무제한 수업", "도복 대여 가능", "샤워실 이용", "개인 락커", "프리 오픈매트"]'::jsonb, 'premium'),
('10회 쿠폰제', '220,000', '["3개월 유효", "자유로운 스케줄", "도복 대여 가능"]'::jsonb, 'coupon')
ON CONFLICT DO NOTHING;

-- Set up Row Level Security (RLS)
ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on news_posts" ON news_posts
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on schedules" ON schedules
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on pricing" ON pricing
  FOR SELECT USING (true);

-- Create policies for public insert on inquiries and analytics
CREATE POLICY "Allow public insert on inquiries" ON inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert on analytics" ON analytics
  FOR INSERT WITH CHECK (true);

-- Create policies for authenticated admin access
CREATE POLICY "Allow authenticated users full access on news_posts" ON news_posts
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access on schedules" ON schedules
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users full access on pricing" ON pricing
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users read access on inquiries" ON inquiries
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users read access on analytics" ON analytics
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create storage bucket for news images
INSERT INTO storage.buckets (id, name, public)
VALUES ('news-images', 'news-images', true)
ON CONFLICT DO NOTHING;

-- Create storage policies
CREATE POLICY "Public read access on news-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'news-images');

CREATE POLICY "Authenticated users can upload to news-images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'news-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete from news-images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'news-images' AND
    auth.role() = 'authenticated'
  );

-- Function to send email notification when inquiry is inserted
-- This will be called by the Edge Function trigger
CREATE OR REPLACE FUNCTION handle_new_inquiry()
RETURNS TRIGGER AS $$
BEGIN
  -- The actual email sending is handled by Supabase Edge Functions
  -- This function is here for future webhook integration if needed
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new inquiries
CREATE TRIGGER on_inquiry_created
  AFTER INSERT ON inquiries
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_inquiry();
