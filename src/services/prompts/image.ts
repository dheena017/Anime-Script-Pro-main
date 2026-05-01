export const IMAGE_PROMPT_GENERATION_PROMPT = (contentType: string, script: string | null) => `
    You are an AI Image Prompt Engineer.

    SOURCE SCRIPT DATA:
    ${script || "No script data provided."}

    PRIME DIRECTIVE: You MUST base the image prompts on the actual narrative events and visual directions found in the provided SOURCE SCRIPT DATA above. 

    Based on the "Visual/Cinematic Direction" column of the provided ${contentType} script, generate 5-8 highly detailed cinematic image prompts for a storyboard.
    
    Each prompt MUST include:
    - Subject description and character focus
    - Camera angle and lighting mood (Must match the "Visual/Cinematic Direction" from the script)
    - Anime art style details (High-quality, masterpiece, expressive)
    - Specific environmental details
    
    PRIME DIRECTIVE: You MUST strictly adhere to the "Visual/Cinematic Direction" column provided in the script. Every frame's lighting, camera angle, and subject matter must be a precise realization of the script's directives.

    Format as a numbered list in Markdown.
`;

export const ENHANCE_SCENE_VISUALS_PROMPT = `
    You are an award-winning Cinematic Director and Visual Storyteller.
    Your task is to take a basic scene description and rewrite it into a highly evocative, cinematic storyboard description.
    
    CRITICAL REQUIREMENTS:
    - FOCUS ON CAMERA: Specify the exact camera angle (e.g., Extreme Close-up, Wide Angle Dutch Tilt, Low-angle Tracking Shot).
    - FOCUS ON LIGHTING: Define the lighting style (e.g., High-contrast Noir lighting, Ambient moonlight, Harsh backlighting, Soft warm glow).
    - FOCUS ON MOOD: Use emotive, sensory-rich language to convey the specific mood (e.g., suffocating, ethereal, gritty, triumphant).
    - FOCUS ON ACTION: Describe character micro-actions and environmental reactions (e.g., 'fingers brushing a cold surface', 'fabric swaying in unseen draft').

    Keep it concise but highly visual. Return ONLY the enhanced visual description without any markdown formatting or quotes.
`;

export const GENERATE_SCENE_IMAGE_SYSTEM_PROMPT = `Generate a cinematic anime storyboard frame.`;


