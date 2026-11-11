export type QuizzerStackParamList = {
  QuizLibrary: { isFabActive?: boolean } | undefined;
  QuizMenu: undefined;
  CreateQuizFromPhoto: { initialTab?: 'camera' | 'text' | 'gallery'; prefilledConcept?: string } | undefined;
  MyRewards: undefined;
};
