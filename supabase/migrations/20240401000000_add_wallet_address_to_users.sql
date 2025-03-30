-- Add wallet_address to users table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'wallet_address'
    ) THEN
        ALTER TABLE users ADD COLUMN wallet_address TEXT;
    END IF;
END
$$;

-- Add wallet_address to profiles table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'wallet_address'
    ) THEN
        ALTER TABLE profiles ADD COLUMN wallet_address TEXT;
    END IF;
END
$$;

-- Demo users for testing (only insert if table is empty)
INSERT INTO users (id, full_name, email, avatar_url, display_name, bio, wallet_address)
SELECT 
    '00000000-0000-0000-0000-000000000001', 
    'John Smith', 
    'john@example.com', 
    'https://i.pravatar.cc/150?img=1', 
    'johnsmith', 
    'Full-stack developer with 5 years of experience.',
    '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
WHERE NOT EXISTS (
    SELECT 1 FROM users LIMIT 1
);

INSERT INTO users (id, full_name, email, avatar_url, display_name, bio, wallet_address)
SELECT 
    '00000000-0000-0000-0000-000000000002', 
    'Jane Doe', 
    'jane@example.com', 
    'https://i.pravatar.cc/150?img=5', 
    'janedoe', 
    'UX/UI designer with a focus on user experience.',
    '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE id = '00000000-0000-0000-0000-000000000002'
);

-- Demo profiles
INSERT INTO profiles (id, headline, summary, years_of_experience, job_title, skills, wallet_address)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    'Senior Full-Stack Developer | React | Node.js | TypeScript',
    'Passionate developer with expertise in building modern web applications using JavaScript frameworks.',
    5,
    'Senior Developer',
    ARRAY['JavaScript', 'React', 'Node.js', 'TypeScript', 'PostgreSQL'],
    '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
WHERE NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000001'
);

INSERT INTO profiles (id, headline, summary, years_of_experience, job_title, skills, wallet_address)
SELECT 
    '00000000-0000-0000-0000-000000000002',
    'UX/UI Designer | Figma Expert | Design Systems',
    'Creating intuitive and beautiful interfaces with a focus on accessibility and user experience.',
    3,
    'Senior UX Designer',
    ARRAY['Figma', 'UI Design', 'User Research', 'Prototyping', 'Design Systems'],
    '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'
WHERE NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = '00000000-0000-0000-0000-000000000002'
);

-- Demo cover letters (for the cover letter feature)
INSERT INTO cover_letters (id, user_id, title, company, job_title, content, template, is_generated)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Frontend Developer at TechCorp',
    'TechCorp',
    'Frontend Developer',
    'Dear Hiring Manager,

I am writing to express my interest in the Frontend Developer position at TechCorp. With 5 years of experience in building responsive web applications using React, I believe I would be a great fit for your team.

My experience includes:
- Developing complex user interfaces with React and TypeScript
- Implementing responsive designs for web and mobile
- Writing clean, maintainable code following best practices
- Working collaboratively in agile teams

I am excited about the opportunity to contribute to TechCorp''s innovative projects and would welcome the chance to discuss how my skills align with your needs.

Sincerely,
John Smith',
    'modern',
    true
WHERE NOT EXISTS (
    SELECT 1 FROM cover_letters WHERE user_id = '00000000-0000-0000-0000-000000000001' LIMIT 1
); 