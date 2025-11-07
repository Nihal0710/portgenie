import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with API key
export const initGemini = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing Gemini API key");
  }
  return new GoogleGenerativeAI(apiKey);
};

// Generate website code based on user profile data
export const generateWebsiteCode = async (
  profileData: any,
  preferences: {
    colorScheme?: string;
    style?: string;
    sections?: string[];
  } = {}
) => {
  try {
    const genAI = initGemini();
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const { colorScheme = "blue", style = "modern", sections = ["about", "experience", "projects", "skills", "contact"] } = preferences;

    const prompt = `
      Generate a complete React-based portfolio website code using Next.js and Tailwind CSS for a professional.
      
      Here's the profile information:
      ${JSON.stringify(profileData, null, 2)}
      
      Design preferences:
      - Color scheme: ${colorScheme}
      - Style: ${style}
      - Sections to include: ${sections.join(", ")}
      
      Please provide the following files:
      1. page.tsx - The main portfolio page component
      2. components/Header.tsx - Navigation header
      3. components/About.tsx - About section
      4. components/Experience.tsx - Work experience section
      5. components/Projects.tsx - Projects showcase
      6. components/Skills.tsx - Skills section
      7. components/Contact.tsx - Contact form
      8. components/Footer.tsx - Footer component
      
      Use modern React practices with functional components and hooks.
      Ensure the design is responsive and mobile-friendly.
      Include smooth animations and transitions for a polished user experience.
      
      Format the response as a JSON object with each file path as a key and the file content as the value.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON object from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                      text.match(/```\n([\s\S]*?)\n```/) || 
                      text.match(/{[\s\S]*}/);
                      
    if (jsonMatch) {
      try {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      } catch (e) {
        console.error("Failed to parse JSON from Gemini response:", e);
        throw new Error("Failed to generate website code");
      }
    } else {
      console.error("No JSON found in Gemini response");
      throw new Error("Invalid response format from AI");
    }
  } catch (error) {
    console.error("Error generating website code:", error);
    throw error;
  }
};

// Generate suggestions for portfolio improvements
export const generatePortfolioSuggestions = async (portfolioData: any) => {
  try {
    const genAI = initGemini();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      Analyze this portfolio data and provide 5 specific suggestions to improve it:
      ${JSON.stringify(portfolioData, null, 2)}
      
      Focus on:
      1. Content improvements
      2. Skills presentation
      3. Project descriptions
      4. Overall structure
      5. Professional branding
      
      Format each suggestion with a title and detailed explanation.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating portfolio suggestions:", error);
    throw error;
  }
};

// Extract profile data from LinkedIn profile URL
export const extractLinkedInProfile = async (linkedinUrl: string) => {
  try {
    const genAI = initGemini();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are a professional data extractor. I'll provide a LinkedIn profile URL: ${linkedinUrl}
      
      Based on common LinkedIn profile structures, generate a realistic professional profile with the following information:
      - Name
      - Title
      - Summary
      - Experience (company, role, duration, description)
      - Education
      - Skills
      - Projects
      
      Format the response as a structured JSON object that could be used to populate a portfolio website.
      Do not include any explanations or notes outside the JSON structure.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON object from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                      text.match(/```\n([\s\S]*?)\n```/) || 
                      text.match(/{[\s\S]*}/);
                      
    if (jsonMatch) {
      try {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      } catch (e) {
        console.error("Failed to parse JSON from LinkedIn extraction:", e);
        throw new Error("Failed to extract LinkedIn profile data");
      }
    } else {
      console.error("No JSON found in Gemini response for LinkedIn");
      throw new Error("Invalid response format from AI");
    }
  } catch (error) {
    console.error("Error extracting LinkedIn profile:", error);
    throw error;
  }
};

// Extract profile data from GitHub profile URL
export const extractGitHubProfile = async (githubUrl: string) => {
  try {
    const genAI = initGemini();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are a professional data extractor. I'll provide a GitHub profile URL: ${githubUrl}
      
      Based on common GitHub profile structures, generate a realistic developer profile with the following information:
      - Name
      - Bio
      - Top repositories (name, description, technologies used)
      - Programming languages
      - Contributions
      
      Format the response as a structured JSON object that could be used to populate a portfolio website.
      Do not include any explanations or notes outside the JSON structure.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON object from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                      text.match(/```\n([\s\S]*?)\n```/) || 
                      text.match(/{[\s\S]*}/);
                      
    if (jsonMatch) {
      try {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      } catch (e) {
        console.error("Failed to parse JSON from GitHub extraction:", e);
        throw new Error("Failed to extract GitHub profile data");
      }
    } else {
      console.error("No JSON found in Gemini response for GitHub");
      throw new Error("Invalid response format from AI");
    }
  } catch (error) {
    console.error("Error extracting GitHub profile:", error);
    throw error;
  }
};

// Extract profile data from LeetCode profile URL
export const extractLeetCodeProfile = async (leetcodeUrl: string) => {
  try {
    const genAI = initGemini();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are a professional data extractor. I'll provide a LeetCode profile URL: ${leetcodeUrl}
      
      Based on common LeetCode profile structures, generate a realistic coding profile with the following information:
      - Username
      - Ranking
      - Problems solved (easy, medium, hard)
      - Contest participation
      - Top skills based on problem categories
      
      Format the response as a structured JSON object that could be used to populate a portfolio website.
      Do not include any explanations or notes outside the JSON structure.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON object from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                      text.match(/```\n([\s\S]*?)\n```/) || 
                      text.match(/{[\s\S]*}/);
                      
    if (jsonMatch) {
      try {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      } catch (e) {
        console.error("Failed to parse JSON from LeetCode extraction:", e);
        throw new Error("Failed to extract LeetCode profile data");
      }
    } else {
      console.error("No JSON found in Gemini response for LeetCode");
      throw new Error("Invalid response format from AI");
    }
  } catch (error) {
    console.error("Error extracting LeetCode profile:", error);
    throw error;
  }
};

// Combine profiles from multiple sources
export const combineProfiles = async (profiles: {
  linkedin?: any;
  github?: any;
  leetcode?: any;
}) => {
  try {
    const genAI = initGemini();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are a professional profile integrator. I'll provide data from multiple sources:
      
      ${profiles.linkedin ? `LinkedIn: ${JSON.stringify(profiles.linkedin, null, 2)}` : ''}
      ${profiles.github ? `GitHub: ${JSON.stringify(profiles.github, null, 2)}` : ''}
      ${profiles.leetcode ? `LeetCode: ${JSON.stringify(profiles.leetcode, null, 2)}` : ''}
      
      Combine this information into a comprehensive professional profile, resolving any conflicts or duplications.
      The combined profile should include:
      - Personal information (name, title, contact)
      - Professional summary
      - Work experience
      - Education
      - Skills (technical and soft skills)
      - Projects (with descriptions and technologies)
      - Coding achievements
      
      Format the response as a structured JSON object that could be used to populate a portfolio website.
      Do not include any explanations or notes outside the JSON structure.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON object from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                      text.match(/```\n([\s\S]*?)\n```/) || 
                      text.match(/{[\s\S]*}/);
                      
    if (jsonMatch) {
      try {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      } catch (e) {
        console.error("Failed to parse JSON from profile combination:", e);
        throw new Error("Failed to combine profile data");
      }
    } else {
      console.error("No JSON found in Gemini response for profile combination");
      throw new Error("Invalid response format from AI");
    }
  } catch (error) {
    console.error("Error combining profiles:", error);
    throw error;
  }
};

// Generate project suggestions based on user skills and interests
export const generateProjectSuggestions = async (userData: any) => {
  try {
    const genAI = initGemini();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are a tech project advisor. Generate creative project ideas tailored to this user's profile:
      ${JSON.stringify(userData, null, 2)}
      
      For each project idea, provide:
      1. Project title - creative and specific
      2. Short description (30-40 words)
      3. Skills needed - list of required skills
      4. Difficulty level (Beginner, Intermediate, Advanced)
      5. Estimated completion time in hours or days
      6. How it benefits the portfolio
      7. Tech stack recommendation
      
      Generate 3 projects that would showcase the user's skills effectively.
      Format response as a JSON array with objects for each project idea.
      
      Example format:
      [
        {
          "title": "Project Title",
          "description": "Short description of the project",
          "skills": ["Skill1", "Skill2"],
          "difficulty": "Intermediate",
          "timeEstimate": "20-30 hours",
          "portfolioBenefit": "Shows proficiency in X",
          "techStack": ["Tech1", "Tech2"]
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON object from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                      text.match(/```\n([\s\S]*?)\n```/) || 
                      text.match(/\[\s*\{[\s\S]*\}\s*\]/);
                      
    if (jsonMatch) {
      try {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      } catch (e) {
        console.error("Failed to parse JSON from project suggestions:", e);
        throw new Error("Failed to generate project suggestions");
      }
    } else {
      console.error("No JSON found in Gemini response for project suggestions");
      throw new Error("Invalid response format from AI");
    }
  } catch (error) {
    console.error("Error generating project suggestions:", error);
    throw error;
  }
};

// Generate content improvement suggestions for portfolio sections
export const generateContentImprovements = async (
  sectionType: 'about' | 'overview' | 'description' | 'project' | 'skills',
  currentContent: string,
  userData?: any
) => {
  try {
    const genAI = initGemini();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    let sectionContext = '';
    switch (sectionType) {
      case 'about':
        sectionContext = 'About section should showcase the person\'s background, experience, and personality in a professional yet engaging way';
        break;
      case 'overview':
        sectionContext = 'Overview should provide a concise summary of the portfolio and key professional highlights';
        break;
      case 'description':
        sectionContext = 'Description should provide a compelling introduction to the portfolio and establish professional identity';
        break;
      case 'project':
        sectionContext = 'Project descriptions should highlight technical challenges, solutions, key technologies, and results';
        break;
      case 'skills':
        sectionContext = 'Skills section should be well-organized, comprehensive, and demonstrate both technical and soft skills relevant to the industry';
        break;
    }

    const prompt = `
      You are an expert portfolio content advisor. I'll provide content for a ${sectionType} section that needs improvement.
      
      Current Content:
      """
      ${currentContent}
      """
      
      ${userData ? `Additional user data: ${JSON.stringify(userData, null, 2)}` : ''}
      
      Context: ${sectionContext}
      
      Provide three alternative, improved versions of this content with the following qualities:
      1. Professional but personable tone
      2. Specific and concrete rather than generic
      3. Highlighting key achievements and skills
      4. Using active voice and strong verbs
      5. Appropriate length for a portfolio ${sectionType} section
      
      For each suggestion:
      1. Provide a title characterizing the style (e.g., "Concise & Technical", "Narrative Approach", "Achievement-Focused")
      2. Provide the improved content
      3. Add a brief explanation of what you improved
      
      Format as a JSON object with an array of suggestions:
      {
        "suggestions": [
          {
            "title": "Suggestion title",
            "content": "Improved content here",
            "explanation": "What was improved and why"
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON object from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                      text.match(/```\n([\s\S]*?)\n```/) || 
                      text.match(/\{\s*"suggestions"\s*:/);
                      
    if (jsonMatch) {
      try {
        const jsonStr = jsonMatch[1] || jsonMatch[0];
        return JSON.parse(jsonStr);
      } catch (e) {
        console.error("Failed to parse JSON from content improvements:", e);
        throw new Error("Failed to generate content improvement suggestions");
      }
    } else {
      console.error("No JSON found in Gemini response for content improvements");
      throw new Error("Invalid response format from AI");
    }
  } catch (error) {
    console.error("Error generating content improvements:", error);
    throw error;
  }
};
