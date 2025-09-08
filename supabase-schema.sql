-- Create business_ideas table
CREATE TABLE business_ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt TEXT NOT NULL,
  generated_idea JSONB NOT NULL,
  filters JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0
);

-- Create indexes for performance
CREATE INDEX idx_business_ideas_created_at ON business_ideas(created_at DESC);
CREATE INDEX idx_business_ideas_user_id ON business_ideas(user_id);
CREATE INDEX idx_business_ideas_public ON business_ideas(is_public) WHERE is_public = true;

-- Enable Row Level Security (RLS)
ALTER TABLE business_ideas ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to read their own ideas
CREATE POLICY "Users can view own ideas" ON business_ideas 
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own ideas
CREATE POLICY "Users can insert own ideas" ON business_ideas 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own ideas
CREATE POLICY "Users can update own ideas" ON business_ideas 
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own ideas
CREATE POLICY "Users can delete own ideas" ON business_ideas 
  FOR DELETE USING (auth.uid() = user_id);

-- Allow everyone to read public ideas
CREATE POLICY "Everyone can view public ideas" ON business_ideas 
  FOR SELECT USING (is_public = true);

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(idea_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE business_ideas 
  SET view_count = view_count + 1 
  WHERE id = idea_id;
END;
$$; 