import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User Profile Functions
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        profiles(*)
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(userId: string, userData: any) {
  try {
    // Update users table
    const { error: userError } = await supabase
      .from('users')
      .update({
        full_name: userData.full_name,
        display_name: userData.display_name,
        avatar_url: userData.avatar_url,
        bio: userData.bio,
        location: userData.location,
        website: userData.website,
        github_username: userData.github_username,
        linkedin_username: userData.linkedin_username,
        twitter_username: userData.twitter_username,
      })
      .eq('id', userId);

    if (userError) throw userError;

    // Check if profile exists
    const { data: profileData } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId);

    // Update or insert profile data
    if (profileData && profileData.length > 0) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          headline: userData.headline,
          summary: userData.summary,
          years_of_experience: userData.years_of_experience,
          open_to_work: userData.open_to_work,
          job_title: userData.job_title,
          education: userData.education,
          skills: userData.skills,
          languages: userData.languages,
          interests: userData.interests,
          custom_fields: userData.custom_fields,
        })
        .eq('id', userId);

      if (profileError) throw profileError;
    } else {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          headline: userData.headline,
          summary: userData.summary,
          years_of_experience: userData.years_of_experience,
          open_to_work: userData.open_to_work,
          job_title: userData.job_title,
          education: userData.education,
          skills: userData.skills,
          languages: userData.languages,
          interests: userData.interests,
          custom_fields: userData.custom_fields,
        });

      if (profileError) throw profileError;
    }

    return await getUserProfile(userId);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// Portfolio Functions
export async function getUserPortfolios(userId: string) {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select(`
        *,
        projects(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user portfolios:', error);
    throw error;
  }
}

export async function getPortfolioBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .select(`
        *,
        projects(*)
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching portfolio by slug:', error);
    throw error;
  }
}

export async function createPortfolio(userId: string, portfolioData: any) {
  try {
    const { data, error } = await supabase
      .from('portfolios')
      .insert({
        user_id: userId,
        title: portfolioData.title,
        slug: portfolioData.slug,
        description: portfolioData.description,
        theme: portfolioData.theme || 'default',
        color_scheme: portfolioData.color_scheme || 'blue',
        is_published: portfolioData.is_published || false,
        sections: portfolioData.sections || []
      })
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating portfolio:', error);
    throw error;
  }
}

// Resume Functions
export async function getUserResumes(userId: string) {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user resumes:', error);
    throw error;
  }
}

export async function createResume(userId: string, resumeData: any) {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .insert({
        user_id: userId,
        title: resumeData.title,
        content: resumeData.content,
        template: resumeData.template || 'modern',
        is_current: resumeData.is_current || false
      })
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating resume:', error);
    throw error;
  }
}

// Certificate Functions
export async function getUserCertificates(userId: string) {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('user_id', userId)
      .order('issue_date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user certificates:', error);
    throw error;
  }
}

export async function createCertificate(userId: string, certificateData: any) {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .insert({
        user_id: userId,
        title: certificateData.title,
        issuer: certificateData.issuer,
        description: certificateData.description,
        issue_date: certificateData.issue_date,
        expiry_date: certificateData.expiry_date,
        credential_id: certificateData.credential_id,
        credential_url: certificateData.credential_url,
        thumbnail_url: certificateData.thumbnail_url
      })
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating certificate:', error);
    throw error;
  }
}

// IPFS Functions
export async function saveIpfsFile(userId: string, fileData: any) {
  try {
    const { data, error } = await supabase
      .from('ipfs_files')
      .insert({
        user_id: userId,
        file_name: fileData.file_name,
        file_type: fileData.file_type,
        file_size: fileData.file_size,
        ipfs_hash: fileData.ipfs_hash,
        ipfs_url: fileData.ipfs_url,
        pinata_id: fileData.pinata_id,
        related_entity_type: fileData.related_entity_type,
        related_entity_id: fileData.related_entity_id,
        metadata: fileData.metadata
      })
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error saving IPFS file:', error);
    throw error;
  }
}

export async function getUserIpfsFiles(userId: string) {
  try {
    const { data, error } = await supabase
      .from('ipfs_files')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user IPFS files:', error);
    throw error;
  }
}

// Web3 Credential Functions
export async function createWeb3Credential(userId: string, credentialData: any) {
  try {
    const { data, error } = await supabase
      .from('web3_credentials')
      .insert({
        user_id: userId,
        wallet_address: credentialData.wallet_address,
        blockchain: credentialData.blockchain || 'ethereum',
        credential_type: credentialData.credential_type,
        entity_id: credentialData.entity_id,
        transaction_hash: credentialData.transaction_hash,
        contract_address: credentialData.contract_address,
        token_id: credentialData.token_id,
        metadata_uri: credentialData.metadata_uri
      })
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating Web3 credential:', error);
    throw error;
  }
}

export async function getUserWeb3Credentials(userId: string) {
  try {
    const { data, error } = await supabase
      .from('web3_credentials')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user Web3 credentials:', error);
    throw error;
  }
}

// Cover Letter Functions
export async function createCoverLetter(userId: string, coverLetterData: any) {
  try {
    const { data, error } = await supabase
      .from('cover_letters')
      .insert({
        user_id: userId,
        title: coverLetterData.title,
        company: coverLetterData.company,
        job_title: coverLetterData.job_title,
        content: coverLetterData.content,
        template: coverLetterData.template || 'modern',
        is_generated: coverLetterData.is_generated || true
      })
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating cover letter:', error);
    throw error;
  }
}

export async function getUserCoverLetters(userId: string) {
  try {
    const { data, error } = await supabase
      .from('cover_letters')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user cover letters:', error);
    throw error;
  }
}

// AI Image Functions
export async function saveAiImage(userId: string, imageData: any) {
  try {
    const { data, error } = await supabase
      .from('ai_images')
      .insert({
        user_id: userId,
        prompt: imageData.prompt,
        image_url: imageData.image_url,
        image_path: imageData.image_path,
        width: imageData.width,
        height: imageData.height,
        model_used: imageData.model_used || 'gemini-2.0',
        usage_context: imageData.usage_context,
        related_entity_id: imageData.related_entity_id
      })
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error saving AI image:', error);
    throw error;
  }
}

export async function getUserAiImages(userId: string) {
  try {
    const { data, error } = await supabase
      .from('ai_images')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user AI images:', error);
    throw error;
  }
}
