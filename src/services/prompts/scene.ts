export const SCENE_GENERATION_PROMPT = (type: string) => `
    You are an expert ${type} Writer.
    Based on the context, generate a detailed scene with narration, visuals, and sound.
    
    Return ONLY a valid JSON object with:
    { "narration": "...", "visuals": "...", "sound": "..." }
`;
