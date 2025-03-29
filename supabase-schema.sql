-- User Profiles Table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE,
  full_name TEXT,
  bio TEXT,
  headline TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  website TEXT,
  avatar_url TEXT,
  social_links JSONB,
  wallet_address TEXT,
  subscription_plan TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Portfolios Table
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE,
  is_public BOOLEAN DEFAULT false,
  theme TEXT DEFAULT 'default',
  custom_css TEXT,
  custom_domain TEXT,
  sections JSONB,
  metadata JSONB,
  ipfs_hash TEXT,
  blockchain_verification_tx TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster portfolio lookups
CREATE INDEX portfolios_user_id_idx ON portfolios(user_id);
CREATE INDEX portfolios_slug_idx ON portfolios(slug);

-- Resumes Table
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  template TEXT DEFAULT 'standard',
  is_public BOOLEAN DEFAULT false,
  ipfs_hash TEXT,
  blockchain_verification_tx TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster resume lookups
CREATE INDEX resumes_user_id_idx ON resumes(user_id);

-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  github_url TEXT,
  technologies TEXT[],
  start_date DATE,
  end_date DATE,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster project lookups
CREATE INDEX projects_user_id_idx ON projects(user_id);
CREATE INDEX projects_portfolio_id_idx ON projects(portfolio_id);

-- Education Table
CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT,
  field_of_study TEXT,
  start_date DATE,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster education lookups
CREATE INDEX education_user_id_idx ON education(user_id);

-- Experience Table
CREATE TABLE experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster experience lookups
CREATE INDEX experience_user_id_idx ON experience(user_id);

-- Skills Table
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  proficiency INTEGER CHECK (proficiency BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Create index for faster skills lookups
CREATE INDEX skills_user_id_idx ON skills(user_id);

-- IPFS Records Table
CREATE TABLE ipfs_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  ipfs_hash TEXT NOT NULL,
  content_type TEXT NOT NULL,
  file_name TEXT,
  file_size INTEGER,
  reference_id UUID,
  reference_type TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster IPFS record lookups
CREATE INDEX ipfs_records_user_id_idx ON ipfs_records(user_id);
CREATE INDEX ipfs_records_ipfs_hash_idx ON ipfs_records(ipfs_hash);

-- Blockchain Verifications Table
CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  transaction_hash TEXT NOT NULL,
  blockchain TEXT NOT NULL,
  verified_data JSONB NOT NULL,
  ipfs_hash TEXT,
  reference_id UUID,
  reference_type TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster verification lookups
CREATE INDEX verifications_user_id_idx ON verifications(user_id);
CREATE INDEX verifications_transaction_hash_idx ON verifications(transaction_hash);

-- Website Templates Table
CREATE TABLE website_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  preview_image_url TEXT,
  template_data JSONB NOT NULL,
  category TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated Websites Table
CREATE TABLE generated_websites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  source_type TEXT NOT NULL, -- linkedin, github, leetcode, combined
  template_id UUID REFERENCES website_templates(id),
  website_files JSONB NOT NULL,
  preview_image_url TEXT,
  is_deployed BOOLEAN DEFAULT false,
  deployment_url TEXT,
  ipfs_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster generated website lookups
CREATE INDEX generated_websites_user_id_idx ON generated_websites(user_id);

-- RLS Policies
-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE ipfs_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_websites ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view their own profiles"
  ON user_profiles FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own profiles"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own profiles"
  ON user_profiles FOR UPDATE
  USING (auth.uid()::text = user_id);

-- Portfolios Policies
CREATE POLICY "Users can view their own portfolios"
  ON portfolios FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Public portfolios are viewable by everyone"
  ON portfolios FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can create their own portfolios"
  ON portfolios FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own portfolios"
  ON portfolios FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own portfolios"
  ON portfolios FOR DELETE
  USING (auth.uid()::text = user_id);

-- Similar policies for other tables...
