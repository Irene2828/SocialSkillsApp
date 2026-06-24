# Social Quest

A calm, Scandinavian-inspired social skills learning app for children (7–10 years old). 

Social Quest focuses on teaching social skills through simple quizzes, rewarding learning cleanly, and establishing daily habits—all while avoiding noisy gamification and maintaining a parent-trusted environment.

## Features

- **Quiz Engine**: 10-question quizzes across multiple categories like Friendship, Manners, and Safety.
- **Scandinavian Design**: A visually calming interface with a highly disciplined layout and restricted animations.
- **Offline First**: All progress is managed locally for safety and simplicity.

## Tech Stack

- React Native (Expo)
- TypeScript
- React Navigation (Bottom Tabs)

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npx expo start
   ```

## Folder Structure

The project is structured logically for maintainability and consistency:

```
social-quest/
├── src/                # Main application code
│   ├── components/     # Reusable UI elements (Button, Card, QuizCard, etc.)
│   ├── screens/        # Full screen views (NewQuiz, Rewards, Settings)
│   ├── navigation/     # App routing logic
│   ├── data/           # Mock data and TypeScript interfaces
│   ├── theme/          # UI theme constants (colors, typography, spacing)
│   ├── hooks/          # Custom React hooks (empty)
│   └── utils/          # Helper functions (empty)
│
├── design-system/      # Centralized rules and prompts
│   ├── SYSTEM_PROMPT.md
│   ├── DESIGN_SYSTEM.md
│   └── DESIGN_LINT_RULES.md
│
├── App.tsx             # Application entry point
```

## Contribution

When contributing, ensure all code strictly adheres to the UI and UX guidelines specified within the `design-system` folder.
