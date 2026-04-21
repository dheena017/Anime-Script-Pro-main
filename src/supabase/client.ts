import { createBrowserClient } from "@supabase/ssr";

const getSafeConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const isValid = url && typeof url === 'string' && url.startsWith('http');
  
  return {
    url: isValid ? url : "https://placeholder-project.supabase.co",
    key: key || "placeholder-key"
  };
};

export const createClient = () => {
  const { url, key } = getSafeConfig();
  
  try {
    return createBrowserClient(url, key);
  } catch (error) {
    console.error("Supabase initialization failed, falling back to dummy:", error);
    return createBrowserClient("https://placeholder-project.supabase.co", "placeholder-key");
  }
};
