/**
 * HTML Syntax Highlighter Utility
 * Provides syntax highlighting for HTML code snippets
 */

/**
 * Main function to highlight HTML code
 */
export const highlightHTML = (code: string): string => {
  let highlighted = code;

  // Escape HTML entities
  highlighted = highlighted
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  // Re-escape the code markers
  highlighted = highlighted
    .replace(/&lt;/g, '<span class="html-tag">&lt;</span>')
    .replace(/&gt;/g, '<span class="html-tag">&gt;</span>');

  // Highlight DOCTYPE
  highlighted = highlighted.replace(
    /&lt;!DOCTYPE\s+(\w+)&gt;/gi,
    '<span class="html-doctype">&lt;!DOCTYPE <span class="html-attr">$1</span>&gt;</span>'
  );

  // Highlight comments
  highlighted = highlighted.replace(
    /&lt;!--([\s\S]*?)--&gt;/g,
    '<span class="html-comment">&lt;!--$1--&gt;</span>'
  );

  // Highlight tag names
  highlighted = highlighted.replace(
    /&lt;(\/?)([\w-]+)([^&]*?)&gt;/g,
    (match, slash, tagName, attrs) => {
      const highlightedAttrs = highlightAttributes(attrs);
      return `<span class="html-tag">&lt;${slash}<span class="html-tagname">${tagName}</span>${highlightedAttrs}&gt;</span>`;
    }
  );

  return highlighted;
};

/**
 * Helper function to highlight HTML attributes
 */
const highlightAttributes = (attrs: string): string => {
  if (!attrs) return '';

  return attrs.replace(
    /\s+([\w-]+)(?:=(&quot;[^&]*?&quot;|&#39;[^&#]*?&#39;))?/g,
    (match, attrName, attrValue) => {
      if (attrValue) {
        return ` <span class="html-attr-name">${attrName}</span>=<span class="html-attr-value">${attrValue}</span>`;
      }
      return ` <span class="html-attr-name">${attrName}</span>`;
    }
  );
};
