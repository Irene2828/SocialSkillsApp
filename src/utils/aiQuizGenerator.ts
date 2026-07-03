const getSystemPrompt = (age: number) => `You are an educational quiz generator for children.

The uploaded image is provided only to understand the educational concept being taught.

DO NOT reproduce, quote, summarize, rewrite, or closely paraphrase the original text.

Instead:

1. Identify the underlying life skill, social skill, or educational concept.

2. Ignore the wording of the source.

3. Create exactly 3 distinct multiple-choice quizzes that teach this concept or closely related social/life skill concepts.

Requirements for each of the 3 quizzes:

• The "concept" field must be extremely concise: strictly 2 words max (e.g. "Active Listening", "Sharing Toys", "Taking Turns").
• Questions must be original.
• Never copy sentences from the image.
• Never reveal or reconstruct the book's wording.
• Age: ${age} years old.
• One correct answer.
• Three plausible distractors.
• Friendly, encouraging language.
• Questions should reinforce understanding rather than memorization.

Create exactly 5 questions for each of the 3 quizzes.
Each question must test the concept from a different real-life situation, perspective, or problem angle.

Return the response STRICTLY as a JSON object matching this schema:
{
  "quizzes": [
    {
      "concept": "Name of the concept/topic (strictly 1 to 2 words max)",
      "questions": [
        {
          "question": "Scenario text (string)",
          "options": ["Option 1", "Option 2", "Option 3"],
          "correctIndex": 0, // Integer 0, 1, or 2 representing correct option
          "explanation": "Explanation for why this is correct (string)"
        }
      ]
    }
  ]
}
No markdown wrappers, no backticks, just raw JSON.`;

const validateQuizData = (data: any) => {
  if (!data || typeof data !== 'object') throw new Error("Root is not an object");
  if (!Array.isArray(data.quizzes) || data.quizzes.length !== 3) {
    throw new Error(`Expected exactly 3 quizzes, got ${data.quizzes?.length}`);
  }

  for (const [qIndex, quiz] of data.quizzes.entries()) {
    if (typeof quiz.concept !== 'string' || !quiz.concept.trim()) {
      throw new Error(`Quiz ${qIndex} has invalid or empty concept`);
    }
    if (!Array.isArray(quiz.questions) || quiz.questions.length !== 5) {
      throw new Error(`Quiz ${qIndex} expected exactly 5 questions, got ${quiz.questions?.length}`);
    }

    for (const [index, q] of quiz.questions.entries()) {
      if (typeof q.question !== 'string' || !q.question.trim()) throw new Error(`Quiz ${qIndex} Question ${index} has invalid or empty text`);
      if (!Array.isArray(q.options) || q.options.length !== 3) throw new Error(`Quiz ${qIndex} Question ${index} must have exactly 3 options`);
      for (const opt of q.options) {
        if (typeof opt !== 'string' || !opt.trim()) throw new Error(`Quiz ${qIndex} Question ${index} has an empty option`);
      }
      if (typeof q.correctIndex !== 'number' || ![0, 1, 2].includes(q.correctIndex)) {
        throw new Error(`Quiz ${qIndex} Question ${index} has invalid correctIndex: ${q.correctIndex}`);
      }
      if (typeof q.explanation !== 'string' || !q.explanation.trim()) throw new Error(`Quiz ${qIndex} Question ${index} has invalid or empty explanation`);
    }
  }
};

export const generateQuizFromImage = async (base64Image: string, age: number = 7) => {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured in .env.local');
  }

  let lastError: any = null;

  for (let attempt = 1; attempt <= 2; attempt++) {
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
              content: getSystemPrompt(age)
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
          max_tokens: 5000,
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `API responded with status: ${response.status}`);
      }

      const data = await response.json();
      const messageContent = data.choices[0]?.message?.content;
      
      if (!messageContent) {
        throw new Error('No content received from AI');
      }

      const parsedData = JSON.parse(messageContent);
      
      // Ensure each quiz concept name is mostly 2 words max
      if (parsedData && Array.isArray(parsedData.quizzes)) {
        for (const quiz of parsedData.quizzes) {
          if (typeof quiz.concept === 'string') {
            const words = quiz.concept.trim().split(/\s+/);
            if (words.length > 2) {
              quiz.concept = words.slice(0, 2).join(' ');
            }
          }
        }
      }

      validateQuizData(parsedData);
      
      return parsedData;

    } catch (error: any) {
      console.error(`Attempt ${attempt} failed generating quiz:`, error);
      lastError = error;
    }
  }

  throw lastError || new Error('Quiz generation failed after 2 attempts.');
};

export const generateQuizFromText = async (promptText: string, age: number = 7) => {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured in .env.local');
  }

  let lastError: any = null;

  for (let attempt = 1; attempt <= 2; attempt++) {
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
              content: getSystemPrompt(age)
            },
            {
              role: 'user',
              content: `The user wants to generate quizzes for this topic/task description: "${promptText}". Please generate exactly 3 quizzes teaching this concept or closely related social/life skills.`
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: 5000,
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `API responded with status: ${response.status}`);
      }

      const data = await response.json();
      const messageContent = data.choices[0]?.message?.content;
      
      if (!messageContent) {
        throw new Error('No content received from AI');
      }

      const parsedData = JSON.parse(messageContent);
      
      // Ensure each quiz concept name is mostly 2 words max
      if (parsedData && Array.isArray(parsedData.quizzes)) {
        for (const quiz of parsedData.quizzes) {
          if (typeof quiz.concept === 'string') {
            const words = quiz.concept.trim().split(/\s+/);
            if (words.length > 2) {
              quiz.concept = words.slice(0, 2).join(' ');
            }
          }
        }
      }

      validateQuizData(parsedData);
      
      return parsedData;

    } catch (error: any) {
      console.error(`Attempt ${attempt} failed generating quiz from text:`, error);
      lastError = error;
    }
  }

  throw lastError || new Error('Quiz generation failed after 2 attempts.');
};
