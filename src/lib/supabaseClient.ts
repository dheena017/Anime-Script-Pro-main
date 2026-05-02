import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://placeholder-project.supabase.co';
const supabaseAnonKey = 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);



