# Quizzer

Quiz app created from Smart Explorer.

## Features
- AI Quiz Generator (from photo or text prompt)
- Quiz library & multi-step math / social practice questions
- Rewards system for completing quizzes
- Starry night sky astronaut background

## Environment Configuration
To use the AI generation features with OpenAI:
Set your OpenAI API key in your environment or `.env.local`:
```
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
```
*(Note: Building and running the app does not require this key upfront; it is only read when generating quizzes dynamically via AI).*
