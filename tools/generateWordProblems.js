const fs = require('fs');

const rawData = `
**Quiz 1 (Addition):** "Emma picked 24 flowers in the morning and 18 more in the afternoon. How many flowers did she pick in total?"
- Step 1: "What are we trying to find?" -> How many flowers she picked in the morning / How many flowers she picked in total / How many flowers are left — correct: How many flowers she picked in total
- Step 2: "Which operation solves this?" -> Addition / Subtraction / Multiplication — correct: Addition
- Step 3: "Which equation is correct?" -> 24 + 18 / 24 − 18 / 18 − 24 — correct: 24 + 18
- Final answer: "42 flowers"

**Quiz 2 (Subtraction):** "There were 35 birds on a wire. 12 flew away. How many birds are left on the wire?"
- Step 1: What are we trying to find? -> How many birds flew away / How many birds are left / How many birds there were at first — correct: How many birds are left
- Step 2: Which operation? -> Subtraction / Addition / Division — correct: Subtraction
- Step 3: Which equation? -> 35 − 12 / 12 − 35 / 35 + 12 — correct: 35 − 12
- Final answer: "23 birds"

**Quiz 3 (Comparison):** "Noah has 28 trading cards. His sister has 19 trading cards. How many more cards does Noah have than his sister?"
- Step 1: What are we trying to find? -> How many cards they have together / How many more cards Noah has than his sister / How many cards his sister needs — correct: How many more cards Noah has than his sister
- Step 2: Which operation? -> Subtraction / Addition / Multiplication — correct: Subtraction
- Step 3: Which equation? -> 28 − 19 / 19 − 28 / 28 + 19 — correct: 28 − 19
- Final answer: "9 more cards"

**Quiz 4 (Multiplication):** "There are 5 tables in the classroom. Each table has 4 chairs. How many chairs are there in total?"
- Step 1: What are we trying to find? -> How many tables there are / How many chairs are at one table / How many chairs in total — correct: How many chairs in total
- Step 2: Which operation? -> Multiplication / Addition of two numbers / Subtraction — correct: Multiplication
- Step 3: Which equation? -> 5 × 4 / 5 + 4 / 4 − 5 — correct: 5 × 4
- Final answer: "20 chairs"

**Quiz 5 (Division):** "A coach has 24 tennis balls to share equally among 6 players. How many tennis balls does each player get?"
- Step 1: What are we trying to find? -> How many players there are / How many tennis balls each player gets / How many balls are left over — correct: How many tennis balls each player gets
- Step 2: Which operation? -> Division / Multiplication / Addition — correct: Division
- Step 3: Which equation? -> 24 ÷ 6 / 6 ÷ 24 / 24 × 6 — correct: 24 ÷ 6
- Final answer: "4 tennis balls each"

**Quiz 6 (Money):** "Mia has $35. She buys a book for $12. How much money does she have left?"
- Step 1: What are we trying to find? -> How much the book cost / How much money Mia has left / How much money Mia started with — correct: How much money Mia has left
- Step 2: Which operation? -> Subtraction / Addition / Multiplication — correct: Subtraction
- Step 3: Which equation? -> 35 − 12 / 12 − 35 / 35 + 12 — correct: 35 − 12
- Final answer: "$23"

**Quiz 7 (Measurement/time):** "A recess period lasts 20 minutes. If recess starts at 10:15, what time does it end?"
- Step 1: What are we trying to find? -> How long recess lasts / What time recess ends / What time recess started — correct: What time recess ends
- Step 2: Which operation? -> Adding time / Subtracting time / Multiplying time — correct: Adding time
- Step 3: Which equation? -> 10:15 + 20 minutes / 10:15 − 20 minutes / 20 minutes + 20 minutes — correct: 10:15 + 20 minutes
- Final answer: "10:35"

**Quiz 8 (Addition, distractor):** "A bakery made 45 muffins and 30 cupcakes. They sold 22 muffins in the morning. How many muffins does the bakery have left?"
- Step 1: "What information do we actually need?" -> Muffins made and muffins sold / Cupcakes made / Both muffins and cupcakes together — correct: Muffins made and muffins sold
- Step 2: Which operation? -> Subtraction / Addition / Multiplication — correct: Subtraction
- Step 3: Which equation? -> 45 − 22 / 30 − 22 / 45 + 30 — correct: 45 − 22
- Final answer: "23 muffins"

**Quiz 9 (Subtraction, distractor):** "A parking lot has 60 cars. There are also 8 motorcycles parked there. 25 cars leave during the day. How many cars are left in the lot?"
- Step 1: "What information do we actually need?" -> Cars and motorcycles together / Number of cars and how many left / Just the motorcycles — correct: Number of cars and how many left
- Step 2: Which operation? -> Subtraction / Addition / Division — correct: Subtraction
- Step 3: Which equation? -> 60 − 25 / 60 − 8 / 60 + 25 — correct: 60 − 25
- Final answer: "35 cars"

**Quiz 10 (Multiplication, stretch):** "A store arranges books on 3 shelves. Each shelf holds 14 books. How many books are there in total?"
- Step 1: What are we trying to find? -> How many shelves there are / How many books in total / How many books fit on one shelf — correct: How many books in total
- Step 2: Which operation? -> Multiplication / Addition / Subtraction — correct: Multiplication
- Step 3: Which equation? -> 3 × 14 / 3 + 14 / 14 − 3 — correct: 3 × 14
- Final answer: "42 books"

**Quiz 11 (Division, distractor):** "A teacher has 36 crayons and 10 pencils. She wants to share the crayons equally among 4 groups of students. How many crayons does each group get?"
- Step 1: "What information do we actually need?" -> The crayons and the number of groups / The pencils and the groups / Both crayons and pencils together — correct: The crayons and the number of groups
- Step 2: Which operation? -> Division / Multiplication / Subtraction — correct: Division
- Step 3: Which equation? -> 36 ÷ 4 / 10 ÷ 4 / 36 × 4 — correct: 36 ÷ 4
- Final answer: "9 crayons each"

**Quiz 12 (Money, distractor):** "Liam has $40. He wants to buy a toy that costs $25 and a snack that costs $6, but today he only buys the toy. How much money does he have left after buying the toy?"
- Step 1: "What information do we actually need?" -> The $40 and the toy's $25 cost / The snack's $6 cost / All three amounts together — correct: The $40 and the toy's $25 cost
- Step 2: Which operation? -> Subtraction / Addition / Multiplication — correct: Subtraction
- Step 3: Which equation? -> 40 − 25 / 40 − 6 / 25 + 6 — correct: 40 − 25
- Final answer: "$15"

**Quiz 13 (Comparison, stretch):** "A garden has 52 red tulips and 37 yellow tulips. How many more red tulips are there than yellow tulips?"
- Step 1: What are we trying to find? -> How many tulips in total / How many more red tulips than yellow / How many yellow tulips there are — correct: How many more red tulips than yellow
- Step 2: Which operation? -> Subtraction / Addition / Multiplication — correct: Subtraction
- Step 3: Which equation? -> 52 − 37 / 37 − 52 / 52 + 37 — correct: 52 − 37
- Final answer: "15 more red tulips"

**Quiz 14 (Measurement/time, distractor):** "A movie is 85 minutes long. The theater also sells popcorn for $5. If the movie starts at 1:30, what time does it end?"
- Step 1: "What information do we actually need?" -> The movie length and start time / The popcorn price / All three details — correct: The movie length and start time
- Step 2: Which operation? -> Adding time / Subtracting time / Multiplying time — correct: Adding time
- Step 3: Which equation? -> 1:30 + 85 minutes / 1:30 − 85 minutes / 85 + 5 — correct: 1:30 + 85 minutes
- Final answer: "2:55"

**Quiz 15 (Two-step: multiply then subtract, money):** "A backpack costs $18. Sam buys 2 backpacks and pays with a $50 bill. How much change does he get back?"
- Step 1: What are we trying to find? -> How much the backpacks cost / How much change Sam gets back / How much money Sam started with — correct: How much change Sam gets back
- Step 2: "What do we do first?" -> Multiply $18 × 2 to find the total cost / Subtract $18 from $50 / Add $18 and $50 — correct: Multiply $18 × 2 to find the total cost
- Step 3: "What do we do next?" -> Subtract the total cost from $50 / Add the total cost to $50 / Divide $50 by 2 — correct: Subtract the total cost from $50
- Final answer: "$14 (2 × $18 = $36, then $50 − $36 = $14)"

**Quiz 16 (Two-step: multiply then add):** "There are 24 pencils in a classroom. The teacher buys 3 more boxes with 6 pencils in each box. How many pencils are there now?"
- Step 1: What are we trying to find? -> How many pencils were bought / How many pencils there are now in total / How many boxes were bought — correct: How many pencils there are now in total
- Step 2: "What do we do first?" -> Multiply 3 × 6 to find how many new pencils / Add 24 + 3 / Subtract 6 from 24 — correct: Multiply 3 × 6 to find how many new pencils
- Step 3: "What do we do next?" -> Add the new pencils to the original 24 / Subtract the new pencils from 24 / Divide 24 by 6 — correct: Add the new pencils to the original 24
- Final answer: "42 pencils (3 × 6 = 18, then 24 + 18 = 42)"

**Quiz 17 (Two-step: multiply then add, recess/sports):** "During recess, 6 groups of children play soccer, with 4 children in each group. Afterward, 5 more children join to watch. How many children are involved in total, playing or watching?"
- Step 1: What are we trying to find? -> How many children are playing / How many children are involved in total / How many groups there are — correct: How many children are involved in total
- Step 2: "What do we do first?" -> Multiply 6 × 4 to find how many are playing / Add 6 + 5 / Subtract 5 from 6 — correct: Multiply 6 × 4 to find how many are playing
- Step 3: "What do we do next?" -> Add the 5 who joined to watch / Subtract the 5 who joined / Divide by 5 — correct: Add the 5 who joined to watch
- Final answer: "29 children (6 × 4 = 24, then 24 + 5 = 29)"

**Quiz 18 (Two-step: subtract then divide):** "A bag has 50 apples. A vendor sells 14 apples in the morning, then shares the rest equally into 4 baskets. How many apples go into each basket?"
- Step 1: What are we trying to find? -> How many apples were sold / How many apples go into each basket / How many baskets there are — correct: How many apples go into each basket
- Step 2: "What do we do first?" -> Subtract the 14 sold from 50 / Divide 50 by 4 / Add 14 and 50 — correct: Subtract the 14 sold from 50
- Step 3: "What do we do next?" -> Divide the remaining apples by 4 / Multiply the remaining apples by 4 / Subtract 4 from the remaining apples — correct: Divide the remaining apples by 4
- Final answer: "9 apples per basket (50 − 14 = 36, then 36 ÷ 4 = 9)"

**Quiz 19 (Two-step: add then subtract, comparison):** "Ava saved $15 in January and $22 in February. Her brother saved $30 in total over the same two months. How much more money did Ava save than her brother?"
- Step 1: What are we trying to find? -> How much Ava saved in total / How much more Ava saved than her brother / How much her brother saved — correct: How much more Ava saved than her brother
- Step 2: "What do we do first?" -> Add Ava's January and February savings / Subtract $30 from $15 / Multiply $15 × $22 — correct: Add Ava's January and February savings
- Step 3: "What do we do next?" -> Subtract her brother's $30 from Ava's total / Add her brother's $30 to Ava's total / Divide Ava's total by $30 — correct: Subtract her brother's $30 from Ava's total
- Final answer: "$7 more (15 + 22 = 37, then 37 − 30 = 7)"

**Quiz 20 (Two-step: multiply then subtract, capstone):** "A school orders 8 boxes of markers, with 12 markers in each box. After handing some out to classrooms, 34 markers are left. How many markers were handed out?"
- Step 1: What are we trying to find? -> How many markers were ordered / How many markers were handed out / How many boxes were ordered — correct: How many markers were handed out
- Step 2: "What do we do first?" -> Multiply 8 × 12 to find the total ordered / Subtract 34 from 8 / Add 8 and 12 — correct: Multiply 8 × 12 to find the total ordered
- Step 3: "What do we do next?" -> Subtract the 34 remaining from the total ordered / Add the 34 remaining to the total ordered / Divide the total by 34 — correct: Subtract the 34 remaining from the total ordered
- Final answer: "62 markers (8 × 12 = 96, then 96 − 34 = 62)"
`;

const blocks = rawData.trim().split('\n\n');
const parsedQuizzes = blocks.map((block) => {
  const lines = block.split('\n');
  const quizHeader = lines[0];
  const match = quizHeader.match(/\*\*Quiz (\d+) \([^)]+\):\*\* "(.*)"/);
  if (!match) return null;
  const quizNum = match[1];
  const problemText = match[2];

  const steps = [];
  for (let i = 1; i <= 3; i++) {
    const line = lines[i]; 
    const stepMatch = line.match(/- Step \d+: (.*) -> (.*) — correct: (.*)/);
    if (stepMatch) {
      let prompt = stepMatch[1];
      if (prompt.startsWith('"') && prompt.endsWith('"')) {
          prompt = prompt.substring(1, prompt.length - 1);
      }
      const rawOptions = stepMatch[2].split(' / ').map(s => s.trim());
      const correctStr = stepMatch[3].trim();
      const correctIndex = rawOptions.indexOf(correctStr);
      
      steps.push({
        id: "wp_quiz_" + quizNum + "_p1_s" + i,
        prompt: prompt,
        options: rawOptions,
        correctIndex: correctIndex,
        explanation: i === 1 ? "Great job!" : i === 2 ? "That's right!" : "Excellent!"
      });
    }
  }

  const finalLine = lines[4];
  const finalMatch = finalLine.match(/- Final answer: "(.*)"/);
  const finalAns = finalMatch ? finalMatch[1] : '';

  // Wait, let's look at the original StepBasedQuestion in types.ts.
  // We need to add the final answer as the 4th step or as a property.
  // Actually, usually the 4th step is a typing input. 
  // Let's add a 4th step that is the final answer!
  steps.push({
    id: "wp_quiz_" + quizNum + "_p1_s4",
    prompt: "So, what is the final answer?",
    options: [finalAns], // If options has length 1, maybe it's a free-text input or maybe just add some dummy options?
    correctIndex: 0,
    explanation: "Perfect! " + finalAns
  });

  return {
    id: "wp_quiz_" + quizNum + "_p1",
    category: "wp_quiz_" + quizNum,
    difficulty: "Medium",
    problemText: problemText,
    steps: steps,
  };
}).filter(Boolean);

// Let's fix the 4th step dummy options to make it multiple choice,
// since StepBasedQuestion currently assumes multiple choice if there are options.
parsedQuizzes.forEach((quiz, idx) => {
  const finalStep = quiz.steps[3];
  const finalAns = finalStep.options[0];
  // extract just the number if possible to generate distractors
  const numMatch = finalAns.match(/\$?(\d+)/);
  if (numMatch) {
    const val = parseInt(numMatch[1], 10);
    const distractor1 = finalAns.replace(numMatch[1], (val + 5).toString());
    const distractor2 = finalAns.replace(numMatch[1], (Math.max(0, val - 3)).toString());
    finalStep.options = [distractor1, finalAns, distractor2];
    finalStep.correctIndex = 1;
  } else {
    finalStep.options = [finalAns + " (wrong)", finalAns, finalAns + " (nope)"];
    finalStep.correctIndex = 1;
  }
});


const fileContent = "import { StepBasedQuestion } from './types';\n\nexport const wordProblems: StepBasedQuestion[] = " + JSON.stringify(parsedQuizzes, null, 2) + ";\n";

fs.writeFileSync('src/data/wordProblems.ts', fileContent);
console.log('Successfully generated wordProblems.ts');
