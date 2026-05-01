export const METADATA_GENERATION_PROMPT = (script: string | null) => `
    Act as an expert social media manager for small business, services, or products.
    You are a YouTube SEO Expert and Growth Strategist.
    
    SOURCE SCRIPT DATA:
    ${script || "No script data provided."}

    PRIME DIRECTIVE: You MUST base all titles, descriptions, tags, and thumbnail concepts on the actual narrative events, characters, and visual directions found in the provided SOURCE SCRIPT DATA. 

    Based on the provided anime script, generate:
    1. 5 Viral-style, high-CTR YouTube Titles that leverage the cinematic tone of the script and incorporate keyword research best practices (relevant keywords, compelling hooks).
    2. A structured YouTube Description optimized for the algorithm, including storytelling elements to enhance engagement.
    3. 15-20 highly targeted SEO Tags (covering the series, genre, and specific niche keywords identified from research).
    4. 3 High-Conversion Thumbnail Concepts using visually appealing imagery and clear branding.
    
    Format the output in clean Markdown.
`;

export const YOUTUBE_DESCRIPTION_GENERATION_PROMPT = (contentType: string, script: string | null) => `
    Act as an expert social media manager for small business, services, or products.
    You are a YouTube Growth Expert specializing in content distribution and audience retention.
    
    SOURCE SCRIPT DATA:
    ${script || "No script data provided."}

    PRIME DIRECTIVE: You MUST base the description on the actual narrative events, characters, and visual directions found in the provided SOURCE SCRIPT DATA. 

    Based on the provided ${contentType} script, generate a professional, high-engagement YouTube Description.
    
    The description MUST include:
    1. **Hook & About**: A compelling introduction using storytelling elements to evoke emotion and relatability. Summarize the narrative arc in 2-3 paragraphs.
    2. **Timestamps & Chapters**: Accurate, keyword-optimized timestamps based on the script sections.
    3. **Interactive Elements**: Include interactive prompts like questions for the comments section or polls to drive participation.
    4. **Calls to Action (CTAs)**: Strategically placed CTAs for subscribing, checking out related content, and website visits.
    5. **Keywords & SEO**: Informative description body rich with relevant keywords discovered through research to enhance discoverability.
    6. **Social Links & Community**: [Your Social Links Here] and a brief note on building a loyal subscriber base.
    
    Format the output in clean Markdown.
`;

export const ALT_TEXT_GENERATION_PROMPT = (script: string | null) => `
    You are an accessibility-focused content specialist and SEO expert.

    SOURCE SCRIPT DATA:
    ${script || "No script data provided."}

    PRIME DIRECTIVE: You MUST base the alt text on the actual narrative events and visual directions found in the provided SOURCE SCRIPT DATA. 

    Based on the provided anime script, generate 10 concise, descriptive alt text captions for key storyboard frames and promotional visuals.
    Each alt text should be no more than one sentence, clearly describing the scene, mood, and any key branding elements to maximize click-through rate and accessibility.
    Format the output as a Markdown list.
`;

export const GROWTH_STRATEGY_PROMPT = (contentType: string, script: string | null) => `
    Act as an expert social media manager for small business, services, or products.
    You are a YouTube Growth Strategist and Community Architect.
    
    SOURCE SCRIPT DATA:
    ${script || "No script data provided."}

    Based on the provided ${contentType} script, develop a comprehensive YouTube Growth Strategy.
    
    You MUST address the following areas using professional, actionable insights:
    
    1. **Educational Video Series**:
       - Compose a list of topics/themes (FAQs, trends, insights).
       - Itemize key elements (clear explanations, step-by-step demos, CTAs).
       - Draft a release schedule and promotional plan.
       - Outline a sample episode script structure.
       
    2. **Influencer Collaboration DNA**:
       - List potential influencer niches (Anitubers, writing critics, etc.).
       - Draft a personalized pitch highlighting mutual benefits.
       - Itemize collaboration formats (Sponsored videos, unboxings, Q&A).
       
    3. **Live Stream Events**:
       - Propose 3 live event ideas (Tutorials, Behind-the-scenes, Q&A).
       - Outline technical setup and promotion strategy.
       - Devise audience engagement tactics (Polls, Real-time Q&A).
       
    4. **Community & Engagement**:
       - Draft guidelines for empathetic comment responding.
       - Devise a plan for leveraging the Community Tab and Stories.
       - Outline a process for gathering viewer feedback for future content.
       
    5. **Repurposing Matrix**:
       - Strategy for turning the script into Shorts, Reels, and TikToks.
       - Tips for adapting content for different platform demographics.
       
    6. **ROI & Metrics**:
       - Key metrics to track (Watch time, retention, conversion).
       - ROI estimation factors (Lead generation, brand authority).

    Format the output in professional, structured Markdown with clear headings and actionable bullet points.
`;


