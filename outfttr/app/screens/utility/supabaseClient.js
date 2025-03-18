import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qnpxypkpiclfzzpcahoc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucHh5cGtwaWNsZnp6cGNhaG9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMjM5MDYsImV4cCI6MjA1Nzc5OTkwNn0.eU0OO916lToOtesEuTD_wFhWzHIu8-rFpJ88jwjgecY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true, 
    detectSessionInUrl: false,
  },
})