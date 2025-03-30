-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create function to set updated_at on updates
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

------------------------------------------
-- Core Tables
------------------------------------------

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  github_username TEXT,
  linkedin_username TEXT,
  twitter_username TEXT,
  subscription_plan TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own data
CREATE POLICY "Users can read their own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Create policy for users to update their own data
CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Create trigger for updated_at
CREATE TRIGGER update_users_modified
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Profiles Table (Extended User Information)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  headline TEXT,
  summary TEXT,
  years_of_experience INTEGER,
  open_to_work BOOLEAN DEFAULT FALSE,
  job_title TEXT,
  education TEXT[],
  skills TEXT[],
  languages TEXT[],
  interests TEXT[],
  custom_fields JSONB,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for profiles
CREATE POLICY "Users can read their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_modified
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

------------------------------------------
-- Portfolio Management
------------------------------------------

-- Portfolios Table
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  theme TEXT DEFAULT 'default',
  color_scheme TEXT DEFAULT 'blue',
  is_published BOOLEAN DEFAULT FALSE,
  custom_domain TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_image_url TEXT,
  custom_css TEXT,
  custom_js TEXT,
  sections JSONB DEFAULT '[]',
  seo_keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Create policies for portfolios
CREATE POLICY "Users can CRUD their own portfolios" ON portfolios
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published portfolios" ON portfolios
  FOR SELECT USING (is_published = TRUE);

-- Create trigger for updated_at
CREATE TRIGGER update_portfolios_modified
BEFORE UPDATE ON portfolios
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  thumbnail_url TEXT,
  github_url TEXT,
  live_url TEXT,
  technologies TEXT[],
  features TEXT[],
  start_date DATE,
  end_date DATE,
  is_featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER,
  media_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Users can CRUD their own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view projects from published portfolios" ON projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM portfolios 
      WHERE portfolios.id = projects.portfolio_id 
      AND portfolios.is_published = TRUE
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_projects_modified
BEFORE UPDATE ON projects
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

------------------------------------------
-- Resume Management
------------------------------------------

-- Resumes Table
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB,
  template TEXT DEFAULT 'modern',
  is_current BOOLEAN DEFAULT FALSE,
  ipfs_hash TEXT,
  ipfs_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Create policy for resumes
CREATE POLICY "Users can CRUD their own resumes" ON resumes
  FOR ALL USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_resumes_modified
BEFORE UPDATE ON resumes
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Work Experience Table
CREATE TABLE work_experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT FALSE,
  description TEXT,
  responsibilities TEXT[],
  achievements TEXT[],
  technologies_used TEXT[],
  portfolio_id UUID REFERENCES portfolios(id) ON DELETE SET NULL,
  resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE work_experiences ENABLE ROW LEVEL SECURITY;

-- Create policy for work experiences
CREATE POLICY "Users can CRUD their own work experiences" ON work_experiences
  FOR ALL USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_work_experiences_modified
BEFORE UPDATE ON work_experiences
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

------------------------------------------
-- Certifications and Credentials
------------------------------------------

-- Certificates Table
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  description TEXT,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  ipfs_hash TEXT,
  ipfs_url TEXT,
  nft_address TEXT,
  nft_token_id TEXT,
  blockchain TEXT,
  verification_status TEXT DEFAULT 'unverified',
  is_verified BOOLEAN DEFAULT FALSE,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Create policy for certificates
CREATE POLICY "Users can CRUD their own certificates" ON certificates
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view verified certificates" ON certificates
  FOR SELECT USING (is_verified = TRUE);

-- Create trigger for updated_at
CREATE TRIGGER update_certificates_modified
BEFORE UPDATE ON certificates
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

------------------------------------------
-- IPFS Storage Integration
------------------------------------------

-- IPFS_Files Table
CREATE TABLE ipfs_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  ipfs_hash TEXT NOT NULL,
  ipfs_url TEXT NOT NULL,
  pinata_id TEXT,
  pinned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  related_entity_type TEXT, -- 'resume', 'certificate', 'portfolio', 'project'
  related_entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE ipfs_files ENABLE ROW LEVEL SECURITY;

-- Create policy for IPFS files
CREATE POLICY "Users can CRUD their own IPFS files" ON ipfs_files
  FOR ALL USING (auth.uid() = user_id);

-- Public can view IPFS files
CREATE POLICY "Anyone can view IPFS files" ON ipfs_files
  FOR SELECT USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_ipfs_files_modified
BEFORE UPDATE ON ipfs_files
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- Pinata_Keys Table (Encrypted)
CREATE TABLE pinata_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  api_key TEXT NOT NULL,
  api_secret TEXT NOT NULL,
  jwt TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE pinata_keys ENABLE ROW LEVEL SECURITY;

-- Create strict policy for Pinata keys
CREATE POLICY "Users can only access their own Pinata keys" ON pinata_keys
  FOR ALL USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_pinata_keys_modified
BEFORE UPDATE ON pinata_keys
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

------------------------------------------
-- Web3 Verification
------------------------------------------

-- Web3_Credentials Table
CREATE TABLE web3_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  blockchain TEXT NOT NULL DEFAULT 'ethereum',
  credential_type TEXT NOT NULL, -- 'resume', 'certificate', 'portfolio'
  entity_id UUID NOT NULL,
  transaction_hash TEXT,
  contract_address TEXT,
  token_id TEXT,
  metadata_uri TEXT,
  verification_status TEXT DEFAULT 'pending',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE web3_credentials ENABLE ROW LEVEL SECURITY;

-- Create policy for web3 credentials
CREATE POLICY "Users can CRUD their own web3 credentials" ON web3_credentials
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view verified web3 credentials" ON web3_credentials
  FOR SELECT USING (is_verified = TRUE);

-- Create trigger for updated_at
CREATE TRIGGER update_web3_credentials_modified
BEFORE UPDATE ON web3_credentials
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

------------------------------------------
-- Cover Letters
------------------------------------------

CREATE TABLE cover_letters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  job_title TEXT NOT NULL,
  content TEXT NOT NULL,
  template TEXT DEFAULT 'modern',
  is_generated BOOLEAN DEFAULT FALSE,
  ipfs_hash TEXT,
  ipfs_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE cover_letters ENABLE ROW LEVEL SECURITY;

-- Create policy for cover letters
CREATE POLICY "Users can CRUD their own cover letters" ON cover_letters
  FOR ALL USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_cover_letters_modified
BEFORE UPDATE ON cover_letters
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

------------------------------------------
-- AI-Generated Images
------------------------------------------

CREATE TABLE ai_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_path TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  model_used TEXT DEFAULT 'gemini-2.0',
  usage_context TEXT, -- 'portfolio', 'project', 'profile', etc.
  related_entity_id UUID,
  ipfs_hash TEXT,
  ipfs_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE ai_images ENABLE ROW LEVEL SECURITY;

-- Create policy for AI images
CREATE POLICY "Users can CRUD their own AI images" ON ai_images
  FOR ALL USING (auth.uid() = user_id);

------------------------------------------
-- Relationships and Indexes
------------------------------------------

-- Create indexes for faster queries
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_portfolio_id ON projects(portfolio_id);
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
CREATE INDEX idx_work_experiences_user_id ON work_experiences(user_id);
CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_ipfs_files_user_id ON ipfs_files(user_id);
CREATE INDEX idx_ipfs_files_ipfs_hash ON ipfs_files(ipfs_hash);
CREATE INDEX idx_ipfs_files_related ON ipfs_files(related_entity_type, related_entity_id);
CREATE INDEX idx_web3_credentials_user_id ON web3_credentials(user_id);
CREATE INDEX idx_web3_credentials_wallet ON web3_credentials(wallet_address);
CREATE INDEX idx_web3_credentials_entity ON web3_credentials(credential_type, entity_id);
CREATE INDEX idx_cover_letters_user_id ON cover_letters(user_id);
CREATE INDEX idx_ai_images_user_id ON ai_images(user_id);

------------------------------------------
-- Views
------------------------------------------

-- Create a view for user portfolios with project counts
CREATE VIEW user_portfolio_summary AS
SELECT 
  p.id AS portfolio_id,
  p.user_id,
  p.title,
  p.slug,
  p.is_published,
  p.theme,
  p.color_scheme,
  p.created_at,
  p.updated_at,
  COUNT(pr.id) AS project_count,
  u.full_name AS user_name,
  u.subscription_plan
FROM portfolios p
LEFT JOIN projects pr ON p.id = pr.portfolio_id
LEFT JOIN users u ON p.user_id = u.id
GROUP BY p.id, u.id;

-- Create a view for IPFS verification status
CREATE VIEW ipfs_verification_status AS
SELECT 
  i.ipfs_hash,
  i.ipfs_url,
  i.file_name,
  i.file_type,
  i.user_id,
  i.related_entity_type,
  i.related_entity_id,
  i.created_at,
  w.id AS web3_credential_id,
  w.wallet_address,
  w.blockchain,
  w.contract_address,
  w.token_id,
  w.verification_status,
  w.is_verified,
  u.full_name AS user_name
FROM ipfs_files i
LEFT JOIN web3_credentials w ON 
  (i.related_entity_id = w.entity_id AND i.related_entity_type = w.credential_type)
LEFT JOIN users u ON i.user_id = u.id;

-- Create a view for user credentials summary
CREATE VIEW user_credentials_summary AS
SELECT 
  u.id AS user_id,
  u.full_name,
  COUNT(r.id) AS resume_count,
  COUNT(c.id) AS certificate_count,
  COUNT(w.id) AS web3_credential_count,
  u.subscription_plan,
  u.subscription_status
FROM users u
LEFT JOIN resumes r ON u.id = r.user_id
LEFT JOIN certificates c ON u.id = c.user_id
LEFT JOIN web3_credentials w ON u.id = w.user_id
GROUP BY u.id;

------------------------------------------
-- Functions
------------------------------------------

-- Function to get a user's complete profile with related data
CREATE OR REPLACE FUNCTION get_user_complete_profile(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'user', jsonb_build_object(
      'id', u.id,
      'email', u.email,
      'full_name', u.full_name,
      'display_name', u.display_name,
      'avatar_url', u.avatar_url,
      'bio', u.bio,
      'location', u.location,
      'website', u.website,
      'github_username', u.github_username,
      'linkedin_username', u.linkedin_username,
      'twitter_username', u.twitter_username,
      'subscription_plan', u.subscription_plan,
      'created_at', u.created_at
    ),
    'profile', (SELECT to_jsonb(p) FROM profiles p WHERE p.id = user_uuid),
    'portfolios', (
      SELECT jsonb_agg(to_jsonb(port)) 
      FROM portfolios port 
      WHERE port.user_id = user_uuid
    ),
    'projects', (
      SELECT jsonb_agg(to_jsonb(proj)) 
      FROM projects proj 
      WHERE proj.user_id = user_uuid
    ),
    'resumes', (
      SELECT jsonb_agg(to_jsonb(r)) 
      FROM resumes r 
      WHERE r.user_id = user_uuid
    ),
    'certificates', (
      SELECT jsonb_agg(to_jsonb(cert)) 
      FROM certificates cert 
      WHERE cert.user_id = user_uuid
    ),
    'ipfs_files', (
      SELECT jsonb_agg(to_jsonb(ipfs)) 
      FROM ipfs_files ipfs 
      WHERE ipfs.user_id = user_uuid
    ),
    'web3_credentials', (
      SELECT jsonb_agg(to_jsonb(w3)) 
      FROM web3_credentials w3 
      WHERE w3.user_id = user_uuid
    )
  ) INTO result
  FROM users u
  WHERE u.id = user_uuid;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to verify IPFS content exists
CREATE OR REPLACE FUNCTION verify_ipfs_content(hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM ipfs_files WHERE ipfs_hash = hash
  );
END;
$$ LANGUAGE plpgsql;

-- Function to create Web3 credential and link to IPFS file
CREATE OR REPLACE FUNCTION create_web3_credential_with_ipfs(
  p_user_id UUID,
  p_wallet_address TEXT,
  p_blockchain TEXT,
  p_credential_type TEXT,
  p_entity_id UUID,
  p_transaction_hash TEXT,
  p_contract_address TEXT,
  p_token_id TEXT,
  p_metadata_uri TEXT,
  p_ipfs_hash TEXT
)
RETURNS UUID AS $$
DECLARE
  credential_id UUID;
BEGIN
  -- Create the Web3 credential
  INSERT INTO web3_credentials(
    user_id, 
    wallet_address, 
    blockchain, 
    credential_type, 
    entity_id,
    transaction_hash, 
    contract_address, 
    token_id, 
    metadata_uri,
    verification_status,
    is_verified
  )
  VALUES(
    p_user_id, 
    p_wallet_address, 
    p_blockchain, 
    p_credential_type, 
    p_entity_id,
    p_transaction_hash, 
    p_contract_address, 
    p_token_id, 
    p_metadata_uri,
    'verified',
    TRUE
  )
  RETURNING id INTO credential_id;
  
  -- Update the IPFS file with related entity information if it exists
  UPDATE ipfs_files
  SET 
    related_entity_type = p_credential_type,
    related_entity_id = p_entity_id
  WHERE 
    ipfs_hash = p_ipfs_hash AND 
    user_id = p_user_id;
    
  -- Also update the entity table based on credential_type
  IF p_credential_type = 'resume' THEN
    UPDATE resumes
    SET 
      ipfs_hash = p_ipfs_hash,
      ipfs_url = 'ipfs://' || p_ipfs_hash
    WHERE 
      id = p_entity_id AND
      user_id = p_user_id;
  ELSIF p_credential_type = 'certificate' THEN
    UPDATE certificates
    SET 
      ipfs_hash = p_ipfs_hash,
      ipfs_url = 'ipfs://' || p_ipfs_hash,
      nft_address = p_contract_address,
      nft_token_id = p_token_id,
      blockchain = p_blockchain,
      verification_status = 'verified',
      is_verified = TRUE
    WHERE 
      id = p_entity_id AND
      user_id = p_user_id;
  END IF;
  
  RETURN credential_id;
END;
$$ LANGUAGE plpgsql; 