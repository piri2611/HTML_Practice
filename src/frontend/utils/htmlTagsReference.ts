export interface HTMLTag {
  name: string;
  category: string;
  description: string;
  syntax: string;
  commonAttributes?: string[];
  example: string;
  notes?: string;
}

export const HTML_TAGS_REFERENCE: HTMLTag[] = [
  {
    name: 'html',
    category: 'Structure',
    description: 'Root element that wraps all HTML content',
    syntax: '<html>...</html>',
    commonAttributes: ['lang'],
    example: '<html lang="en">...</html>',
    notes: 'Required tag. Use lang attribute for language specification.'
  },
  {
    name: 'head',
    category: 'Structure',
    description: 'Contains metadata about the document',
    syntax: '<head>...</head>',
    example: '<head><title>Page Title</title></head>',
    notes: 'Contains meta tags, title, links to stylesheets, and scripts'
  },
  {
    name: 'body',
    category: 'Structure',
    description: 'Contains the visible page content',
    syntax: '<body>...</body>',
    example: '<body><h1>Welcome</h1></body>',
    notes: 'Only one body tag per document. All visible content goes here.'
  },
  {
    name: 'title',
    category: 'Metadata',
    description: 'Sets the title shown in browser tab',
    syntax: '<title>Page Title</title>',
    example: '<title>My Website</title>',
    notes: 'Required tag. Appears in browser tab and search results.'
  },
  {
    name: 'meta',
    category: 'Metadata',
    description: 'Provides metadata about the HTML document',
    syntax: '<meta name="..." content="...">',
    commonAttributes: ['charset', 'name', 'content', 'viewport'],
    example: '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width">',
    notes: 'Self-closing tag. Important for charset and viewport.'
  },
  {
    name: 'h1 to h6',
    category: 'Text',
    description: 'Heading tags (h1 largest, h6 smallest)',
    syntax: '<h1>...</h1> to <h6>...</h6>',
    example: '<h1>Main Heading</h1>\n<h2>Sub Heading</h2>',
    notes: 'Use one h1 per page. Improves SEO and accessibility.'
  },
  {
    name: 'p',
    category: 'Text',
    description: 'Defines a paragraph',
    syntax: '<p>...</p>',
    example: '<p>This is a paragraph of text.</p>',
    notes: 'Block-level element. Creates space above and below.'
  },
  {
    name: 'a',
    category: 'Links',
    description: 'Creates a hyperlink',
    syntax: '<a href="url">...</a>',
    commonAttributes: ['href', 'target', 'rel', 'title'],
    example: '<a href="https://example.com" target="_blank">Click Here</a>',
    notes: 'Use target="_blank" to open in new tab. Add rel="noopener" for security.'
  },
  {
    name: 'img',
    category: 'Media',
    description: 'Embeds an image',
    syntax: '<img src="..." alt="...">',
    commonAttributes: ['src', 'alt', 'width', 'height'],
    example: '<img src="photo.jpg" alt="A beautiful photo">',
    notes: 'Self-closing tag. Always include alt text for accessibility.'
  },
  {
    name: 'div',
    category: 'Structure',
    description: 'Generic container for grouping content',
    syntax: '<div>...</div>',
    commonAttributes: ['class', 'id'],
    example: '<div class="container">...</div>',
    notes: 'Block-level element. Most commonly used container.'
  },
  {
    name: 'span',
    category: 'Text',
    description: 'Inline container for text',
    syntax: '<span>...</span>',
    commonAttributes: ['class', 'id'],
    example: '<p>This is <span class="highlight">important</span> text.</p>',
    notes: 'Inline element. Does not create new lines.'
  },
  {
    name: 'strong',
    category: 'Text Formatting',
    description: 'Marks text with strong importance',
    syntax: '<strong>...</strong>',
    example: '<p>This is <strong>very important</strong>.</p>',
    notes: 'Semantic tag. Indicates importance. Bold by default.'
  },
  {
    name: 'em',
    category: 'Text Formatting',
    description: 'Marks text with emphasis',
    syntax: '<em>...</em>',
    example: '<p>This is <em>emphasized</em> text.</p>',
    notes: 'Semantic tag. Indicates emphasis. Italic by default.'
  },
  {
    name: 'br',
    category: 'Text',
    description: 'Inserts a line break',
    syntax: '<br>',
    example: 'Line 1<br>Line 2',
    notes: 'Self-closing tag. Use for line breaks, not for spacing.'
  },
  {
    name: 'hr',
    category: 'Structure',
    description: 'Creates a horizontal rule (line)',
    syntax: '<hr>',
    example: '<hr>',
    notes: 'Self-closing tag. Semantic break between content.'
  },
  {
    name: 'ul',
    category: 'Lists',
    description: 'Unordered list (bulleted)',
    syntax: '<ul><li>...</li></ul>',
    example: '<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>',
    notes: 'Parent element for list items. Use with <li> tags.'
  },
  {
    name: 'ol',
    category: 'Lists',
    description: 'Ordered list (numbered)',
    syntax: '<ol><li>...</li></ol>',
    example: '<ol>\n  <li>First</li>\n  <li>Second</li>\n</ol>',
    notes: 'Parent element for numbered lists. Use with <li> tags.'
  },
  {
    name: 'li',
    category: 'Lists',
    description: 'List item',
    syntax: '<li>...</li>',
    example: '<ul><li>Apple</li><li>Banana</li></ul>',
    notes: 'Used within <ul> or <ol>. Must be inside a list.'
  },
  {
    name: 'button',
    category: 'Forms',
    description: 'Creates a clickable button',
    syntax: '<button>...</button>',
    commonAttributes: ['type', 'class', 'onclick'],
    example: '<button type="submit">Click Me</button>',
    notes: 'Types: submit, reset, button. Use forms or JavaScript.'
  },
  {
    name: 'form',
    category: 'Forms',
    description: 'Container for form elements',
    syntax: '<form>...</form>',
    commonAttributes: ['action', 'method', 'id'],
    example: '<form action="/submit" method="POST">...</form>',
    notes: 'Groups form inputs. Method is POST or GET.'
  },
  {
    name: 'input',
    category: 'Forms',
    description: 'Accepts user input',
    syntax: '<input type="..." name="...">',
    commonAttributes: ['type', 'name', 'placeholder', 'required'],
    example: '<input type="text" placeholder="Enter name">',
    notes: 'Self-closing tag. Types: text, email, password, checkbox, radio, etc.'
  },
  {
    name: 'textarea',
    category: 'Forms',
    description: 'Multi-line text input',
    syntax: '<textarea>...</textarea>',
    commonAttributes: ['rows', 'cols', 'name', 'placeholder'],
    example: '<textarea rows="4" cols="50" placeholder="Enter message"></textarea>',
    notes: 'For longer text input. Can be resized by user.'
  },
  {
    name: 'label',
    category: 'Forms',
    description: 'Label for form input',
    syntax: '<label for="id">...</label>',
    example: '<label for="email">Email:</label>\n<input id="email" type="email">',
    notes: 'Improves accessibility. Use for attribute to link to input.'
  },
  {
    name: 'table',
    category: 'Tables',
    description: 'Creates a data table',
    syntax: '<table><tr><td>...</td></tr></table>',
    example: '<table>\n  <tr><td>Cell 1</td><td>Cell 2</td></tr>\n</table>',
    notes: 'Use with <tr>, <td>, <th>, <thead>, <tbody> tags.'
  },
  {
    name: 'header',
    category: 'Semantic',
    description: 'Semantic header section',
    syntax: '<header>...</header>',
    example: '<header><h1>Site Title</h1></header>',
    notes: 'Semantic tag. Improves accessibility and SEO.'
  },
  {
    name: 'footer',
    category: 'Semantic',
    description: 'Semantic footer section',
    syntax: '<footer>...</footer>',
    example: '<footer><p>&copy; 2024 My Site</p></footer>',
    notes: 'Semantic tag. Usually contains copyright, links, contact info.'
  },
  {
    name: 'nav',
    category: 'Semantic',
    description: 'Navigation section',
    syntax: '<nav>...</nav>',
    example: '<nav><ul><li><a href="/">Home</a></li></ul></nav>',
    notes: 'Semantic tag. For main navigation links.'
  },
  {
    name: 'section',
    category: 'Semantic',
    description: 'Semantic section of content',
    syntax: '<section>...</section>',
    example: '<section><h2>About Us</h2><p>...</p></section>',
    notes: 'Semantic tag. Groups related content together.'
  },
  {
    name: 'article',
    category: 'Semantic',
    description: 'Semantic independent content',
    syntax: '<article>...</article>',
    example: '<article><h2>Blog Post Title</h2><p>...</p></article>',
    notes: 'Semantic tag. For blog posts, news articles, etc.'
  },
  {
    name: 'aside',
    category: 'Semantic',
    description: 'Sidebar or related content',
    syntax: '<aside>...</aside>',
    example: '<aside><h3>Related Links</h3></aside>',
    notes: 'Semantic tag. For sidebars or tangential content.'
  }
];
