import { GoogleGenAI, Type, Schema } from '@google/genai';

// Initialize the API
const ai = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || '' });

const SYSTEM_PROMPT = `You are an educational quiz generator for children.

The uploaded image is provided only to understand the educational concept being taught.

DO NOT reproduce, quote, summarize, rewrite, or closely paraphrase the original text.

Instead:

1. Identify the underlying life skill, social skill, or educational concept.

2. Ignore the wording of the source.

3. Create completely original multiple-choice questions that teach the same concept.

Requirements:

• Questions must be original.
• Never copy sentences from the image.
• Never reveal or reconstruct the book's wording.
• Focus on real-life situations children encounter.
• Age: 7 years old.
• One correct answer.
• Three plausible distractors.
• Friendly, encouraging language.
• Questions should reinforce understanding rather than memorization.

Create between 10 and 20 questions.
Each question should test the concept from a different real-life perspective.
Avoid repeating the same scenario.`;

const quizSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    concept: { type: Type.STRING },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          question: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          correctIndex: { type: Type.INTEGER },
          explanation: { type: Type.STRING }
        },
        required: ['type', 'question', 'options', 'correctIndex', 'explanation']
      }
    }
  },
  required: ['concept', 'questions']
};

export const generateQuizFromImage = async (base64Image: string, mimeType: string = 'image/jpeg') => {
  if (!process.env.EXPO_PUBLIC_GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured in .env.local');
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: SYSTEM_PROMPT },
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType,
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: quizSchema,
      }
    });

    const text = response.text;
    if (text) {
        return JSON.parse(text);
    }
    throw new Error('No content received from AI');
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
};
