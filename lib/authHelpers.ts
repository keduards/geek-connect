import { supabase } from './supabaseClient-local'
import type { User } from '@supabase/supabase-js'

export async function ensureProfile(user: User) {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!data) {
    await supabase.from('profiles').insert([
      {
        user_id: user.id,
        display_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email?.split('@')[0] ?? '',
        role: '',
        skills: [],
        bio: '',
      },
    ])
  }
}

