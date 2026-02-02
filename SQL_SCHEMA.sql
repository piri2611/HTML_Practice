-- ============================================
-- QUIZ APP DATABASE SCHEMA FOR SUPABASE
-- ============================================
-- Note: Supabase automatically creates and manages auth.users table
-- This SQL creates the related tables for user profiles and quiz data
-- Complete schema with email/password authentication and profile auto-creation

-- ============================================
-- 1. USER PROGRESS TABLE (Track which questions user completed)
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_email text NOT NULL,
  question_1_status text DEFAULT NULL,
  question_2_status text DEFAULT NULL,
  question_3_status text DEFAULT NULL,
  question_4_status text DEFAULT NULL,
  question_5_status text DEFAULT NULL,
  question_6_status text DEFAULT NULL,
  question_7_status text DEFAULT NULL,
  question_8_status text DEFAULT NULL,
  question_9_status text DEFAULT NULL,
  question_10_status text DEFAULT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Enable Row Level Security on user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own progress
CREATE POLICY "Users can view their own progress"
  ON public.user_progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can update their own progress
CREATE POLICY "Users can update their own progress"
  ON public.user_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own progress
CREATE POLICY "Users can insert their own progress"
  ON public.user_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_email ON public.user_progress(user_email);

-- ============================================
-- 5. QUESTIONS TABLE (Store quiz questions)
-- ============================================
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

-- Enable Row Level Security on questions (read-only for users)
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view questions
CREATE POLICY "Anyone can view questions"
  ON public.questions
  FOR SELECT
  USING (true);

-- ============================================
-- 6. QUESTION BLANKS TABLE (Store blank details)
-- ============================================
CREATE TABLE IF NOT EXISTS public.question_blanks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id integer NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
  blank_id text NOT NULL,
  correct_answer text NOT NULL,
  position integer NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security on question_blanks (read-only for users)
ALTER TABLE public.question_blanks ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view question blanks
CREATE POLICY "Anyone can view question blanks"
  ON public.question_blanks
  FOR SELECT
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_question_blanks_question_id ON public.question_blanks(question_id);

-- ============================================
-- SAMPLE DATA - INSERT QUESTIONS
-- ============================================
-- Easy Level (1-4)
INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  1,
  'Basic HTML Structure',
  'Learn basic HTML tags like title, heading, and lists',
  'easy',
  '<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <__BLANK_1__>My Web Page</__BLANK_1__>
</head>
<body>
  <h1>Welcome</h1>
</body>
</html>',
  1
) ON CONFLICT DO NOTHING;

INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  2,
  'Heading Elements',
  'Practice using heading tags (h1-h6)',
  'easy',
  '<!DOCTYPE html>
<html>
<head>
  <title>Page Title</title>
</head>
<body>
  <__BLANK_1__>This is a heading</__BLANK_1__>
</body>
</html>',
  1
) ON CONFLICT DO NOTHING;

INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  3,
  'Paragraphs & Lists',
  'Fill in paragraph and unordered list tags',
  'easy',
  '<!DOCTYPE html>
<html>
<body>
  <p>This is a __BLANK_1__ element</p>
  <__BLANK_2__>
    <li>Item 1</li>
    <li>Item 2</li>
  </__BLANK_2__>
</body>
</html>',
  2
) ON CONFLICT DO NOTHING;

INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  4,
  'Anchor Tags',
  'Learn to use hyperlink anchor tags',
  'easy',
  '<!DOCTYPE html>
<html>
<head>
  <title>Links</title>
</head>
<body>
  <__BLANK_1__ href="https://example.com">Click here</__BLANK_1__>
</body>
</html>',
  1
) ON CONFLICT DO NOTHING;

-- Medium Level (5-7)
INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  5,
  'HTML Forms',
  'Fill in form elements and input types',
  'medium',
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
</html>',
  4
) ON CONFLICT DO NOTHING;

INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  6,
  'Images & Media',
  'Practice image tags and attributes',
  'medium',
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
</html>',
  3
) ON CONFLICT DO NOTHING;

INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  7,
  'Tables',
  'Master HTML table structure',
  'medium',
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
</html>',
  2
) ON CONFLICT DO NOTHING;

-- Hard Level (8-10)
INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  8,
  'Advanced Forms',
  'Complex form validation and attributes',
  'hard',
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
</html>',
  5
) ON CONFLICT DO NOTHING;

INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  9,
  'Semantic HTML',
  'Use semantic tags like header, nav, footer',
  'hard',
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
</html>',
  3
) ON CONFLICT DO NOTHING;

INSERT INTO public.questions (id, title, description, difficulty, html_content, blanks_count)
VALUES (
  10,
  'Data Attributes',
  'Work with data attributes and custom attributes',
  'hard',
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
</html>',
  5
) ON CONFLICT DO NOTHING;

-- ============================================
-- INSERT BLANK ANSWERS
-- ============================================
-- Q1 Blanks
INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position) 
VALUES (1, 'BLANK_1', 'title', 1) ON CONFLICT DO NOTHING;

-- Q2 Blanks
INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position) 
VALUES (2, 'BLANK_1', 'h1', 1) ON CONFLICT DO NOTHING;

-- Q3 Blanks
INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position) 
VALUES (3, 'BLANK_1', 'paragraph', 1),
       (3, 'BLANK_2', 'ul', 2) ON CONFLICT DO NOTHING;

-- Q4 Blanks
INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position) 
VALUES (4, 'BLANK_1', 'a', 1) ON CONFLICT DO NOTHING;

-- Q5 Blanks
INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position) 
VALUES (5, 'BLANK_1', 'title', 1),
       (5, 'BLANK_2', 'text', 2),
       (5, 'BLANK_3', 'email', 3),
       (5, 'BLANK_4', 'submit', 4) ON CONFLICT DO NOTHING;

-- Q6 Blanks
INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position) 
VALUES (6, 'BLANK_1', 'img', 1),
       (6, 'BLANK_2', 'photo', 2),
       (6, 'BLANK_3', 'container', 3) ON CONFLICT DO NOTHING;

-- Q7 Blanks
INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position) 
VALUES (7, 'BLANK_1', 'thead', 1),
       (7, 'BLANK_2', 'tr', 2) ON CONFLICT DO NOTHING;

-- Q8 Blanks
INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position) 
VALUES (8, 'BLANK_1', 'post', 1),
       (8, 'BLANK_2', 'text', 2),
       (8, 'BLANK_3', 'required', 3),
       (8, 'BLANK_4', 'email', 4),
       (8, 'BLANK_5', 'submit', 5) ON CONFLICT DO NOTHING;

-- Q9 Blanks
INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position) 
VALUES (9, 'BLANK_1', 'header', 1),
       (9, 'BLANK_2', 'ul', 2),
       (9, 'BLANK_3', 'footer', 3) ON CONFLICT DO NOTHING;

-- Q10 Blanks
INSERT INTO public.question_blanks (question_id, blank_id, correct_answer, position) 
VALUES (10, 'BLANK_1', 'modal', 1),
       (10, 'BLANK_2', 'modal', 2),
       (10, 'BLANK_3', 'data-target', 3),
       (10, 'BLANK_4', 'data-dismiss', 4),
       (10, 'BLANK_5', 'script', 5) ON CONFLICT DO NOTHING;
-- 
-- 1. USER SIGNS UP WITH EMAIL & PASSWORD:
--    - Call: supabase.auth.signUp({ email, password, options: { data: { full_name } } })
--    - Supabase automatically:
--      a) Creates entry in auth.users table
--      b) Hashes password securely
--      c) Stores full_name in user_metadata
--      d) Trigger automatically creates progress record in user_progress table
--
-- 2. USER SIGNS IN WITH EMAIL & PASSWORD:
--    - Call: supabase.auth.signInWithPassword({ email, password })
--    - Returns user data
--
-- 3. GET USER PROGRESS (After answering a question):
--    - Call: supabase.from('user_progress').select().eq('user_id', userId).single()
--    - Returns all 10 question statuses: correct/wrong/null
--
-- 4. UPDATE USER PROGRESS (After submitting quiz):
--    - Call: supabase.from('user_progress').upsert({
--        user_id: userId,
--        user_email: email,
--        question_X_status: 'correct' or 'wrong'
--      })
--    - Updates the status for the completed question
--
-- 5. USER LOGOUT:
--    - Call: supabase.auth.signOut()
--    - Clears session
--
-- STATUS VALUES:
-- - 'correct': User answered the question correctly
-- - 'wrong': User answered the question incorrectly  
-- - NULL: User has not attempted the question
--
-- ============================================

-- ============================================
-- INDEXES (For Performance)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_email ON public.user_progress(user_email);

-- ============================================
-- FUNCTIONS (Optional - Advanced)
-- ============================================

-- Function to handle user progress creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_progress (user_id, user_email)
  VALUES (
    new.id,
    new.email
  );
  RETURN new;
END;
$$;

-- Trigger to automatically create progress record when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

-- ============================================
-- END OF SCHEMA
-- ============================================
