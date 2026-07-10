const getSocialSystemPrompt = (age: number, isImage: boolean = false) => `You are an educational quiz generator for children.

The uploaded image is provided only to understand the educational concept being taught.

DO NOT reproduce, quote, summarize, rewrite, or closely paraphrase the original text.

Instead:

1. Identify the underlying life skill, social skill, or educational concept.

2. Ignore the wording of the source.

13. ${isImage ? `Generate exactly 3 quizzes of exactly 5 questions each. Each quiz must explore a distinct angle, perspective, or sub-topic of the concept. Never return fewer than 3.` : `Create exactly 3 distinct multiple-choice quizzes that teach this concept or closely related social/life skill concepts.`}

Requirements for each of the quizzes:

• The "concept" field must be extremely concise: strictly 2 words max (e.g. "Active Listening", "Sharing Toys", "Taking Turns").
• Questions must be original.
• Never copy sentences from the image.
• Never reveal or reconstruct the book's wording.
• Age: ${age} years old.
• One correct answer.
• Three plausible distractors.
• Friendly, encouraging language.
• Questions should reinforce understanding rather than memorization.
• For the 'whyOptions' explanations, ALL options (both correct and incorrect) MUST be completely unique for every single question in the quiz.
• Do NOT reuse the same reasoning, phrases, or structure across different questions.
• The distractors must be highly specific to the scenario, natural, and creatively varied. Avoid repetitive, generic reasons like "because it is a rule", "to get adult approval", "it is polite", "it makes people happy", or "it is nice".

Create exactly 5 questions for each quiz.
Each question must test the concept from a different real-life situation, perspective, or problem angle.

Return the response STRICTLY as a JSON object matching this schema:
{
${isImage ? `  "folderName": "Suggested folder name based on the topic (strictly 1 to 2 words max)",\n` : ''}  "quizzes": [
    {
      "concept": "Name of the concept/topic (strictly 1 to 2 words max)",
      "questions": [
        {
          "question": "Scenario text (string)",
          "options": ["Option 1", "Option 2", "Option 3"],
          "correctIndex": 0, // Integer 0, 1, or 2 representing correct option
          "explanation": "Explanation for why this is correct (string)",
          "whyOptions": ["Correct or incorrect explanation 1 (must be highly specific to this scenario)", "Correct or incorrect explanation 2", "Correct or incorrect explanation 3"],
          "correctWhyIndex": 0, // index of the correct explanation in whyOptions (0, 1, or 2)
          "whyQuestion": "A follow up question asking why the correct option is the right choice (e.g. 'Why is this a good idea?')",
          "whyConfirmation": "A child-friendly confirmation explaining why this is correct (string)"
        }
      ]
    }
  ]
}
No markdown wrappers, no backticks, just raw JSON.`;

const getMathSystemPrompt = (age: number, isImage: boolean = false) => `You are an educational math tutor AI for children aged ${age}. You act like a patient tutor who guides children step-by-step through word problems, helping them learn HOW to think — not just find the answer.

${isImage ? `The child has uploaded a math worksheet image.` : `The child has requested math quiz practice.`}

# YOUR ONLY JOB
Generate NEW math word problems that are STRUCTURALLY IDENTICAL to the original worksheet — same type of reasoning, same complexity, same number of steps — but with completely different names, objects, story setting, and numbers.

DO NOT simplify. DO NOT omit structural elements. If the original has a price table → your problem MUST have a price table.

${isImage ? `Generate exactly 1 quiz with exactly 5 questions.` : `Generate exactly 3 quizzes with exactly 5 questions each.`}

# CRITICAL RULE: PRICE TABLE IN PROBLEM TEXT
If the original problem has a price list or reference table, you MUST invent and embed an equivalent table directly inside the "problemText" field, formatted with literal newlines like this:
"...story text...\\n\\nPrices:\\n- 1 packet of 6 squares: $4\\n- 1 packet of 3 rectangles: $2\\n- 1 circle: $3\\n\\n...rest of story..."

Every price and item the child needs to do the math MUST appear inside "problemText". The child has no other source of information.

# MANDATORY STEP SEQUENCE — FOLLOW EXACTLY
Every question MUST have these steps in exactly this order:

Step 1 — prompt MUST be the exact words: "What do we need to find out in this problem?"
  → Options: 3 different possible goals (only one is correct)

Step 2 — prompt MUST be the exact words: "What should our first step be?"
  → Options: 3 different possible first actions (e.g. "Count all the squares needed", "Add up all prices", "Count the total shapes")

Step 3 — prompt MUST be the exact words: "What's the second step?"
  → Options: 3 different possible second actions

Step 4 — prompt MUST be the exact words: "What's the third step?" (include only if the problem needs a third planning step)

Final Step — prompt MUST start with: "Now calculate"
  → Options MUST be 3 specific dollar amounts (or numbers), e.g. ["$14", "$18", "$22"] — never vague words like "Find the total"

# CONCRETE EXAMPLE OF A CORRECT OUTPUT
Here is exactly what one question should look like:
{
  "problemText": "Sofia wants to build a toy house for her cat. To make it, she will use these shapes: 2 cubes and 1 triangular prism. She also wants to decorate it with stars. Each star costs $1. She wants to add 3 stars.\\n\\nTo build the shapes, Sofia needs to buy flat pieces. Here are the prices:\\n- 1 packet of 6 squares: $4\\n- 1 packet of 3 triangles: $3\\n- 1 circle: $2\\n\\nHow much will it cost to buy all the flat pieces and stars for the toy house?",
  "steps": [
    {
      "prompt": "What do we need to find out in this problem?",
      "options": ["The total cost of all pieces and stars", "The number of cubes Sofia uses", "Which shape is the most expensive"],
      "correctIndex": 0,
      "explanation": "We need to find the total cost. That's the big question we are trying to answer."
    },
    {
      "prompt": "What should our first step be?",
      "options": ["Find out which flat pieces we need to buy", "Count the stars", "Add up all the prices"],
      "correctIndex": 0,
      "explanation": "We start by figuring out which flat pieces each 3D shape needs, so we know what to buy."
    },
    {
      "prompt": "What's the second step?",
      "options": ["Figure out how many packets of each piece to buy", "Pick the star color", "Count the total shapes"],
      "correctIndex": 0,
      "explanation": "Now that we know what pieces we need, we figure out how many packets to buy and what they cost."
    },
    {
      "prompt": "What's the third step?",
      "options": ["Add the cost of stars to the total", "Subtract the most expensive item", "Multiply shapes by 10"],
      "correctIndex": 0,
      "explanation": "Finally, we add the star costs to the shape costs to get the grand total."
    },
    {
      "prompt": "Now calculate the total cost (use paper if needed!) — how much will Sofia spend in total?",
      "options": ["$14", "$18", "$11"],
      "correctIndex": 0,
      "explanation": "2 packets of squares ($4 each) + 1 packet of triangles ($3) + 3 stars ($3) = $14 total."
    }
  ],
  "finalAnswer": "Sofia will need $14 to buy all the flat pieces and stars for the toy house."
}

Now generate problems following this exact pattern.

Requirements:
• "concept" field: strictly 2 words max (e.g. "Cost Calculation").
• Friendly, encouraging language throughout.
• Every "explanation" answers WHY this step comes next.
• Every problem MUST be fully solvable using only the information in "problemText".

Return the response STRICTLY as a JSON object:
{
${isImage ? `  "folderName": "Suggested folder name (strictly 1 to 2 words max)",\n` : ''}  "quizzes": [
    {
      "concept": "2 words max",
      "questions": [
        {
          "problemText": "Full story WITH price table embedded using \\n newlines",
          "steps": [
            {"prompt": "What do we need to find out in this problem?", "options": ["...", "...", "..."], "correctIndex": 0, "explanation": "..."},
            {"prompt": "What should our first step be?", "options": ["...", "...", "..."], "correctIndex": 0, "explanation": "..."},
            {"prompt": "What's the second step?", "options": ["...", "...", "..."], "correctIndex": 0, "explanation": "..."},
            {"prompt": "Now calculate the total cost (use paper if needed!) — [specific question]", "options": ["$X", "$Y", "$Z"], "correctIndex": 0, "explanation": "..."}
          ],
          "finalAnswer": "The answer in a complete friendly sentence."
        }
      ]
    }
  ]
}
No markdown, no backticks, just raw JSON.`;

const getSystemPrompt = (age: number, topicType: 'social' | 'math' = 'social', isImage: boolean = false) => {
  return topicType === 'math' ? getMathSystemPrompt(age, isImage) : getSocialSystemPrompt(age, isImage);
};

const validateQuizData = (data: any, topicType: 'social' | 'math' = 'social', isImage: boolean = false) => {
  if (!data || typeof data !== 'object') throw new Error("Root is not an object");
  
  if (isImage && typeof data.folderName !== 'string') {
    throw new Error(`Expected folderName string, got ${typeof data.folderName}`);
  }

  if (!Array.isArray(data.quizzes)) {
    throw new Error("Expected quizzes to be an array");
  }
  
  if (isImage) {
    if (data.quizzes.length < 1 || data.quizzes.length > 3) {
      throw new Error(`Expected 1 to 3 quizzes for image generation, got ${data.quizzes.length}`);
    }
  } else {
    if (data.quizzes.length !== 3) {
      throw new Error(`Expected exactly 3 quizzes for text generation, got ${data.quizzes.length}`);
    }
  }

  for (const [qIndex, quiz] of data.quizzes.entries()) {
    if (typeof quiz.concept !== 'string' || !quiz.concept.trim()) {
      throw new Error(`Quiz ${qIndex} has invalid or empty concept`);
    }
    const minQ = topicType === 'math' ? 1 : 5;
    if (!Array.isArray(quiz.questions) || quiz.questions.length < minQ) {
      throw new Error(`Quiz ${qIndex} expected at least ${minQ} questions, got ${quiz.questions?.length}`);
    }

    for (const [index, q] of quiz.questions.entries()) {
      if (topicType === 'social') {
        if (typeof q.question !== 'string' || !q.question.trim()) throw new Error(`Quiz ${qIndex} Question ${index} has invalid or empty text`);
        if (!Array.isArray(q.options) || q.options.length !== 3) throw new Error(`Quiz ${qIndex} Question ${index} must have exactly 3 options`);
        for (const opt of q.options) {
          if (typeof opt !== 'string' || !opt.trim()) throw new Error(`Quiz ${qIndex} Question ${index} has an empty option`);
        }
        if (typeof q.correctIndex !== 'number' || ![0, 1, 2].includes(q.correctIndex)) {
          throw new Error(`Quiz ${qIndex} Question ${index} has invalid correctIndex: ${q.correctIndex}`);
        }
        if (typeof q.explanation !== 'string' || !q.explanation.trim()) throw new Error(`Quiz ${qIndex} Question ${index} has invalid or empty explanation`);

        if (!Array.isArray(q.whyOptions) || q.whyOptions.length !== 3) throw new Error(`Quiz ${qIndex} Question ${index} must have exactly 3 whyOptions`);
        for (const opt of q.whyOptions) {
          if (typeof opt !== 'string' || !opt.trim()) throw new Error(`Quiz ${qIndex} Question ${index} has an empty whyOption`);
        }
        if (typeof q.correctWhyIndex !== 'number' || ![0, 1, 2].includes(q.correctWhyIndex)) {
          throw new Error(`Quiz ${qIndex} Question ${index} has invalid correctWhyIndex: ${q.correctWhyIndex}`);
        }
        if (typeof q.whyConfirmation !== 'string' || !q.whyConfirmation.trim()) throw new Error(`Quiz ${qIndex} Question ${index} has invalid or empty whyConfirmation`);
      } else {
        // math (step-based)
        if (typeof q.problemText !== 'string' || !q.problemText.trim()) throw new Error(`Quiz ${qIndex} Question ${index} has invalid or empty problemText`);
        if (!Array.isArray(q.steps) || q.steps.length < 3) throw new Error(`Quiz ${qIndex} Question ${index} must have at least 3 steps`);
        for (const [stepIndex, step] of q.steps.entries()) {
          if (typeof step.prompt !== 'string' || !step.prompt.trim()) throw new Error(`Quiz ${qIndex} Question ${index} Step ${stepIndex} has invalid prompt`);
          if (!Array.isArray(step.options) || step.options.length !== 3) throw new Error(`Quiz ${qIndex} Question ${index} Step ${stepIndex} must have exactly 3 options`);
          for (const opt of step.options) {
            if (typeof opt !== 'string' || !opt.trim()) throw new Error(`Quiz ${qIndex} Question ${index} Step ${stepIndex} has empty option`);
          }
          if (typeof step.correctIndex !== 'number' || ![0, 1, 2].includes(step.correctIndex)) {
            throw new Error(`Quiz ${qIndex} Question ${index} Step ${stepIndex} has invalid correctIndex: ${step.correctIndex}`);
          }
          if (typeof step.explanation !== 'string' || !step.explanation.trim()) throw new Error(`Quiz ${qIndex} Question ${index} Step ${stepIndex} has invalid explanation`);
        }
        if (typeof q.finalAnswer !== 'string' || !q.finalAnswer.trim()) throw new Error(`Quiz ${qIndex} Question ${index} has invalid or empty finalAnswer`);
      }
    }
  }
};

export const generateQuizFromImage = async (base64Image: string, age: number = 7, topicType: 'social' | 'math' = 'social') => {
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
              content: getSystemPrompt(age, topicType, true)
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
          max_tokens: 8000,
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

      validateQuizData(parsedData, topicType, true);
      
      return parsedData;

    } catch (error: any) {
      console.error(`Attempt ${attempt} failed generating quiz:`, error);
      lastError = error;
    }
  }

  throw lastError || new Error('Quiz generation failed after 2 attempts.');
};

export const generateQuizFromText = async (promptText: string, age: number = 7, topicType: 'social' | 'math' = 'social') => {
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
              content: getSystemPrompt(age, topicType)
            },
            {
              role: 'user',
              content: `The user wants to generate quizzes for this topic/task description: "${promptText}". Please generate exactly 3 quizzes teaching this concept.`
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: 8000,
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

      validateQuizData(parsedData, topicType);
      
      return parsedData;

    } catch (error: any) {
      console.error(`Attempt ${attempt} failed generating quiz from text:`, error);
      lastError = error;
    }
  }

  throw lastError || new Error('Quiz generation failed after 2 attempts.');
};
