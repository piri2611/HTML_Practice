/**
 * Frontend entry point - exports all components and utilities
 */

// Components
export { Auth } from './components/Auth';
export { Dashboard } from './components/Dashboard';
export { Quiz } from './components/Quiz';
export { StudyArea } from './components/StudyArea';
export { ProgressDashboard } from './components/ProgressDashboard';
export { HTMLTagsReference } from './components/HTMLTagsReference';

// Context
export { AuthProvider, useAuth } from './context/AuthContext';

// Utils
export { highlightHTML } from './utils/syntaxHighlight';
export { HTML_TAGS_REFERENCE } from './utils/htmlTagsReference';
