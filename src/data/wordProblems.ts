import { StepBasedQuestion } from './types';

export const wordProblems: StepBasedQuestion[] = [
  {
    id: "wp_1",
    category: "iq_word_problems",
    problemText: "Sarah has 4 red apples and 3 green apples. How many apples does she have in total?",
    steps: [
      {
        id: "wp_1_s1",
        prompt: "What is the problem asking us to find?",
        options: ["The color of the apples", "The total number of apples", "Who has the apples"],
        correctIndex: 1,
        explanation: "Great job! We need to find out how many apples Sarah has altogether."
      },
      {
        id: "wp_1_s2",
        prompt: "To find the total, which math operation should we use?",
        options: ["Addition (+)", "Subtraction (-)", "Counting (-1)"],
        correctIndex: 0,
        explanation: "Correct! When we put groups together to find a total, we add."
      },
      {
        id: "wp_1_s3",
        prompt: "Which number sentence matches this problem?",
        options: ["4 - 3 = ?", "4 + 3 = ?", "3 + 3 = ?"],
        correctIndex: 1,
        explanation: "Yes! 4 red apples plus 3 green apples is 4 + 3."
      }
    ],
    finalAnswer: "7 apples"
  },
  {
    id: "wp_2",
    category: "iq_word_problems",
    problemText: "Tom had 10 toy cars. He gave 3 to his little brother. How many toy cars does Tom have left?",
    steps: [
      {
        id: "wp_2_s1",
        prompt: "What is happening in this story?",
        options: ["Tom is getting more cars", "Tom is sharing his cars", "Tom is counting his cars"],
        correctIndex: 1,
        explanation: "Right! Tom gave some of his cars away."
      },
      {
        id: "wp_2_s2",
        prompt: "Since Tom gave cars away, which math operation should we use?",
        options: ["Addition (+)", "Subtraction (-)", "Multiplication (x)"],
        correctIndex: 1,
        explanation: "Correct! When we give things away or take them away, we subtract."
      },
      {
        id: "wp_2_s3",
        prompt: "Which number sentence matches this problem?",
        options: ["10 - 3 = ?", "10 + 3 = ?", "3 - 10 = ?"],
        correctIndex: 0,
        explanation: "Spot on! Tom started with 10 and gave away 3."
      }
    ],
    finalAnswer: "7 toy cars"
  },
  {
    id: "wp_3",
    category: "iq_word_problems",
    problemText: "There are 2 boxes of crayons. Each box has 5 crayons inside. How many crayons are there in total?",
    steps: [
      {
        id: "wp_3_s1",
        prompt: "What information is given in the problem?",
        options: ["There are 5 boxes with 2 crayons each", "There are 2 boxes with 5 crayons each", "There are 7 crayons in total"],
        correctIndex: 1,
        explanation: "Yes! We have 2 boxes, and each box has exactly 5 crayons."
      },
      {
        id: "wp_3_s2",
        prompt: "How can we figure out the total number of crayons?",
        options: ["Add 5 + 5", "Subtract 5 - 2", "Add 2 + 2"],
        correctIndex: 0,
        explanation: "Correct! We have two groups of 5, so we can add 5 + 5."
      },
      {
        id: "wp_3_s3",
        prompt: "What is 5 + 5?",
        options: ["10", "7", "12"],
        correctIndex: 0,
        explanation: "Excellent! 5 + 5 makes 10."
      }
    ],
    finalAnswer: "10 crayons"
  },
  {
    id: "wp_4",
    category: "iq_word_problems",
    problemText: "A baker made 12 cookies. He sold 5 of them in the morning. How many cookies does he have left?",
    steps: [
      {
        id: "wp_4_s1",
        prompt: "What do we need to find out?",
        options: ["How many cookies he made", "How many cookies he sold", "How many cookies are left over"],
        correctIndex: 2,
        explanation: "Right! We want to know what is remaining after he sold some."
      },
      {
        id: "wp_4_s2",
        prompt: "To find out how many are left, what should we do?",
        options: ["Add 12 + 5", "Subtract 12 - 5", "Subtract 5 - 5"],
        correctIndex: 1,
        explanation: "Yes! We start with the total (12) and take away the part he sold (5)."
      }
    ],
    finalAnswer: "7 cookies"
  },
  {
    id: "wp_5",
    category: "iq_word_problems",
    problemText: "Mia has 8 stickers. Her friend gives her 6 more. How many stickers does Mia have now?",
    steps: [
      {
        id: "wp_5_s1",
        prompt: "Is Mia getting more stickers or losing stickers?",
        options: ["Getting more", "Losing some", "Staying the same"],
        correctIndex: 0,
        explanation: "Correct! Her friend gave her more stickers."
      },
      {
        id: "wp_5_s2",
        prompt: "Which number sentence helps us solve this?",
        options: ["8 - 6 = ?", "8 + 6 = ?", "6 - 8 = ?"],
        correctIndex: 1,
        explanation: "Right! We add the stickers she had to the stickers she got."
      }
    ],
    finalAnswer: "14 stickers"
  },
  {
    id: "wp_6",
    category: "iq_word_problems",
    problemText: "There are 15 birds on a tree. 4 birds fly away. How many birds are left on the tree?",
    steps: [
      {
        id: "wp_6_s1",
        prompt: "What does 'fly away' mean in this math story?",
        options: ["We should add", "We should subtract", "We should guess"],
        correctIndex: 1,
        explanation: "Yes! When birds fly away, they are leaving the group, so we subtract."
      },
      {
        id: "wp_6_s2",
        prompt: "Which number is the total we start with?",
        options: ["4", "11", "15"],
        correctIndex: 2,
        explanation: "Correct! We started with 15 birds in the tree."
      },
      {
        id: "wp_6_s3",
        prompt: "What is 15 take away 4?",
        options: ["11", "19", "10"],
        correctIndex: 0,
        explanation: "Great job! 15 minus 4 leaves 11 birds."
      }
    ],
    finalAnswer: "11 birds"
  }
];
