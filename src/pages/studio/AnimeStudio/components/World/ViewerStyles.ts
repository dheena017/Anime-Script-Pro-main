export const WORLD_VIEWER_PROSE_CLASSES = `
  prose prose-invert max-w-none 
  /* H1 */
  prose-h1:text-transparent prose-h1:bg-clip-text prose-h1:bg-gradient-to-r prose-h1:from-white prose-h1:to-white/50 prose-h1:font-black prose-h1:uppercase prose-h1:tracking-[0.3em] prose-h1:text-3xl prose-h1:mb-16
  
  /* H2 (Section Cards) */
  prose-h2:text-white prose-h2:font-black prose-h2:uppercase prose-h2:tracking-[0.2em] prose-h2:text-sm 
  prose-h2:bg-gradient-to-r prose-h2:from-white/5 prose-h2:to-transparent prose-h2:p-6 prose-h2:rounded-2xl prose-h2:border prose-h2:border-white/10 
  prose-h2:border-l-4 prose-h2:border-l-studio
  prose-h2:mt-32 prose-h2:mb-10 prose-h2:relative prose-h2:shadow-2xl
  prose-h2:before:content-[''] prose-h2:before:absolute prose-h2:before:-top-16 prose-h2:before:left-[5%] prose-h2:before:w-[90%] prose-h2:before:h-[1px] prose-h2:before:bg-gradient-to-r prose-h2:before:from-transparent prose-h2:before:via-white/10 prose-h2:before:to-transparent
  
  /* H3 (Subheadings) */
  prose-h3:text-zinc-300 prose-h3:font-bold prose-h3:uppercase prose-h3:tracking-[0.15em] prose-h3:text-xs prose-h3:mt-12 prose-h3:mb-6 prose-h3:border-b prose-h3:border-white/5 prose-h3:pb-4
  
  /* Paragraphs & Text */
  prose-p:text-zinc-400 prose-p:leading-loose prose-p:text-[15px] prose-p:mb-8 prose-p:font-medium
  prose-strong:text-studio prose-strong:font-black prose-strong:drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]
  
  /* Lists */
  prose-ul:border-l-2 prose-ul:border-white/5 prose-ul:pl-8 prose-ul:space-y-4 prose-ul:mb-12
  prose-li:text-[14px] prose-li:text-zinc-400 prose-li:leading-relaxed prose-li:marker:text-studio
  
  /* Blockquotes & Code */
  prose-blockquote:border-l-4 prose-blockquote:border-studio prose-blockquote:bg-studio/5 prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:text-zinc-300 prose-blockquote:font-mono prose-blockquote:text-[13px] prose-blockquote:italic prose-blockquote:shadow-inner prose-blockquote:my-12
  prose-code:bg-studio/10 prose-code:text-studio prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:font-mono prose-code:text-[12px] prose-code:before:content-none prose-code:after:content-none
  
  /* Dividers */
  prose-hr:border-white/10 prose-hr:my-24
`.replace(/\s+/g, ' ').trim();


