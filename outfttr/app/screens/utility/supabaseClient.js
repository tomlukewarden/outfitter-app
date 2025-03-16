import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nrfbdqdkwihithyqyrjv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yZmJkcWRrd2loaXRoeXF5cmp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMzg0MzIsImV4cCI6MjA1NzcxNDQzMn0.oAFgdQBx0L0lLNyfd4qSh1IXh46XJwHIL1Wq8Z8unCk';


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
