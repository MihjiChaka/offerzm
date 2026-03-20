import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  // Use exact strings so Vite's 'define' can replace them during build
  const key = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || "";
  return key;
};

export const apiKey = getApiKey();
console.log("API Key detected:", apiKey ? "Yes (starts with " + apiKey.substring(0, 4) + "...)" : "No");

if (!apiKey) {
  console.warn("GEMINI_API_KEY is missing. AI features will not work. Please ensure it is set in your environment variables (e.g., in Netlify or .env).");
}

export const ai = new GoogleGenAI({ apiKey });

// Helper to update API key at runtime (fallback)
export const updateApiKey = (newKey: string) => {
  (ai as any).apiKey = newKey;
  // Also update the local exported apiKey if needed, though ai instance is what matters
};

const model = "gemini-3-flash-preview";

/**
 * Helper to wrap a promise with a timeout
 */
export async function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> {
  let timeoutId: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    return result;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function getExpertSuggestions(type: 'summary' | 'experience' | 'skills' | 'cover_letter' | 'interview_prep' | 'hiring_manager_email', context: string) {
  try {
    if (!apiKey) {
      return "Error: GEMINI_API_KEY is missing. Please set it in your environment variables.";
    }
    const currentDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    
    let prompt = `Today's date is ${currentDate}. `;
    if (type === 'summary') {
      prompt += `Write a professional CV summary based on this background: ${context}. Make it compelling and suitable for the Zambian job market. Keep it under 100 words.`;
    } else if (type === 'experience') {
      prompt += `Rewrite this job description/achievement to be more professional and impact-oriented: ${context}. Use strong action verbs and quantify results where possible.`;
    } else if (type === 'skills') {
      prompt += `Suggest 5-8 relevant professional skills for a person with this background: ${context}. Return them as a comma-separated list.`;
    } else if (type === 'cover_letter') {
      prompt += `Write a professional, persuasive, and tailored cover letter body for the following context: ${context}. 
      The letter should:
      1. Start with a strong opening paragraph expressing interest.
      2. Include 2-3 body paragraphs highlighting relevant skills and achievements.
      3. Connect the applicant's background to the company's needs.
      4. End with a professional call to action.
      5. Use professional language suitable for the Zambian corporate environment.
      6. Keep it around 250-300 words.
      7. Use placeholders like [Specific Achievement] or [Relevant Skill] if you need more detail from the user.`;
    } else if (type === 'interview_prep') {
      prompt += `Generate 5 common interview questions for the job title: ${context}. Return only the questions, one per line.`;
    } else if (type === 'hiring_manager_email') {
      prompt += `Write a professional, concise email to a hiring manager to accompany a job application based on this context: ${context}.
      The email should:
      1. Be brief and professional (under 150 words).
      2. State the purpose clearly (applying for the position).
      3. Mention the attached documents (CV/Cover Letter).
      4. Express enthusiasm for the role.
      5. Include a professional sign-off.
      6. Use a clear subject line starting with "Subject: ".`;
    }

    const response = await withTimeout(ai.models.generateContent({
      model,
      contents: prompt,
    }), 30000); // 30s timeout

    return response.text || "";
  } catch (error: any) {
    console.error("Expert Service Error:", error);
    if (error?.message?.includes('API_KEY_INVALID') || error?.message?.includes('API key not valid')) {
      return "Error: The provided GEMINI_API_KEY is invalid. Please check your key.";
    }
    return "Could not generate suggestions at this time. Please check your internet connection or API key.";
  }
}
