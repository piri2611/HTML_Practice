# Quiz Practice Website

A modern, interactive quiz practice platform built with **React** and **TypeScript**. Features user authentication and HTML fill-in-the-blanks quizzes with real-time feedback.

## 🚀 Live Features

- **User Authentication**: Sign up and login with email/password
- **Interactive Quizzes**: Fill-in-the-blanks questions with HTML code
- **30-Minute Timer**: Countdown timer for quiz sessions with auto-submit
- **Real-time Feedback**: Instant validation of answers with correct answers shown
- **Responsive Design**: Works seamlessly on desktop and tablet devices
- **Score Tracking**: View scores and detailed answer feedback

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Single CSS File** - Unified styling (src/styles.css)

## 📁 Project Structure

```
quiz/
├── src/
│   ├── components/
│   │   ├── Auth.tsx          # Login/Signup component
│   │   └── Quiz.tsx          # Quiz interface
│   ├── context/
│   │   └── AuthContext.tsx   # Authentication context & hooks
│   ├── styles.css            # Single unified CSS file
│   ├── App.tsx               # Main app component
│   └── main.tsx              # React entry point
├── index.html                # HTML template
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript config
├── package.json              # Dependencies
└── README.md                 # This file
```

## 📦 Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:3000/`

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🎯 How to Use

### Sign Up
1. Click **"Sign Up"** on the login page
2. Enter your name, email, and password
3. Click **"Create Account"**
4. You're automatically logged in!

### Login
1. Enter your registered email and password
2. Click **"Login"**

### Taking a Quiz
1. **View HTML Code** - Left side shows the HTML with blanks marked as `_____`
2. **Fill Blanks** - Right side has input fields for each blank
3. **Check Answers** - Click "Check" to validate without submitting
4. **Submit** - Click "Submit" to finalize and see your score
5. **Next Question** - Progress to the next quiz or restart

## 📝 Sample Questions Included

### Question 1: HTML Document Structure
- Fill in: `<title>`, `<ul>`, `</html>`, `html`

### Question 2: HTML Forms
- Fill in: `meta`, `input`, `email`, `password`, `submit`

## 🎨 Styling

All styles are in a **single CSS file** (`src/styles.css`) organized into sections:
- Global styles
- Auth page styles
- Quiz page styles
- Responsive media queries

### Color Scheme
- **Primary**: Purple gradient (#667eea → #764ba2)
- **Success**: Green (#4caf50)
- **Error**: Red (#d32f2f)
- **Info**: Blue (#2196f3)

## 🔐 Authentication System

- Simple email/password authentication
- Form validation
- User session management via React Context
- Stored in-memory (for demo purposes)

## ⏱️ Timer Feature

- 30-minute countdown
- Auto-submits when time runs out
- Visual red alert display
- Persistent during entire quiz session

## 🎓 Adding More Questions

Edit `src/components/Quiz.tsx` and add to the `SAMPLE_QUESTIONS` array:

```typescript
{
  id: 3,
  htmlContent: `<!DOCTYPE html>
<html>
<head>
  <__BLANK_1__>...</__BLANK_1__>
</head>
<body>
  __BLANK_2__
</body>
</html>`,
  blanks: [
    { id: 'BLANK_1', correctAnswer: 'title' },
    { id: 'BLANK_2', correctAnswer: '<h1>Hello</h1>' }
  ]
}
```

## 📱 Responsive Breakpoints

- **Desktop**: Grid layout (2 columns)
- **Tablet**: Single column layout (1024px and below)
- **Mobile**: Optimized spacing and button sizes (768px and below)

## 🎯 Key Components

### Auth Component (`Auth.tsx`)
- Login form
- Sign up form
- Form validation
- Toggle between login/signup modes

### Quiz Component (`Quiz.tsx`)
- HTML code display
- Fill-in-the-blanks interface
- Timer management
- Answer validation
- Score calculation

### AuthContext (`AuthContext.tsx`)
- User state management
- Login/signup logic
- Logout functionality
- useAuth hook for easy access

## 🚀 Performance

- Vite for fast development and production builds
- Optimized React components
- Minimal bundle size
- CSS-in-file (no external libraries)

## 📋 Features Demo

**Login Page**
```
┌─────────────────────────┐
│       Login              │
│  Email: [__________]   │
│  Pass:  [__________]   │
│  [  Login  ]            │
│  Sign Up                │
└─────────────────────────┘
```

**Quiz Page**
```
┌─────────────────────────────────────────┐
│ Quiz | Time: 29:30 | User | Logout     │
├──────────────────┬──────────────────────┤
│  HTML Preview    │  Fill in Blanks      │
│                  │  BLANK_1: [______]  │
│  <__BLANK_1__>   │  BLANK_2: [______]  │
│  ...             │                      │
│                  │  [Check] [Submit]    │
└──────────────────┴──────────────────────┘
```

## 🔄 State Management

Uses React Context API for:
- User authentication state
- Current question tracking
- User answers
- Quiz score
- Timer state

## 💡 Tips

- Answers are case-insensitive
- Whitespace is trimmed automatically
- Refresh page to restart (clears session)
- All data is local (no backend required for demo)

## 📄 License

MIT License - Feel free to use this project for educational purposes

---

Built with ❤️ using React + TypeScript
