import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type BusinessIdea = {
  id: string
  prompt: string
  generated_idea: {
    name: string
    description: string
    monetization: string
    tools_needed: string[]
    time_to_mvp: string
    difficulty: string
    category?: string
  }
  filters?: {
    industry?: string
    budget?: string
    skill_level?: string
    ai_use?: boolean
  }
  created_at: string
  user_id?: string
  is_public: boolean
  view_count: number
} 