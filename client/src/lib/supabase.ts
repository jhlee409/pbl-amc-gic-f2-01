import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getImageUrl(bucketName: string, fileName: string): Promise<string> {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);
  
  return data.publicUrl;
}
