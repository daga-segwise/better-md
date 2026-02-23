import MarkdownIt from 'markdown-it';
import footnote from 'markdown-it-footnote';
import taskLists from 'markdown-it-task-lists';
import anchor from 'markdown-it-anchor';
import hljs from 'highlight.js';

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, '-')
    .replace(/[^\w-]+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const md = new MarkdownIt({
  linkify: true,
  typographer: true,
  html: false,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs">${hljs.highlight(str, { language: lang }).value}</code></pre>`;
      } catch {
        // fall through
      }
    }
    return `<pre><code class="hljs">${hljs.highlightAuto(str).value}</code></pre>`;
  },
});

md.use(footnote);
md.use(taskLists, { enabled: true, label: true });
md.use(anchor, { slugify });

export function renderMarkdown(content: string): string {
  return md.render(content);
}

export default md;
