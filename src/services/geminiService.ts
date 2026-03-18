import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getExpertSuggestions(type: 'summary' | 'experience' | 'skills' | 'cover_letter' | 'interview_prep', context: string) {
  try {
    const model = "gemini-3-flash-preview";
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
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "";
  } catch (error) {
    console.error("Expert Service Error:", error);
    return "Could not generate suggestions at this time.";
  }
}
