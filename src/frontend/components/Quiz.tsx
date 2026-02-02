import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BackendAPI } from '../../backend/api';
import type { QuestionData } from '../../backend/types';

interface Blank {
  id: string;
  correctAnswer: string;
  explanation?: string;
}

interface QuizQuestion {
  id: number;
  htmlContent: string;
  blanks: Blank[];
  difficulty: 'easy' | 'medium' | 'hard';
}



interface QuizProps {
  questionId: number;
  onBack: () => void;
}

/**
 * Get default explanation for common HTML tags
 */
const getDefaultExplanation = (blankId: string, answer: string): string => {
  const explanations: { [key: string]: string } = {
    'html': 'The <html> tag is the root element that wraps all other elements on the page. It tells the browser that this is an HTML document.',
    'head': 'The <head> tag contains metadata about the document, such as the title, character encoding, and links to stylesheets.',
    'body': 'The <body> tag contains all the visible content of the webpage that users see in the browser.',
    'title': 'The <title> tag specifies the title that appears in the browser tab and is used for SEO.',
    'DOCTYPE': 'The <!DOCTYPE html> declaration tells the browser this is an HTML5 document and should be the first line in your HTML file.',
    'h1': 'The <h1> tag is used for main headings. There should typically be only one <h1> per page.',
    'h2': 'The <h2> tag is used for subheadings and helps organize content hierarchically.',
    'p': 'The <p> tag defines a paragraph of text. It automatically adds spacing above and below the text.',
    'a': 'The <a> tag creates a hyperlink. The href attribute specifies the URL to link to.',
    'img': 'The <img> tag embeds an image. The src attribute specifies the image file path.',
    'div': 'The <div> tag is a generic container used to group elements and apply styling with CSS.',
    'span': 'The <span> tag is an inline container used to apply styling to a portion of text.',
    'ul': 'The <ul> tag creates an unordered (bulleted) list.',
    'ol': 'The <ol> tag creates an ordered (numbered) list.',
    'li': 'The <li> tag defines a list item within <ul> or <ol> tags.',
    'form': 'The <form> tag creates a form for user input. The action attribute specifies where to send the form data.',
    'input': 'The <input> tag creates an interactive field where users can enter data.',
    'button': 'The <button> tag creates a clickable button that can submit forms or trigger actions.',
    'textarea': 'The <textarea> tag creates a multi-line text input field.',
    'label': 'The <label> tag associates text with form inputs, improving accessibility.',
    'table': 'The <table> tag creates a table for organizing data in rows and columns.',
    'tr': 'The <tr> tag defines a table row.',
    'td': 'The <td> tag defines a table data cell.',
    'th': 'The <th> tag defines a table header cell.',
    'header': 'The <header> tag represents the header section of a page or section.',
    'footer': 'The <footer> tag represents the footer section of a page or section.',
    'nav': 'The <nav> tag defines navigation links.',
    'article': 'The <article> tag represents self-contained content like a blog post.',
    'section': 'The <section> tag groups related content together.',
    'main': 'The <main> tag specifies the main content area of a document.',
    'strong': 'The <strong> tag indicates strong importance and displays text in bold. It\'s semantically meaningful.',
    'em': 'The <em> tag indicates emphasized text and displays it in italic. It\'s semantically meaningful.',
    'br': 'The <br> tag creates a line break. It\'s a self-closing tag.',
    'hr': 'The <hr> tag creates a horizontal line to separate content.',
    'meta': 'The <meta> tag provides metadata about the HTML document, like character encoding.',
    'link': 'The <link> tag links external resources like CSS stylesheets to the HTML document.',
    'script': 'The <script> tag embeds or references JavaScript code.',
    'style': 'The <style> tag contains CSS styling rules for the HTML document.',
  };

  return explanations[answer.toLowerCase()] || 
    `The <${answer}> tag is an important HTML element. Review the HTML reference to understand its purpose and proper usage.`;
};

/**
 * Get learning tips for beginners
 */
const getLearnignTip = (blankId: string, answer: string): string => {
  const tips: { [key: string]: string } = {
    'html': 'Every HTML document must start with <html> and end with </html>. Always use lowercase tag names.',
    'head': 'Never put visible content in the <head> - it\'s only for metadata. Put visible content in <body>.',
    'body': 'All content users see goes in the <body> tag. This is where you put headings, paragraphs, images, etc.',
    'title': 'The <title> appears in the browser tab, not on the page. It\'s important for SEO and accessibility.',
    'DOCTYPE': 'Always include <!DOCTYPE html> as the very first line. Without it, the page may not display correctly.',
    'h1': 'Use <h1> for your main page title only. Don\'t skip heading levels (don\'t jump from <h1> to <h3>).',
    'h2': 'Use <h2> for main sections. Proper heading hierarchy helps with accessibility and SEO.',
    'p': 'Use <p> for paragraphs of text. Don\'t use <br> to create multiple lines - that\'s what paragraphs are for.',
    'a': 'Always include the href attribute. href="#" links to nothing - use href="/" or a real URL.',
    'img': 'Always include an alt attribute describing the image. It helps accessibility and appears if the image fails to load.',
    'div': 'Use <div> for layout and grouping. For better structure, consider semantic tags like <section> or <article>.',
    'span': 'Use <span> for styling small inline portions of text, not for large content blocks.',
    'ul': 'Use <ul> for lists without order, like features or ingredients. Use <ol> for step-by-step instructions.',
    'ol': 'Use <ol> for ordered lists. The browser automatically numbers them.',
    'li': 'Every list item must be wrapped in <li> tags. <ul> and <ol> can only contain <li> elements.',
    'form': 'Every form needs a method attribute (GET or POST) and typically an action attribute.',
    'input': 'Always include a type attribute (text, email, password, etc.). Use a label with the for attribute for accessibility.',
    'button': 'If inside a form, the button will submit by default. Use type="button" to prevent submission.',
    'textarea': 'Use <textarea> instead of <input> for multi-line text. <textarea> rows and cols control size.',
    'label': 'Connect labels to inputs using the for attribute matching the input\'s id for better accessibility.',
    'table': 'Use tables for tabular data only, not for layout. Use CSS Grid or Flexbox for page layout.',
    'tr': 'Always nest <tr> in <thead>, <tbody>, or <tfoot> for better semantic structure.',
    'td': 'Use <td> for regular data cells and <th> for header cells. This improves accessibility.',
    'th': '<th> has special semantics for accessibility tools. Don\'t use <td> for headers.',
    'header': 'The <header> tag is semantic and doesn\'t automatically add styling. Use CSS to style it.',
    'footer': 'The <footer> is often used for copyright, links, and other bottom-of-page content.',
    'nav': 'Use <nav> only for major navigation sections. Not every link needs to be in a <nav>.',
    'article': 'Use <article> for self-contained content that makes sense on its own, like blog posts.',
    'section': 'Use <section> to group related content. Each <section> typically has a heading.',
    'main': 'There should be only one <main> element per page. It improves accessibility.',
    'strong': '<strong> and <b> look the same but <strong> is more semantic. Prefer <strong>.',
    'em': '<em> and <i> look the same but <em> is more semantic. Prefer <em>.',
    'br': 'Use <br> sparingly - usually for addresses or poems. Use <p> tags for regular text separation.',
    'hr': 'The <hr> tag represents a thematic break. Don\'t use it for decoration - use CSS borders instead.',
    'meta': 'The charset meta tag should come early in the <head>: <meta charset="UTF-8">',
    'link': 'Link CSS files in the <head> before closing </head> tag. Example: <link rel="stylesheet" href="style.css">',
    'script': 'It\'s often better to put <script> tags at the end of <body> for faster page load.',
    'style': 'While <style> works, it\'s better practice to use external CSS files for reusability.',
  };

  return tips[answer.toLowerCase()] || 
    'Pay attention to when and why you use this tag. Proper semantic HTML makes your code more accessible and maintainable.';
};

/**
 * Get progressive hints for a tag
 */
const getHintsForTag = (tagName: string): string[] => {
  const hints: { [key: string]: string[] } = {
    'html': [
      '💡 It\'s the root element',
      '💡 It\'s a container tag - you need an opening and closing tag',
      '💡 Every HTML document starts with <html>'
    ],
    'head': [
      '💡 It comes before the <body> tag',
      '💡 It\'s where metadata goes (not visible content)',
      '💡 It\'s required in HTML documents'
    ],
    'body': [
      '💡 This is where all visible content goes',
      '💡 It comes after the <head> tag',
      '💡 There\'s only one <body> per page'
    ],
    'DOCTYPE': [
      '💡 It\'s a declaration, not a tag',
      '💡 It tells the browser this is HTML5',
      '💡 It must be the very first line of your document'
    ],
    'h1': [
      '💡 It\'s a heading tag',
      '💡 It\'s the largest heading level',
      '💡 Use it for the main page title'
    ],
    'h2': [
      '💡 It\'s a heading tag, but smaller than h1',
      '💡 Use this for main sections',
      '💡 There can be multiple h2s on one page'
    ],
    'p': [
      '💡 It stands for "paragraph"',
      '💡 It\'s a block-level element (creates line breaks)',
      '💡 Use this for text content'
    ],
    'strong': [
      '💡 It emphasizes text as important',
      '💡 It displays in bold',
      '💡 It\'s semantic (unlike <b>)'
    ],
    'em': [
      '💡 It stands for "emphasis"',
      '💡 It displays in italic',
      '💡 It\'s semantic (unlike <i>)'
    ],
    'a': [
      '💡 It\'s for creating links',
      '💡 You need an href attribute',
      '💡 href stands for "hypertext reference"'
    ],
    'img': [
      '💡 It\'s for embedding images',
      '💡 It\'s a self-closing tag (no </img>)',
      '💡 You need src and alt attributes'
    ],
    'div': [
      '💡 It\'s a generic container',
      '💡 It\'s a block-level element',
      '💡 It\'s often used for layout and styling'
    ],
    'span': [
      '💡 It\'s a generic inline container',
      '💡 It doesn\'t create line breaks',
      '💡 Use it for styling small portions of text'
    ],
    'ul': [
      '💡 It stands for "unordered list"',
      '💡 It creates a bulleted list',
      '💡 It contains <li> elements'
    ],
    'ol': [
      '💡 It stands for "ordered list"',
      '💡 It creates a numbered list',
      '💡 It contains <li> elements'
    ],
    'li': [
      '💡 It stands for "list item"',
      '💡 It\'s used inside <ul> or <ol>',
      '💡 The browser automatically numbers them in <ol>'
    ],
    'form': [
      '💡 It\'s a container for form elements',
      '💡 It needs action and method attributes',
      '💡 It groups inputs together for submission'
    ],
    'input': [
      '💡 It\'s for user input',
      '💡 It\'s a self-closing tag',
      '💡 The type attribute changes what kind of input it is'
    ],
    'button': [
      '💡 It creates a clickable button',
      '💡 By default, it submits forms',
      '💡 Use type="button" to prevent submission'
    ],
    'table': [
      '💡 It\'s for displaying data in rows and columns',
      '💡 It contains <tr>, <td>, and <th> elements',
      '💡 Don\'t use it for layout - use CSS Grid instead'
    ],
    'header': [
      '💡 It\'s a semantic tag for header content',
      '💡 It doesn\'t style itself automatically',
      '💡 It improves accessibility and SEO'
    ],
    'footer': [
      '💡 It\'s a semantic tag for footer content',
      '💡 It\'s usually at the bottom of the page',
      '💡 It improves document structure'
    ],
    'nav': [
      '💡 It\'s for navigation links',
      '💡 It\'s semantic and improves accessibility',
      '💡 Use it only for major navigation'
    ],
    'article': [
      '💡 It\'s for self-contained content',
      '💡 It\'s semantic and improves SEO',
      '💡 Use it for blog posts, news articles, etc.'
    ],
    'section': [
      '💡 It groups related content together',
      '💡 It\'s semantic and improves structure',
      '💡 Each section typically has a heading'
    ],
  };

  return hints[tagName.toLowerCase()] || [
    '💡 Think about the purpose of this tag',
    '💡 Consider where it\'s typically used',
    '💡 Check the HTML reference for more info'
  ];
};

export const Quiz = ({ questionId, onBack }: QuizProps) => {
  const { user, logout } = useAuth();
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState(1800);
  const [submitted, setSubmitted] = useState(false);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAlreadyCompleted, setIsAlreadyCompleted] = useState(false);
  const [fullscreenCard, setFullscreenCard] = useState<'your' | 'expected' | null>(null);
  const [fromTaskPreview] = useState(() => sessionStorage.getItem('studyAreaFromTaskPreview') === 'true');
  const [expandedExplanations, setExpandedExplanations] = useState<Set<string>>(new Set());
  const [shownHints, setShownHints] = useState<{ [blankId: string]: number }>({});

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleExplanation = (blankId: string) => {
    setExpandedExplanations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(blankId)) {
        newSet.delete(blankId);
      } else {
        newSet.add(blankId);
      }
      return newSet;
    });
  };

  /**
   * Show next hint for a blank
   */
  const showNextHint = (blankId: string) => {
    setShownHints(prev => ({
      ...prev,
      [blankId]: (prev[blankId] || 0) + 1
    }));
  };

  const handleAnswerChange = (blankId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [blankId]: value
    }));
    // Reset checked state when user modifies an answer
    if (checked) {
      setChecked(false);
    }
  };

  const handleCheck = () => {
    setChecked(true);
  };

  const handleSubmit = async () => {
    if (!question) return;
    
    let correctCount = 0;
    question.blanks.forEach(blank => {
      const userAnswer = answers[blank.id]?.toLowerCase().trim();
      const correctAnswer = blank.correctAnswer.toLowerCase().trim();
      if (userAnswer === correctAnswer) {
        correctCount++;
      }
    });
    
    const percentage = Math.round((correctCount / question.blanks.length) * 100);
    const isCorrect = correctCount === question.blanks.length;
    
    setScore(percentage);
    setSubmitted(true);
    
    // Save to user_progress table
    if (user?.id && user?.email) {
      await BackendAPI.quiz.saveProgress(
        user.id,
        user.email,
        question.id,
        isCorrect ? 'correct' : 'wrong'
      );
      console.log('✓ Progress saved to user_progress table');
    }

    // Mark as solved if score >= 80%
    if (percentage >= 80 && user?.id) {
      BackendAPI.storage.markSolved(user.id, question.id);
    }
  };

  const handleTryAgain = async () => {
    if (!question || !user?.id) return;

    // Reset all states to start fresh
    setAnswers({});
    setSubmitted(false);
    setChecked(false);
    setScore(0);
    setIsAlreadyCompleted(false);
    setTimeRemaining(1800);

    // Reset question status to NULL in user_progress
    try {
      const { error } = await BackendAPI.supabase
        .from('user_progress')
        .update({
          [`question_${question.id}_status`]: null
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error resetting progress:', error.message);
      } else {
        console.log(`✓ Question ${question.id} reset to fresh state`);
      }
    } catch (error: any) {
      console.error('Error resetting progress:', error?.message);
    }
  };

  const generateHtmlOutput = (htmlContent: string, blankValues: Record<string, string> = {}): string => {
    let output = htmlContent;
    
    // Replace blanks with provided values or correct answers
    question?.blanks.forEach((blank) => {
      const regex = new RegExp(`__${blank.id}__`, 'g');
      const value = blankValues[blank.id] !== undefined ? blankValues[blank.id] : blank.correctAnswer;
      output = output.replace(regex, value);
    });
    
    return output;
  };

  // Load question from database
  useEffect(() => {
    const loadQuestion = async () => {
      setLoading(true);
      const questionData = await BackendAPI.questions.getById(questionId);
      setQuestion(questionData);
      
      // Check if question is already completed correctly
      if (user?.id && questionData) {
        const { data, error } = await BackendAPI.supabase
          .from('user_progress')
          .select()
          .eq('user_id', user.id)
          .single();

        if (!error && data) {
          const statusKey = `question_${questionId}_status` as keyof typeof data;
          const status = data[statusKey];
          
          if (status === 'correct') {
            // Pre-fill all blanks with correct answers
            const prefilledAnswers: { [key: string]: string } = {};
            questionData.blanks.forEach(blank => {
              prefilledAnswers[blank.id] = blank.correctAnswer;
            });
            setAnswers(prefilledAnswers);
            setIsAlreadyCompleted(true);
            setSubmitted(true);
            setScore(100);
            console.log('✓ Question already completed correctly');
          }
        }
      }
      
      setLoading(false);
      console.log('✓ Question loaded:', questionData?.title);
    };

    loadQuestion();
  }, [questionId, user?.id]);

  // Timer effect - must be before conditional returns
  useEffect(() => {
    if (loading || !question || submitted) {
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, question, submitted]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#667eea', marginBottom: '20px' }}>Loading question...</div>
          <div style={{ width: '40px', height: '40px', border: '4px solid #f0f0f0', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
        </div>
      </div>
    );
  }

  if (!question) {
    return <div style={{ padding: '20px', textAlign: 'center', color: '#d32f2f' }}>Question not found</div>;
  }

  const displayContent = question.htmlContent
    .replace(/__BLANK_\d+__/g, '<span class="blank-placeholder">_____</span>');

  return (
    <div className="quiz-container">
      <header className="quiz-header">
        <div className="header-left">
          <h1>Quiz Practice - Q{question.id}</h1>
        </div>
        <div className="header-center">
          <div className="timer">
            <span className="timer-label">Time Remaining:</span>
            <span className="timer-value">{formatTime(timeRemaining)}</span>
          </div>
        </div>
        <div className="header-right">
          <span className="user-info">Welcome, {user?.name}!</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="quiz-content">
        <div className="quiz-center">
          <div className="html-preview">
            <h2>HTML Preview</h2>
            <div className="code-display">
              <pre>{displayContent}</pre>
            </div>
            <button className="back-button" onClick={() => {
              sessionStorage.removeItem('studyAreaFromTaskPreview');
              onBack();
            }}>← Back to {fromTaskPreview ? 'Task Preview' : 'Questions'}</button>
          </div>

          <div className="blanks-section">
            <h2>Fill in the Blanks</h2>
            <div className="blanks-container">
              {question.blanks.map((blank, index) => {
                const userAnswer = answers[blank.id]?.toLowerCase().trim();
                const correctAnswer = blank.correctAnswer.toLowerCase().trim();
                const isCorrect = userAnswer === correctAnswer;
                const showFeedback = checked || submitted; // Show feedback on check or submit

                return (
                  <div key={blank.id} className="blank-input-group">
                    <div className="blank-label-row">
                      <label htmlFor={blank.id}>{blank.id} ({index + 1} pts)</label>
                      {!submitted && !isAlreadyCompleted && (
                        <button 
                          className="hint-btn"
                          onClick={() => showNextHint(blank.id)}
                          title="Get a hint"
                        >
                          💡 Hint
                        </button>
                      )}
                    </div>

                    {shownHints[blank.id] ? shownHints[blank.id] > 0 && (
                      <div className="hints-container">
                        {getHintsForTag(blank.correctAnswer).slice(0, shownHints[blank.id]).map((hint, hintIndex) => (
                          <div key={hintIndex} className="hint-item">
                            {hint}
                          </div>
                        ))}
                        {shownHints[blank.id] < getHintsForTag(blank.correctAnswer).length && (
                          <button 
                            className="hint-btn-small"
                            onClick={() => showNextHint(blank.id)}
                          >
                            Show More Hints
                          </button>
                        )}
                      </div>
                    ) : null}

                    <input
                      type="text"
                      id={blank.id}
                      value={answers[blank.id] || ''}
                      onChange={(e) => handleAnswerChange(blank.id, e.target.value)}
                      placeholder="Enter your answer"
                      disabled={submitted}
                      className={showFeedback && userAnswer ? (isCorrect ? 'correct' : 'incorrect') : ''}
                    />
                    {isAlreadyCompleted && (
                      <p className="success-answer">✓ Correct!</p>
                    )}
                    {showFeedback && !isAlreadyCompleted && isCorrect && (
                      <p className="success-answer">✓ Correct!</p>
                    )}
                    {showFeedback && !isAlreadyCompleted && !userAnswer && (
                      <p className="empty-answer">Required</p>
                    )}
                  </div>
                );
              })}
            </div>

            {checked && !submitted && (
              <>
                {fullscreenCard === 'your' && (
                  <div className="fullscreen-overlay">
                    <div className="fullscreen-card">
                      <button className="fullscreen-close" onClick={() => setFullscreenCard(null)}>✕ Close</button>
                      <div className="fullscreen-content">
                        <iframe
                          srcDoc={generateHtmlOutput(question.htmlContent, answers)}
                          title="Your Output"
                          style={{ width: '100%', height: '100%', border: 'none', borderRadius: '4px' }}
                          sandbox="allow-same-origin"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {fullscreenCard === 'expected' && (
                  <div className="fullscreen-overlay">
                    <div className="fullscreen-card">
                      <button className="fullscreen-close" onClick={() => setFullscreenCard(null)}>✕ Close</button>
                      <div className="fullscreen-content">
                        <iframe
                          srcDoc={generateHtmlOutput(question.htmlContent, {})}
                          title="Expected Output"
                          style={{ width: '100%', height: '100%', border: 'none', borderRadius: '4px' }}
                          sandbox="allow-same-origin"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {!fullscreenCard && (
                  <div className="output-comparison">
                    <div className="output-box">
                      <div className="output-header">
                        <h3>Your Output</h3>
                        <button className="fullscreen-btn" onClick={() => setFullscreenCard('your')} title="Fullscreen">⛶</button>
                      </div>
                      <div className="output-content">
                        <iframe
                          srcDoc={generateHtmlOutput(question.htmlContent, answers)}
                          title="Your Output"
                          style={{ width: '100%', height: '200px', border: 'none', borderRadius: '4px' }}
                          sandbox="allow-same-origin"
                        />
                      </div>
                    </div>
                    <div className="output-box">
                      <div className="output-header">
                        <h3>Expected Output</h3>
                        <button className="fullscreen-btn" onClick={() => setFullscreenCard('expected')} title="Fullscreen">⛶</button>
                      </div>
                      <div className="output-content">
                        <iframe
                          srcDoc={generateHtmlOutput(question.htmlContent, {})}
                          title="Expected Output"
                          style={{ width: '100%', height: '200px', border: 'none', borderRadius: '4px' }}
                          sandbox="allow-same-origin"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {submitted && (
              <div className="result-box">
                {/* Completion Status Banner */}
                {score === 100 ? (
                  <div className="completion-banner success">
                    <div className="banner-icon">🎉</div>
                    <div className="banner-content">
                      <h2>Perfect Score! Task Completed!</h2>
                      <p>Congratulations! You got all answers correct. Excellent work!</p>
                    </div>
                  </div>
                ) : score >= 80 ? (
                  <div className="completion-banner passed">
                    <div className="banner-icon">✅</div>
                    <div className="banner-content">
                      <h2>Task Completed Successfully!</h2>
                      <p>Great job! You passed with a good score. Review the explanations below to learn more.</p>
                    </div>
                  </div>
                ) : (
                  <div className="completion-banner failed">
                    <div className="banner-icon">📝</div>
                    <div className="banner-content">
                      <h2>Task Incomplete - Try Again</h2>
                      <p>You need at least 80% to complete this task. Review the explanations and try again!</p>
                    </div>
                  </div>
                )}

                <div className="result-header">
                  <h3>📊 Quiz Results</h3>
                  <div className="score-display">
                    <p>Correct Answers: <strong>{Math.round(score / 100 * question.blanks.length)} / {question.blanks.length}</strong></p>
                    <p>Score: <strong className={score === 100 ? 'perfect-score' : score >= 80 ? 'good-score' : 'needs-improvement'}>{Math.round(score)}%</strong></p>
                  </div>
                </div>

                <div className="explanation-panels">
                  <h4>📚 Detailed Explanations</h4>
                  {question.blanks.map((blank, index) => {
                    const userAnswer = answers[blank.id]?.toLowerCase().trim();
                    const correctAnswer = blank.correctAnswer.toLowerCase().trim();
                    const isCorrect = userAnswer === correctAnswer;
                    const isExpanded = expandedExplanations.has(blank.id);

                    return (
                      <div key={blank.id} className="explanation-panel">
                        <button
                          className={`explanation-header ${isCorrect ? 'correct' : 'incorrect'}`}
                          onClick={() => toggleExplanation(blank.id)}
                        >
                          <span className="explanation-toggle">
                            {isExpanded ? '▼' : '▶'}
                          </span>
                          <span className="explanation-title">
                            {isCorrect ? '✅' : '❌'} {blank.id} (Question {index + 1})
                          </span>
                          <span className="explanation-answer">
                            {isCorrect ? 'Correct!' : 'Incorrect'}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="explanation-content">
                            <div className="answer-comparison">
                              <div className="your-answer">
                                <strong>Your Answer:</strong>
                                <p className={isCorrect ? 'correct-text' : 'incorrect-text'}>
                                  "{userAnswer || '(blank)'}"
                                </p>
                              </div>
                              <div className="correct-answer">
                                <strong>Correct Answer:</strong>
                                <p className="correct-text">"{correctAnswer}"</p>
                              </div>
                            </div>

                            <div className="explanation-text">
                              <strong>Why:</strong>
                              <p>
                                {blank.explanation || getDefaultExplanation(blank.id, correctAnswer)}
                              </p>
                            </div>

                            <div className="learning-tip">
                              <strong>💡 Learning Tip:</strong>
                              <p>{getLearnignTip(blank.id, correctAnswer)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="result-actions">
                  {score >= 80 ? (
                    <>
                      <button className="next-question-btn" onClick={onBack}>
                        ✓ Task Finished - View All Questions
                      </button>
                      <button className="try-again-btn secondary" onClick={handleTryAgain}>
                        Practice Again
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="try-again-btn primary" onClick={handleTryAgain}>
                        🔄 Try Again to Complete Task
                      </button>
                      <button className="back-to-questions-btn" onClick={onBack}>
                        Back to Questions
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {!submitted && (
              <div className="button-group">
                <button className="check-btn" onClick={handleCheck} disabled={checked}>
                  {checked ? '✓ Checked' : 'Check'}
                </button>
                <button className="submit-btn" onClick={handleSubmit}>Submit</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
