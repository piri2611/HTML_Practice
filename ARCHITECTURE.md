# Modular Architecture Documentation

## Overview

This application follows a **modular separation** between **frontend** and **backend** layers, promoting clean code organization, maintainability, and scalability.

---

## Directory Structure

```
quiz/
├── src/
│   ├── backend/                    # Backend Layer (Data & Business Logic)
│   │   ├── api/
│   │   │   └── index.ts           # Main API export - single entry point
│   │   ├── config/
│   │   │   └── database.ts        # Database configuration (Supabase)
│   │   ├── services/
│   │   │   ├── QuestionService.ts # Question operations
│   │   │   ├── QuizService.ts     # Quiz & progress operations
│   │   │   └── StorageService.ts  # Local storage operations
│   │   └── types/
│   │       └── index.ts           # Shared type definitions
│   │
│   ├── frontend/                   # Frontend Layer (UI & Presentation)
│   │   ├── components/
│   │   │   ├── Auth.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Quiz.tsx
│   │   │   ├── StudyArea.tsx
│   │   │   ├── ProgressDashboard.tsx
│   │   │   └── HTMLTagsReference.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx    # Authentication state management
│   │   ├── hooks/                 # Custom React hooks (future)
│   │   ├── utils/
│   │   │   ├── syntaxHighlight.ts # HTML syntax highlighting
│   │   │   └── htmlTagsReference.ts
│   │   └── index.ts               # Frontend exports
│   │
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # Application entry point
│   └── styles.css                  # Global styles
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Backend Layer

### Purpose
The backend layer handles all data operations, business logic, and external service interactions.

### Key Components

#### 1. **API Layer** (`backend/api/index.ts`)
The single entry point for all backend operations. Frontend components import only from here.

```typescript
import { BackendAPI } from '@/backend/api';

// Usage examples:
const questions = await BackendAPI.questions.getAll();
const question = await BackendAPI.questions.getById(1);
await BackendAPI.quiz.saveProgress(userId, email, questionId, 'correct');
```

**Available APIs:**
- `BackendAPI.questions.*` - Question operations
- `BackendAPI.quiz.*` - Quiz and progress operations
- `BackendAPI.storage.*` - Local storage operations
- `BackendAPI.supabase` - Direct Supabase client access
- `BackendAPI.dbConfig` - Database configuration

#### 2. **Services** (`backend/services/`)

##### QuestionService
Handles all question-related database operations:
- `getAllQuestions()` - Fetch all questions
- `getQuestionById(id)` - Fetch single question
- `getQuestionsByDifficulty(difficulty)` - Filter by difficulty
- `checkAnswer(userAnswer, correctAnswer)` - Validate answers
- `calculateScore(correctCount, totalBlanks)` - Score calculation

##### QuizService
Manages quiz attempts and user progress:
- `saveUserProgress(userId, email, questionId, status)` - Save progress
- `saveQuizResult(userId, result)` - Save quiz results
- `saveQuizAttempt(userId, questionId, answers, score, totalPoints)` - Save attempt
- `getUserStats(userId)` - Get user statistics
- `getUserResults(userId)` - Get quiz history

##### StorageService
Handles local storage operations:
- `markQuestionSolved(userId, questionId)` - Mark as solved
- `getSolvedQuestions(userId)` - Get solved questions
- `clearSolvedQuestions(userId)` - Clear solved data
- `isQuestionSolved(userId, questionId)` - Check if solved

#### 3. **Configuration** (`backend/config/`)
- `database.ts` - Supabase client initialization and config

#### 4. **Types** (`backend/types/`)
Shared TypeScript interfaces:
- `QuestionData`
- `BlankDetail`
- `QuizResult`
- `QuizAttempt`
- `UserStats`
- `UserProgress`

---

## Frontend Layer

### Purpose
The frontend layer handles UI rendering, user interactions, and state management.

### Key Components

#### 1. **Components** (`frontend/components/`)
React components for UI:
- `Auth.tsx` - Authentication (login/signup)
- `Dashboard.tsx` - User dashboard
- `Quiz.tsx` - Quiz interface
- `StudyArea.tsx` - Study materials
- `ProgressDashboard.tsx` - Progress tracking
- `HTMLTagsReference.tsx` - HTML reference guide

#### 2. **Context** (`frontend/context/`)
- `AuthContext.tsx` - Global authentication state

#### 3. **Utils** (`frontend/utils/`)
- `syntaxHighlight.ts` - HTML syntax highlighting
- `htmlTagsReference.ts` - HTML tags reference data

---

## How to Use

### Frontend Components Using Backend API

```typescript
// In any frontend component
import { BackendAPI } from '../../backend/api';
import type { QuestionData } from '../../backend/types';

const MyComponent = () => {
  const [questions, setQuestions] = useState<QuestionData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await BackendAPI.questions.getAll();
      setQuestions(data);
    };
    loadData();
  }, []);

  return <div>...</div>;
};
```

### Adding New Backend Services

1. Create service file in `backend/services/`:
```typescript
// backend/services/MyNewService.ts
class MyNewService {
  async myMethod() {
    // Implementation
  }
}

export default new MyNewService();
```

2. Export from API layer:
```typescript
// backend/api/index.ts
import MyNewService from '../services/MyNewService';

export const BackendAPI = {
  // ... existing
  myNew: {
    doSomething: () => MyNewService.myMethod(),
  },
};
```

---

## Benefits of This Architecture

### 1. **Separation of Concerns**
- Frontend focuses on UI/UX
- Backend handles data and business logic

### 2. **Maintainability**
- Changes to data layer don't affect UI
- Easy to locate and fix bugs

### 3. **Testability**
- Services can be tested independently
- Mock backend for frontend testing

### 4. **Scalability**
- Easy to add new features
- Can replace backend (e.g., switch from Supabase to REST API)

### 5. **Reusability**
- Backend services can be reused across components
- Shared types ensure consistency

### 6. **Type Safety**
- Centralized type definitions
- Better IDE autocomplete and error detection

---

## Migration Notes

### Old Structure → New Structure

| Old Import | New Import |
|------------|------------|
| `import { supabase } from './lib/supabase'` | `import { BackendAPI } from '../../backend/api'` |
| `import { getAllQuestions } from './lib/questionService'` | `const questions = await BackendAPI.questions.getAll()` |
| `import { saveUserProgress } from './lib/quizService'` | `await BackendAPI.quiz.saveProgress(...)` |
| `import { markQuestionSolved } from './lib/solvedQuestions'` | `BackendAPI.storage.markSolved(...)` |

---

## Development Workflow

1. **Backend Development**
   - Add/modify services in `backend/services/`
   - Export through `backend/api/index.ts`
   - Define types in `backend/types/`

2. **Frontend Development**
   - Create components in `frontend/components/`
   - Use `BackendAPI` for data operations
   - Manage state with React hooks and context

3. **Testing**
   ```bash
   npm run dev    # Start development server
   npm run build  # Build for production
   ```

---

## Future Enhancements

- [ ] Add custom hooks in `frontend/hooks/`
- [ ] Implement error boundary components
- [ ] Add middleware for API calls (logging, caching)
- [ ] Create backend validators for data integrity
- [ ] Add unit tests for services
- [ ] Implement API response caching
- [ ] Add request/response interceptors

---

## Best Practices

1. **Always use BackendAPI** - Never import services directly in frontend
2. **Type everything** - Use TypeScript types from `backend/types`
3. **Keep services focused** - Each service should have a single responsibility
4. **Error handling** - Always handle errors in service methods
5. **Async/await** - Use modern async patterns consistently
6. **Logging** - Add meaningful console logs for debugging

---

## Support

For questions or issues, refer to the main README.md or create an issue in the repository.
