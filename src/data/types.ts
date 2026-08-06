// We allow string so custom AI concepts can be used as categories
export type Category = "Friendship" | "Manners" | "School" | "Feelings" | "Playground" | "Safety" | string;

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Question {
  id: string;
  category: Category;
  difficulty: Difficulty;
  scenario: string;
  prompt?: string;
  image?: any;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  whyOptions?: string[];
  correctWhyIndex?: number;
  whyConfirmation?: string;
  whyQuestion?: string;
}

export interface QuizFolder {
  id: string;
  name: string;
  icon?: string;
  tab: 'general' | 'ai';
  parentId?: string;
}

export interface QuizCategory {
  id: Category;
  title: string;
  description: string;
  isNew?: boolean;
  icon?: string;
  color?: string;
  isCustom?: boolean;
  folderId?: string;
}

export const QUIZ_CATEGORIES: QuizCategory[] = [
  { id: "general_quiz", title: "General Quiz", description: "All social skills questions", icon: "people-outline" }
];

export interface Reward {
  id: string;
  title: string;
  cost: number;
  icon?: string;
  isCustom: boolean;
}

export interface UnlockedReward {
  id: string; // unique instance id for the unlocked reward
  rewardId: string; // the original reward's id
  title: string;
  cost: number;
  icon: string;
  timestamp: number;
  isFulfilled: boolean;
}

export interface Step {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StepBasedQuestion {
  id: string;
  category: string;
  difficulty?: Difficulty;
  problemText: string;
  steps: Step[];
  finalAnswer?: string;
}

export type SocialQuestionType = "understand" | "choose-response" | "notice-signal" | "repair" | "transfer";

export interface SocialAnswerOption {
  id: string;
  text: string;
  isAccepted: boolean;
  isBestFit?: boolean;
  feedback: string;
}

export interface SocialQuestion {
  id: string;
  type: SocialQuestionType;
  prompt: string;
  options: SocialAnswerOption[];
  hint: string;
  highlightedContext?: string;
}

export interface SocialPracticeQuiz {
  id: string;
  familyId: string;
  title: string;
  ageRange: "7-8";
  skillName: string;
  situation: {
    setting: string;
    characters: { name: string; description?: string }[];
    introduction: string;
  };
  questions: SocialQuestion[];
  completion: {
    skillSummary: string;
    realLifePractice: string;
  };
}
