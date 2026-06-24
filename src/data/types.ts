export type Category = "Friendship" | "Manners" | "School" | "Feelings" | "Playground" | "Safety";

export type Difficulty = "Easy" | "Medium";

export interface Question {
  id: string;
  category: Category;
  difficulty: Difficulty;
  scenario: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizCategory {
  id: Category;
  title: string;
  description: string;
}

export const QUIZ_CATEGORIES: QuizCategory[] = [
  { id: "Friendship", title: "Friendship Skills", description: "Learn how to be a great friend." },
  { id: "Manners", title: "School Manners", description: "Practice good manners in class." },
  { id: "Feelings", title: "Feelings & Emotions", description: "Understand what you and others feel." },
  { id: "Playground", title: "Playground Skills", description: "Have fun and stay safe at recess." },
  { id: "Safety", title: "Safety Basics", description: "Learn important rules to keep safe." },
];
