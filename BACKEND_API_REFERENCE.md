# Backend API Quick Reference

## 🎯 Import Statement

```typescript
import { BackendAPI } from '../../backend/api';
import type { QuestionData, BlankDetail } from '../../backend/types';
```

---

## 📚 Question Operations

### Get All Questions
```typescript
const questions: QuestionData[] = await BackendAPI.questions.getAll();
```

### Get Question by ID
```typescript
const question: QuestionData | null = await BackendAPI.questions.getById(1);
```

### Get Questions by Difficulty
```typescript
const easyQuestions = await BackendAPI.questions.getByDifficulty('easy');
const mediumQuestions = await BackendAPI.questions.getByDifficulty('medium');
const hardQuestions = await BackendAPI.questions.getByDifficulty('hard');
```

### Check Answer
```typescript
const isCorrect = BackendAPI.questions.checkAnswer(userAnswer, correctAnswer);
// Returns: boolean
```

### Calculate Score
```typescript
const score = BackendAPI.questions.calculateScore(correctCount, totalBlanks);
// Returns: number (percentage 0-100)
```

---

## 🎓 Quiz Operations

### Save User Progress
```typescript
const success = await BackendAPI.quiz.saveProgress(
  userId,           // string
  userEmail,        // string
  questionId,       // number
  'correct'         // 'correct' | 'wrong'
);
// Returns: Promise<boolean>
```

### Save Quiz Result
```typescript
const result = {
  questionId: 1,
  totalBlanks: 5,
  correctAnswers: 4,
  percentage: 80
};
const success = await BackendAPI.quiz.saveResult(userId, result);
// Returns: Promise<boolean>
```

### Save Quiz Attempt
```typescript
const answers = { 'blank1': 'answer1', 'blank2': 'answer2' };
const success = await BackendAPI.quiz.saveAttempt(
  userId,          // string
  questionId,      // number
  answers,         // Record<string, string>
  score,           // number
  totalPoints      // number
);
// Returns: Promise<boolean>
```

### Get User Stats
```typescript
const stats = await BackendAPI.quiz.getUserStats(userId);
// Returns: Promise<any>
```

### Get User Results
```typescript
const results = await BackendAPI.quiz.getUserResults(userId);
// Returns: Promise<any[]>
```

---

## 💾 Storage Operations

### Mark Question as Solved
```typescript
BackendAPI.storage.markSolved(userId, questionId);
// Returns: void
```

### Get Solved Questions
```typescript
const solved = BackendAPI.storage.getSolved(userId);
// Returns: { [questionId: number]: boolean }
```

### Check if Question is Solved
```typescript
const isSolved = BackendAPI.storage.isSolved(userId, questionId);
// Returns: boolean
```

### Clear Solved Questions
```typescript
BackendAPI.storage.clearSolved(userId);
// Returns: void
```

---

## 🗄️ Direct Database Access

### Supabase Client
```typescript
const { data, error } = await BackendAPI.supabase
  .from('table_name')
  .select('*')
  .eq('column', value);
```

### Database Config
```typescript
const isConfigured = BackendAPI.dbConfig.isConfigured;
const url = BackendAPI.dbConfig.url;
```

---

## 📝 Type Definitions

### QuestionData
```typescript
interface QuestionData {
  id: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  htmlContent: string;
  blanksCount: number;
  blanks: BlankDetail[];
}
```

### BlankDetail
```typescript
interface BlankDetail {
  id: string;
  correctAnswer: string;
  explanation?: string;
  hints?: string[];
}
```

### QuizResult
```typescript
interface QuizResult {
  questionId: number;
  totalBlanks: number;
  correctAnswers: number;
  percentage: number;
}
```

---

## 🔄 Common Patterns

### Loading Questions in Component
```typescript
const [questions, setQuestions] = useState<QuestionData[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadData = async () => {
    setLoading(true);
    const data = await BackendAPI.questions.getAll();
    setQuestions(data);
    setLoading(false);
  };
  loadData();
}, []);
```

### Submitting Quiz Answer
```typescript
const handleSubmit = async () => {
  const score = BackendAPI.questions.calculateScore(correctCount, totalBlanks);
  
  if (user?.id && user?.email) {
    await BackendAPI.quiz.saveProgress(
      user.id,
      user.email,
      questionId,
      score >= 80 ? 'correct' : 'wrong'
    );
  }
  
  if (score >= 80 && user?.id) {
    BackendAPI.storage.markSolved(user.id, questionId);
  }
};
```

### Error Handling
```typescript
try {
  const questions = await BackendAPI.questions.getAll();
  setQuestions(questions);
} catch (error) {
  console.error('Failed to load questions:', error);
  // Handle error
}
```

---

## ⚠️ Important Notes

1. **Always use BackendAPI** - Don't import services directly
2. **Type safety** - Import types from `backend/types`
3. **Error handling** - Backend methods log errors but don't throw
4. **Async operations** - Most methods return Promises
5. **User authentication** - Many operations require userId

---

## 🚫 Don'ts

❌ **Don't do this:**
```typescript
import QuestionService from '../../backend/services/QuestionService';
import { supabase } from '../../backend/config/database';
```

✅ **Do this instead:**
```typescript
import { BackendAPI } from '../../backend/api';
```

---

## 📖 Full Documentation

For complete documentation, see:
- `ARCHITECTURE.md` - Full architecture guide
- `MIGRATION_SUMMARY.md` - Migration details
- `README.md` - Project overview
