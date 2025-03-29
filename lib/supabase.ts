import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// User profiles
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data;
};

export const createUserProfile = async (userId: string, profileData: any) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert([
      { 
        user_id: userId,
        ...profileData,
        created_at: new Date().toISOString()
      }
    ])
    .select();
    
  if (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
  
  return data[0];
};

export const updateUserProfile = async (userId: string, profileData: any) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .update({
      ...profileData,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select();
    
  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
  
  return data[0];
};

// Portfolio management
export const getPortfolios = async (userId: string) => {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching portfolios:', error);
    return [];
  }
  
  return data;
};

export const getPortfolioById = async (portfolioId: string) => {
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('id', portfolioId)
    .single();
    
  if (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }
  
  return data;
};

export const createPortfolio = async (userId: string, portfolioData: any) => {
  const { data, error } = await supabase
    .from('portfolios')
    .insert([
      { 
        user_id: userId,
        ...portfolioData,
        created_at: new Date().toISOString()
      }
    ])
    .select();
    
  if (error) {
    console.error('Error creating portfolio:', error);
    throw error;
  }
  
  return data[0];
};

export const updatePortfolio = async (portfolioId: string, portfolioData: any) => {
  const { data, error } = await supabase
    .from('portfolios')
    .update({
      ...portfolioData,
      updated_at: new Date().toISOString()
    })
    .eq('id', portfolioId)
    .select();
    
  if (error) {
    console.error('Error updating portfolio:', error);
    throw error;
  }
  
  return data[0];
};

export const deletePortfolio = async (portfolioId: string) => {
  const { error } = await supabase
    .from('portfolios')
    .delete()
    .eq('id', portfolioId);
    
  if (error) {
    console.error('Error deleting portfolio:', error);
    throw error;
  }
  
  return true;
};

// Resume management
export const getResumes = async (userId: string) => {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching resumes:', error);
    return [];
  }
  
  return data;
};

export const getResumeById = async (resumeId: string) => {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', resumeId)
    .single();
    
  if (error) {
    console.error('Error fetching resume:', error);
    return null;
  }
  
  return data;
};

export const createResume = async (userId: string, resumeData: any) => {
  const { data, error } = await supabase
    .from('resumes')
    .insert([
      { 
        user_id: userId,
        ...resumeData,
        created_at: new Date().toISOString()
      }
    ])
    .select();
    
  if (error) {
    console.error('Error creating resume:', error);
    throw error;
  }
  
  return data[0];
};

export const updateResume = async (resumeId: string, resumeData: any) => {
  const { data, error } = await supabase
    .from('resumes')
    .update({
      ...resumeData,
      updated_at: new Date().toISOString()
    })
    .eq('id', resumeId)
    .select();
    
  if (error) {
    console.error('Error updating resume:', error);
    throw error;
  }
  
  return data[0];
};

export const deleteResume = async (resumeId: string) => {
  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('id', resumeId);
    
  if (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
  
  return true;
};

// IPFS records
export const createIPFSRecord = async (userId: string, recordData: any) => {
  const { data, error } = await supabase
    .from('ipfs_records')
    .insert([
      { 
        user_id: userId,
        ...recordData,
        created_at: new Date().toISOString()
      }
    ])
    .select();
    
  if (error) {
    console.error('Error creating IPFS record:', error);
    throw error;
  }
  
  return data[0];
};

export const getIPFSRecords = async (userId: string) => {
  const { data, error } = await supabase
    .from('ipfs_records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching IPFS records:', error);
    return [];
  }
  
  return data;
};

// Blockchain verifications
export const createVerification = async (userId: string, verificationData: any) => {
  const { data, error } = await supabase
    .from('verifications')
    .insert([
      { 
        user_id: userId,
        ...verificationData,
        created_at: new Date().toISOString()
      }
    ])
    .select();
    
  if (error) {
    console.error('Error creating verification:', error);
    throw error;
  }
  
  return data[0];
};

export const getVerifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('verifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching verifications:', error);
    return [];
  }
  
  return data;
};

// Website templates
export const getWebsiteTemplates = async () => {
  const { data, error } = await supabase
    .from('website_templates')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching website templates:', error);
    return [];
  }
  
  return data;
};

export const createWebsiteTemplate = async (userId: string, templateData: any) => {
  const { data, error } = await supabase
    .from('website_templates')
    .insert([
      { 
        user_id: userId,
        ...templateData,
        created_at: new Date().toISOString()
      }
    ])
    .select();
    
  if (error) {
    console.error('Error creating website template:', error);
    throw error;
  }
  
  return data[0];
};

// Generated websites
export const createGeneratedWebsite = async (userId: string, websiteData: any) => {
  const { data, error } = await supabase
    .from('generated_websites')
    .insert([
      { 
        user_id: userId,
        ...websiteData,
        created_at: new Date().toISOString()
      }
    ])
    .select();
    
  if (error) {
    console.error('Error creating generated website:', error);
    throw error;
  }
  
  return data[0];
};

export const getGeneratedWebsites = async (userId: string) => {
  const { data, error } = await supabase
    .from('generated_websites')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching generated websites:', error);
    return [];
  }
  
  return data;
};
