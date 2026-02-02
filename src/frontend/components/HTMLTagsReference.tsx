import React, { useState, useMemo } from 'react';
import { HTML_TAGS_REFERENCE } from '../utils/htmlTagsReference';

interface HTMLTagsReferenceProps {
  onClose: () => void;
}

/**
 * Get visual rendering example HTML for a tag
 */
const getRenderingExample = (tagName: string): string => {
  const examples: { [key: string]: string } = {
    'h1': '<h1>This is a Heading 1</h1><p>Main title of the page</p>',
    'h2': '<h2>This is a Heading 2</h2><p>Subheading - smaller than H1</p>',
    'h3': '<h3>This is a Heading 3</h3><p>Sub-subheading</p>',
    'p': '<p>This is a paragraph. Paragraphs have space above and below them.</p><p>This is another paragraph.</p>',
    'strong': '<p>This is <strong>very important text</strong> in a sentence.</p>',
    'em': '<p>This is <em>emphasized text</em> in a sentence.</p>',
    'a': '<a href="https://example.com" style="color: blue; text-decoration: underline;">Click here to visit Example.com</a>',
    'img': '<img src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%27100%27%3E%3Crect fill=%27%23ddd%27 width=%27100%27 height=%27100%27/%3E%3Ctext x=%2750%25%27 y=%2750%25%27 text-anchor=%27middle%27 dy=%27.3em%27 fill=%27%23999%27 font-size=%2714%27%3EImage%3C/text%3E%3C/svg%3E" alt="Sample Image" style="width: 100px; border: 1px solid #ccc;">',
    'br': '<p>Line 1<br>Line 2<br>Line 3</p>',
    'hr': '<p>Content before the line</p><hr style="border: none; border-top: 2px solid #999;"><p>Content after the line</p>',
    'ul': '<ul style="margin-left: 20px;"><li>First item</li><li>Second item</li><li>Third item</li></ul>',
    'ol': '<ol style="margin-left: 20px;"><li>First step</li><li>Second step</li><li>Third step</li></ol>',
    'li': '<ul><li style="margin: 5px 0;">List item 1</li><li style="margin: 5px 0;">List item 2</li></ul>',
    'div': '<div style="background: #f0f0f0; padding: 20px; border: 1px solid #ccc; margin: 10px 0;">This is a div container</div>',
    'span': '<p>This is a <span style="background: #ffff00; padding: 2px 4px;">highlighted span</span> in text.</p>',
    'button': '<button style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Click Me</button>',
    'input': '<input type="text" placeholder="Enter your name" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; width: 200px;">',
    'textarea': '<textarea placeholder="Enter your message" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; width: 100%; height: 80px;"></textarea>',
    'form': '<form style="background: #f9f9f9; padding: 15px; border: 1px solid #ccc; border-radius: 4px;"><div style="margin-bottom: 10px;"><label>Name:</label><br><input type="text" style="padding: 5px; width: 100%; max-width: 300px;"></div><button type="submit" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Submit</button></form>',
    'table': '<table style="border-collapse: collapse; width: 100%;"><tr><th style="border: 1px solid #ddd; padding: 8px; background: #f0f0f0;">Name</th><th style="border: 1px solid #ddd; padding: 8px; background: #f0f0f0;">Age</th></tr><tr><td style="border: 1px solid #ddd; padding: 8px;">John</td><td style="border: 1px solid #ddd; padding: 8px;">25</td></tr><tr><td style="border: 1px solid #ddd; padding: 8px;">Jane</td><td style="border: 1px solid #ddd; padding: 8px;">28</td></tr></table>',
    'header': '<header style="background: #333; color: white; padding: 20px; text-align: center;"><h1>Website Header</h1></header>',
    'footer': '<footer style="background: #333; color: white; padding: 20px; text-align: center; margin-top: 20px;"><p>&copy; 2024 My Website. All rights reserved.</p></footer>',
    'nav': '<nav style="background: #f0f0f0; padding: 10px; margin-bottom: 20px;"><a href="#" style="margin-right: 15px; text-decoration: none; color: blue;">Home</a><a href="#" style="margin-right: 15px; text-decoration: none; color: blue;">About</a><a href="#" style="margin-right: 15px; text-decoration: none; color: blue;">Contact</a></nav>',
    'article': '<article style="background: white; padding: 15px; border: 1px solid #ddd; margin: 10px 0;"><h2>Article Title</h2><p>This is the content of the article...</p></article>',
    'section': '<section style="background: #f9f9f9; padding: 20px; margin: 10px 0; border-left: 4px solid #007bff;"><h2>Section Title</h2><p>Section content goes here...</p></section>',
  };

  return examples[tagName.toLowerCase()] || `<${tagName}>Content</${tagName}>`;
};

export const HTMLTagsReference: React.FC<HTMLTagsReferenceProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedTag, setExpandedTag] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(HTML_TAGS_REFERENCE.map(tag => tag.category))],
    []
  );

  const filteredTags = useMemo(() => {
    return HTML_TAGS_REFERENCE.filter(tag => {
      const matchesSearch = tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tag.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || tag.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const toggleTagExpansion = (tagName: string) => {
    setExpandedTag(expandedTag === tagName ? null : tagName);
  };

  return (
    <div className="tags-reference-overlay" onClick={onClose}>
      <div className="tags-reference-modal" onClick={(e) => e.stopPropagation()}>
        <div className="reference-header">
          <h2>📖 HTML Tags Reference</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="reference-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search tags (e.g., div, button, form)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="category-filters">
            <button
              className={`category-btn ${!selectedCategory ? 'active' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              All Tags
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="reference-content">
          {filteredTags.length === 0 ? (
            <div className="no-results">
              <p>No tags found matching "{searchTerm}"</p>
            </div>
          ) : (
            <div className="tags-list">
              {filteredTags.map(tag => (
                <div key={tag.name} className="tag-card">
                  <div 
                    className="tag-header-clickable"
                    onClick={() => toggleTagExpansion(tag.name)}
                  >
                    <span className="tag-expand-icon">
                      {expandedTag === tag.name ? '▼' : '▶'}
                    </span>
                    <div className="tag-header">
                      <h3 className="tag-name">&lt;{tag.name}&gt;</h3>
                      <span className="tag-category">{tag.category}</span>
                    </div>
                  </div>
                  
                  <p className="tag-description">{tag.description}</p>
                  
                  <div className="tag-syntax">
                    <strong>Syntax:</strong>
                    <code>{tag.syntax}</code>
                  </div>

                  {tag.commonAttributes && (
                    <div className="tag-attributes">
                      <strong>Common Attributes:</strong>
                      <div className="attribute-list">
                        {tag.commonAttributes.map(attr => (
                          <span key={attr} className="attribute-badge">{attr}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="tag-example">
                    <strong>Code Example:</strong>
                    <pre><code>{tag.example}</code></pre>
                  </div>

                  {expandedTag === tag.name && (
                    <div className="tag-rendering">
                      <strong>📺 Visual Rendering:</strong>
                      <div className="rendering-container">
                        <iframe
                          srcDoc={getRenderingExample(tag.name)}
                          title={`${tag.name} rendering`}
                          style={{
                            width: '100%',
                            height: '150px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            background: 'white'
                          }}
                          sandbox="allow-same-origin"
                        />
                      </div>
                    </div>
                  )}

                  {tag.notes && (
                    <div className="tag-notes">
                      <strong>💡 Note:</strong> {tag.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
