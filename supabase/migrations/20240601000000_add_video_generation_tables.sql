-- Create video_generations table
CREATE TABLE IF NOT EXISTS video_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  audio_url TEXT,
  script TEXT,
  video_type TEXT NOT NULL CHECK (video_type IN ('portfolio', 'resume')),
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE SET NULL,
  resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
  voice_style TEXT DEFAULT 'professional',
  theme TEXT DEFAULT 'modern',
  music_style TEXT DEFAULT 'ambient',
  duration INTEGER DEFAULT 60,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'error')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for video_generations
ALTER TABLE video_generations ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own video generations
CREATE POLICY "Users can view their own video generations" 
  ON video_generations 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for users to insert their own video generations
CREATE POLICY "Users can insert their own video generations" 
  ON video_generations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own video generations
CREATE POLICY "Users can update their own video generations" 
  ON video_generations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy for users to delete their own video generations
CREATE POLICY "Users can delete their own video generations" 
  ON video_generations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Insert a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_video_generation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_video_generation_updated_at
BEFORE UPDATE ON video_generations
FOR EACH ROW
EXECUTE FUNCTION update_video_generation_updated_at();

-- Add video generation stats view
CREATE OR REPLACE VIEW video_generation_stats AS
SELECT 
  user_id,
  COUNT(*) FILTER (WHERE video_type = 'portfolio') AS portfolio_videos_count,
  COUNT(*) FILTER (WHERE video_type = 'resume') AS resume_videos_count,
  COUNT(*) FILTER (WHERE status = 'completed') AS completed_videos_count,
  COUNT(*) FILTER (WHERE status = 'error') AS failed_videos_count,
  COUNT(*) AS total_videos_count
FROM video_generations
GROUP BY user_id;

-- Add demo data
INSERT INTO video_generations (
  user_id,
  title,
  description,
  video_url,
  audio_url,
  script,
  video_type,
  voice_style,
  theme,
  music_style,
  duration,
  status
)
SELECT
  id,
  'My Professional Portfolio Video',
  'A showcase of my professional skills and experience',
  'https://example.com/videos/portfolio-demo.mp4',
  'https://example.com/audios/portfolio-narration.mp3',
  'Hello, I am a professional developer with experience in web development...',
  'portfolio',
  'professional',
  'modern',
  'ambient',
  60,
  'completed'
FROM auth.users
WHERE NOT EXISTS (SELECT 1 FROM video_generations LIMIT 1)
LIMIT 1; 