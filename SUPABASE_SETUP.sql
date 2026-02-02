-- ============================================
-- SUPABASE QUIZ DATABASE SETUP
-- Copy and paste this entire script into:
-- Supabase Dashboard → SQL Editor → New Query
-- Then click "Run"
-- ============================================

-- Step 1: Create questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id serial PRIMARY KEY,
  title text NOT NULL,
  description text,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  html_content text NOT NULL,
  blanks_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Create question_blanks table
CREATE TABLE IF NOT EXISTS public.question_blanks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id integer NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  blank_id text NOT NULL,
  correct_answer text NOT NULL,
  position integer NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Enable Row Level Security
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_blanks ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS Policies (Anyone can read)
CREATE POLICY "Anyone can view questions"
  ON public.questions
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view question blanks"
  ON public.question_blanks
  FOR SELECT
  USING (true);

-- Step 5: Create indexes
CREATE INDEX IF NOT EXISTS idx_question_blanks_question_id ON public.question_blanks(question_id);

-- ============================================
-- INSERT SAMPLE QUESTIONS (Easy - 4 questions)
-- ============================================

INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count) 
VALUES 
(1, 'Basic HTML Structure', 'Learn basic HTML tags like title, heading, and lists', 'easy', 
'<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <__BLANK_1__>My Web Page</__BLANK_1__>
</head>
<body>
  <h1>Welcome</h1>
</body>
</html>', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count) 
VALUES 
(2, 'Heading Elements', 'Practice using heading tags (h1-h6)', 'easy',
'<!DOCTYPE html>
<html>
<head>
  <title>Page Title</title>
</head>
<body>
  <__BLANK_1__>This is a heading</__BLANK_1__>
</body>
</html>', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count) 
VALUES 
(3, 'Paragraphs & Lists', 'Fill in paragraph and unordered list tags', 'easy',
'<!DOCTYPE html>
<html>
<body>
  <p>This is a __BLANK_1__ element</p>
  <__BLANK_2__>
    <li>Item 1</li>
    <li>Item 2</li>
  </__BLANK_2__>
</body>
</html>', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count) 
VALUES 
(4, 'Anchor Tags', 'Learn to use hyperlink anchor tags', 'easy',
'<!DOCTYPE html>
<html>
<head>
  <title>Links</title>
</head>
<body>
  <__BLANK_1__ href="https://example.com">Click here</__BLANK_1__>
</body>
</html>', 1)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- ============================================
-- INSERT SAMPLE QUESTIONS (Medium - 3 questions)
-- ============================================

INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count) 
VALUES 
(5, 'HTML Forms', 'Fill in form elements and input types', 'medium',
'<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <__BLANK_1__>User Registration</title>
</head>
<body>
  <form>
    <label>Name:</label>
    <input type="__BLANK_2__" name="username" />
    
    <label>Email:</label>
    <input type="__BLANK_3__" name="email" />
    
    <button type="__BLANK_4__">Submit</button>
  </form>
</body>
</html>', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count) 
VALUES 
(6, 'Images & Media', 'Practice image tags and attributes', 'medium',
'<!DOCTYPE html>
<html>
<head>
  <title>Images</title>
</head>
<body>
  <h1>Gallery</h1>
  <__BLANK_1__ src="image.jpg" alt="__BLANK_2__" />
  
  <div class="__BLANK_3__">
    <p>Image description</p>
  </div>
</body>
</html>', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count) 
VALUES 
(7, 'Tables', 'Master HTML table structure', 'medium',
'<!DOCTYPE html>
<html>
<head>
  <title>Table</title>
</head>
<body>
  <table>
    <__BLANK_1__>
      <tr>
        <th>Name</th>
        <th>Age</th>
      </tr>
    </__BLANK_1__>
    <tbody>
      <__BLANK_2__>
        <td>John</td>
        <td>25</td>
      </__BLANK_2__>
    </tbody>
  </table>
</body>
</html>', 2)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- ============================================
-- INSERT SAMPLE QUESTIONS (Hard - 3 questions)
-- ============================================

INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count) 
VALUES 
(8, 'Advanced Forms', 'Complex form validation and attributes', 'hard',
'<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Advanced Form</title>
</head>
<body>
  <form method="__BLANK_1__" action="/submit">
    <fieldset>
      <legend>Personal Info</legend>
      <label for="name">Name:</label>
      <input type="__BLANK_2__" id="name" name="name" __BLANK_3__/>
      
      <label for="email">Email:</label>
      <input type="__BLANK_4__" id="email" name="email" />
    </fieldset>
    
    <button type="__BLANK_5__">Submit</button>
  </form>
</body>
</html>', 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count) 
VALUES 
(9, 'Semantic HTML', 'Use semantic tags like header, nav, footer', 'hard',
'<!DOCTYPE html>
<html>
<head>
  <title>Semantic HTML</title>
</head>
<body>
  <__BLANK_1__>
    <nav>
      <__BLANK_2__>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
      </__BLANK_2__>
    </nav>
  </__BLANK_1__>
  
  <main>
    <article>
      <h2>Article Title</h2>
      <p>Content here</p>
    </article>
  </main>
  
  <__BLANK_3__>
    <p>&copy; 2024</p>
  </__BLANK_3__>
</body>
</html>', 3)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count) 
VALUES 
(10, 'Data Attributes', 'Work with data attributes and custom attributes', 'hard',
'<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Data Attributes</title>
</head>
<body>
  <div class="__BLANK_1__" data-toggle="__BLANK_2__" __BLANK_3__="modal-content">
    <h2>Modal Title</h2>
    <p>Modal content goes here</p>
    <button type="button" __BLANK_4__="modal">Close</button>
  </div>
  
  <__BLANK_5__ src="script.js"></__BLANK_5__>
</body>
</html>', 5)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- ============================================
-- INSERT BLANK ANSWERS
-- ============================================

-- Q1 Blanks
INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position) 
VALUES (1, 'BLANK_1', 'title', 1)
ON CONFLICT DO NOTHING;

-- Q2 Blanks
INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position) 
VALUES (2, 'BLANK_1', 'h1', 1)
ON CONFLICT DO NOTHING;

-- Q3 Blanks
INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position) 
VALUES 
(3, 'BLANK_1', 'paragraph', 1),
(3, 'BLANK_2', 'ul', 2)
ON CONFLICT DO NOTHING;

-- Q4 Blanks
INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position) 
VALUES (4, 'BLANK_1', 'a', 1)
ON CONFLICT DO NOTHING;

-- Q5 Blanks
INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position) 
VALUES 
(5, 'BLANK_1', 'title', 1),
(5, 'BLANK_2', 'text', 2),
(5, 'BLANK_3', 'email', 3),
(5, 'BLANK_4', 'submit', 4)
ON CONFLICT DO NOTHING;

-- Q6 Blanks
INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position) 
VALUES 
(6, 'BLANK_1', 'img', 1),
(6, 'BLANK_2', 'photo', 2),
(6, 'BLANK_3', 'container', 3)
ON CONFLICT DO NOTHING;

-- Q7 Blanks
INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position) 
VALUES 
(7, 'BLANK_1', 'thead', 1),
(7, 'BLANK_2', 'tr', 2)
ON CONFLICT DO NOTHING;

-- Q8 Blanks
INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position) 
VALUES 
(8, 'BLANK_1', 'post', 1),
(8, 'BLANK_2', 'text', 2),
(8, 'BLANK_3', 'required', 3),
(8, 'BLANK_4', 'email', 4),
(8, 'BLANK_5', 'submit', 5)
ON CONFLICT DO NOTHING;

-- Q9 Blanks
INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position) 
VALUES 
(9, 'BLANK_1', 'header', 1),
(9, 'BLANK_2', 'ul', 2),
(9, 'BLANK_3', 'footer', 3)
ON CONFLICT DO NOTHING;

-- Q10 Blanks
INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position) 
VALUES 
(10, 'BLANK_1', 'modal', 1),
(10, 'BLANK_2', 'modal', 2),
(10, 'BLANK_3', 'data-target', 3),
(10, 'BLANK_4', 'data-dismiss', 4),
(10, 'BLANK_5', 'script', 5)
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if tables exist
SELECT COUNT(*) as total_questions FROM public.questions;
SELECT COUNT(*) as total_blanks FROM public.question_blanks;

-- List all questions
SELECT id, title, difficulty, blanks_count FROM public.questions ORDER BY id;
