import { createServerClient } from "@supabase/ssr";

const getSafeConfig = () => {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  
  const isValid = url && typeof url === 'string' && url.startsWith('http');
  
  return {
    url: isValid ? url : "https://placeholder-project.supabase.co",
    key: key || "placeholder-key"
  };
};

export const createClient = (req: any, res: any) => {
  const { url, key } = getSafeConfig();
  
  try {
    return createServerClient(
      url,
      key,
      {
        cookies: {
          getAll() {
            return Object.keys(req.cookies || {}).map((name) => ({ name, value: req.cookies[name] }));
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              res.cookie?.(name, value, options);
            });
          },
        },
      },
    );
  } catch (error) {
    console.error("Supabase server initialization failed:", error);
    // Return a minimally functional client to avoid crashing the whole server
    return createServerClient("https://placeholder-project.supabase.co", "placeholder-key", { cookies: { getAll() { return []; }, setAll() {} } });
  }
};
