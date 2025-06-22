import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ucppseenxjaqptvgvspw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjcHBzZWVueGphcXB0dmd2c3B3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MDkwMTAsImV4cCI6MjA2NjE4NTAxMH0.EVa-u8aICg2p1ilzEpe-xu4VEAB-IjULfDH6dTXPuLs';

export const supabase = createClient(supabaseUrl, supabaseKey);
