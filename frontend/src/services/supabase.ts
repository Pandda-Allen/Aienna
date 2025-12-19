import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://pcjfyjeocrdhtbajqqpv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjamZ5amVvY3JkaHRiYWpxcXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUzNTg2MTQsImV4cCI6MjA4MDkzNDYxNH0.fVrssMXkhJvYu9OyFQi8BC_AP0JXvHMpMv_FmCHxsG0"; // put in ENV file

export const supabase = createClient(supabaseUrl, supabaseAnonKey);