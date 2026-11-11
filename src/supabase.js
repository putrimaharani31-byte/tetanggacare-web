import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uvaoocllxlklfmyhsjjt.supabase.co';
const supabaseAnonKey = 'sb_publishable_bwxFhLEunjFpFpnvO87VLw_-kh5B1po'; // tempel seluruh kunci lengkap dari Supabase kamu di sini

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
