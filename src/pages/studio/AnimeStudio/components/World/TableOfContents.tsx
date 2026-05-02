import React from 'react';
import { List } from 'lucide-react';

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const headings = React.useMemo(() => {
    return content.split('\n')
      .filter(line => line.startsWith('## '))
      .map(line => {
        // Strip markdown bold/italic syntax from the text for clean display
        const text = line.replace(/#/g, '').replace(/\*/g, '').replace(/_/g, '').trim();
        // Create an ID that matches what ReactMarkdown custom components will generate
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        return { text, id };
      });
  }, [content]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-10 p-6 bg-black/40 border border-white/5 rounded-[2rem] space-y-6 shadow-2xl backdrop-blur-md">
      <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-4">
        <List className="w-4 h-4 text-studio" /> Quick Navigation
      </h4>
      <ul className="space-y-1 relative before:absolute before:inset-y-0 before:left-[5px] before:w-[1px] before:bg-white/5">
        {headings.map((heading, i) => (
          <li key={i} className="relative group">
            {/* Custom Interactive Dot */}
            <div className="absolute left-[3px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-white/10 group-hover:bg-studio group-hover:shadow-[0_0_8px_var(--studio-glow)] transition-all duration-300 z-10" />
            
            <a 
              href={`#${heading.id}`}
              onClick={(e) => handleScroll(e, heading.id)}
              className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-studio transition-all duration-300 block py-2 pl-6 group-hover:translate-x-1 group-hover:bg-studio/5 rounded-r-lg"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}



