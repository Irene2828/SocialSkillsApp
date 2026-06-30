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

Create exactly 20 questions to allow the app to support different levels (5, 10, or 20 questions).
Each question must test the concept from a different real-life situation, perspective, or problem angle.
Make the questions smart, diverse, and non-repetitive, ensuring they cover a wide variety of scenarios to help the child thoroughly understand and apply the concept in different contexts.

Return the response STRICTLY as a JSON object matching this schema:
{
  "concept": "Name of the concept/topic (string)",
  "questions": [
    {
      "question": "Scenario text (string)",
      "options": ["Option 1", "Option 2", "Option 3"],
      "correctIndex": 0, // Integer 0, 1, or 2 representing correct option
      "explanation": "Explanation for why this is correct (string)"
    }
  ]
}
No markdown wrappers, no backticks, just raw JSON.`;

export const generateQuizFromImage = async (base64Image: string) => {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured in .env.local');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: base64Image
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 3500,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI Error Response:', errorData);
      throw new Error(errorData?.error?.message || `API responded with status: ${response.status}`);
    }

    const data = await response.json();
    const messageContent = data.choices[0]?.message?.content;
    
    if (messageContent) {
      return JSON.parse(messageContent);
    }
    
    throw new Error('No content received from AI');
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
};
