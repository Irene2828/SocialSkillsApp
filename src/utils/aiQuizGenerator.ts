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
Read and fully understand the original math problem. Then create a practice version that protects the exact worksheet wording but preserves the same situation, math model, and visual/source structure.

For uploaded worksheet images, do NOT invent a totally different story world. Keep the same kind of scene and object so the child's practice problem still looks and feels like the school test:
• If the original is about building a rocket, keep it about building a rocket or a very close object.
• If the original is about plane figures for solids, keep the same solid names and plane-figure categories.
• Change character names and lightly rephrase sentences.
• You may change numbers/prices only when the same relationships, counts of items, units, ranges, and table rows are preserved.
• If changing a number would make the solved answer uncertain or would require a missing geometry fact, keep the original number.

For text-only math practice requests, you may create brand-new stories, but you must still preserve the requested math skill.

${isImage ? `Generate exactly 1 quiz with exactly 1 question. That single question is the rewritten version of the uploaded worksheet problem.` : `Generate exactly 3 quizzes with exactly 5 questions each.`}

# ABSOLUTE RULE: NEVER OMIT DETAILS
This is the most important rule. When you read the original problem, identify EVERY piece of information it provides:
• Reference tables (price lists, measurement charts, conversion tables, ingredient lists)
• Quantities, rates, conditions, constraints
• Multi-part questions or sub-questions
• Setup context that is needed to solve the problem (e.g. "each cube is made of 6 squares")
• Any background facts the child needs to know to solve it

Your rewritten problem MUST include an equivalent for EVERY one of these elements. If the original gives 5 data points, yours gives 5 data points. If the original has a table with 4 rows, yours has a table with 4 rows. If the original mentions a conversion fact (e.g. "a cube has 6 faces"), you MUST include the equivalent conversion fact in your version.

For geometry, units, money, time, fractions, measurements, and ranges, preserve the exact category names unless you are completely certain the replacement is mathematically equivalent. Never change a square prism into a rectangular prism, a triangular pyramid into a prism, or a range like "between 2 and 7" into a different range unless the original range is clearly changed in a fully consistent rewritten problem.

DO NOT simplify. DO NOT shorten. DO NOT remove information you think is "obvious." The child has ONLY your "problemText" to work from — if you omit something, the child cannot solve the problem and will be confused.

# COMPACT PROBLEM SHEET FORMAT
The "problemText" MUST be compact, like a clean worksheet card the child can keep visible while answering.
Compact means organized and scannable. It NEVER means shortened, summarized, or missing information.
Do NOT write one long paragraph.
Use this exact structure with line breaks:

Story: [the FULL rewritten word problem, using 2 to 5 concise sentences. For uploaded worksheets, keep the same situation and object type but change names and wording. Include every setup detail, table/rate detail, condition, and question context here. Do not summarize.]

Facts:
- [fact 1]
- [fact 2]
- [fact 3]
- [include every table row, rate, conversion, condition, and irrelevant-but-present detail as its own compact bullet]

Question: [the exact thing to find]

Keep each fact bullet short. If the original has a table, rewrite it as bullets under Facts. The Facts section is only a quick reference copy for the child — it is NOT a replacement for the full rewritten problem in Story. The problem must fit as one compact reference sheet while still containing every original logical detail.

# REWRITING STRATEGY
1. Read the original problem completely.
2. List every fact, table entry, quantity, condition, and question it contains.
3. For uploaded worksheets, keep the same scene type and object type. Change names and wording only enough to avoid copying the test text.
4. Map each original fact to an equivalent new fact. Preserve category names, number of rows, ranges, units, and geometry terms.
5. Write the new problem ensuring the SAME question direction (what is being asked).
6. Solve the rewritten problem yourself using every relevant rewritten fact.
7. Double-check: does your version contain the same number of facts, table rows, conditions, and sub-questions as the original? If not, add the missing ones.
8. Double-check the final calculation against the rewritten facts. The correct answer must be mathematically true.

# CRITICAL RULE: FACT COVERAGE
Every price, quantity, conversion fact, and data point the child needs to do the math MUST appear inside "problemText". The child has no other source of information.
If the original has extra information that should be ignored, include an equivalent extra fact and make one planning step teach what to ignore.
The Story section must be complete enough that the child can understand the whole situation without reading the Facts section first. The Facts section repeats the important numbers and conditions in a compact way so the child does not have to scroll back while answering.

# MANDATORY STEP SEQUENCE — FOLLOW EXACTLY
Every question MUST have exactly 5 steps in exactly this order:

Step 1 — prompt MUST be the exact words: "What do we need to find out in this problem?"
  → This asks the child to identify the overall goal/question of the problem
  → Options: 3 different possible goals (only one is correct, and it must match the actual question being asked)

Step 2 — prompt MUST be the exact words: "What should our first step be?"
  → Options: 3 different possible first actions (e.g. "Count all the squares needed", "Add up all prices", "Count the total shapes")

Step 3 — prompt MUST be the exact words: "What's the second step?"
  → Options: 3 different possible second actions

Step 4 — prompt MUST be the exact words: "What's the third step?"
  → Options: 3 different possible third actions
  → If the problem is simple, this step should be a real reasoning step like "write the equation", "combine the totals", "choose the useful facts", or "check what information to ignore" — never skip it

Final Step — prompt MUST start with: "Now calculate"
  → Options MUST be 3 specific numerical answers (dollar amounts, counts, measurements, etc.), e.g. ["$14", "$18", "$22"] — never vague words like "Find the total"
  → The correct option MUST equal the answer from your rewritten problemText

# CONCRETE EXAMPLE OF A CORRECT OUTPUT
Here is exactly what one question should look like:
{
  "problemText": "Story: Sofia wants to build a toy house for her cat using 2 cubes and 1 triangular prism. Each cube needs 6 square pieces, and each triangular prism needs 3 rectangle pieces and 2 triangle pieces. Sofia must buy packets of pieces: 1 packet of 6 squares costs $4, 1 packet of 3 rectangles costs $2, and 1 packet of 2 triangles costs $3. She also wants to add 3 stars, and each star costs $1.\\n\\nFacts:\\n- Sofia will use 2 cubes.\\n- Sofia will use 1 triangular prism.\\n- Each cube needs 6 squares.\\n- Each triangular prism needs 3 rectangles and 2 triangles.\\n- 1 packet of 6 squares costs $4.\\n- 1 packet of 3 rectangles costs $2.\\n- 1 packet of 2 triangles costs $3.\\n- She wants 3 stars.\\n- Each star costs $1.\\n\\nQuestion: How much will all the flat pieces and stars cost?",
  "steps": [
    {
      "prompt": "What do we need to find out in this problem?",
      "options": ["The total cost of all pieces and stars", "The number of cubes Sofia uses", "Which packet is the most expensive"],
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

Requirements:
• "concept" field: strictly 2 words max (e.g. "Cost Calculation").
• Friendly, encouraging language throughout.
• Every "explanation" answers WHY this step comes next.
• Every problem MUST be fully solvable using only the information in "problemText".
• Your rewritten story MUST contain the same number of facts, data points, and conditions as the original — never fewer.
• Every math question MUST have exactly 5 steps: goal, first step, second step, third step, final calculation.
• The final calculation must be the last step, never Step 3 or Step 4.

Return the response STRICTLY as a JSON object:
{
${isImage ? `  "folderName": "Suggested folder name (strictly 1 to 2 words max)",\n` : ''}  "quizzes": [
    {
      "concept": "2 words max",
      "questions": [
        {
          "problemText": "Story: ...\\n\\nFacts:\\n- ...\\n- ...\\n\\nQuestion: ...",
          "steps": [
            {"prompt": "What do we need to find out in this problem?", "options": ["...", "...", "..."], "correctIndex": 0, "explanation": "..."},
            {"prompt": "What should our first step be?", "options": ["...", "...", "..."], "correctIndex": 0, "explanation": "..."},
            {"prompt": "What's the second step?", "options": ["...", "...", "..."], "correctIndex": 0, "explanation": "..."},
            {"prompt": "What's the third step?", "options": ["...", "...", "..."], "correctIndex": 0, "explanation": "..."},
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

const REQUIRED_MATH_PLANNING_PROMPTS = [
  'What do we need to find out in this problem?',
  'What should our first step be?',
  "What's the second step?",
  "What's the third step?",
];

const looksLikeNumericalAnswer = (option: string) => /(?:\d|[$€£¢]|:|\/)/.test(option);

const validateQuizData = (data: any, topicType: 'social' | 'math' = 'social', isImage: boolean = false) => {
  if (!data || typeof data !== 'object') throw new Error("Root is not an object");
  
  if (isImage && typeof data.folderName !== 'string') {
    throw new Error(`Expected folderName string, got ${typeof data.folderName}`);
  }

  if (!Array.isArray(data.quizzes)) {
    throw new Error("Expected quizzes to be an array");
  }
  
  if (isImage) {
    if (topicType === 'math') {
      if (data.quizzes.length !== 1) {
        throw new Error(`Expected exactly 1 math quiz for image generation, got ${data.quizzes.length}`);
      }
    } else if (data.quizzes.length < 1 || data.quizzes.length > 3) {
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
    const expectedQuestionCount = topicType === 'math' ? (isImage ? 1 : 5) : 5;
    if (!Array.isArray(quiz.questions) || quiz.questions.length !== expectedQuestionCount) {
      throw new Error(`Quiz ${qIndex} expected exactly ${expectedQuestionCount} questions, got ${quiz.questions?.length}`);
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
        if (!/Story:/i.test(q.problemText) || !/Facts:/i.test(q.problemText) || !/Question:/i.test(q.problemText)) {
          throw new Error(`Quiz ${qIndex} Question ${index} problemText must use compact Story/Facts/Question format`);
        }
        if (!Array.isArray(q.steps) || q.steps.length !== 5) throw new Error(`Quiz ${qIndex} Question ${index} must have exactly 5 steps`);
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

          if (stepIndex < REQUIRED_MATH_PLANNING_PROMPTS.length && step.prompt.trim() !== REQUIRED_MATH_PLANNING_PROMPTS[stepIndex]) {
            throw new Error(`Quiz ${qIndex} Question ${index} Step ${stepIndex} has wrong prompt order: ${step.prompt}`);
          }

          if (stepIndex === 4) {
            if (!step.prompt.trim().startsWith('Now calculate')) {
              throw new Error(`Quiz ${qIndex} Question ${index} final step must start with "Now calculate"`);
            }
            if (!step.options.every(looksLikeNumericalAnswer)) {
              throw new Error(`Quiz ${qIndex} Question ${index} final step options must be numerical answers`);
            }
          }
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
