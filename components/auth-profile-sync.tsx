'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient-local'
import { ensureProfile } from '@/lib/authHelpers'

export function AuthProfileSync() {
  useEffect(() => {
    const checkAndCreateProfile = async () => {
      // Auto-create user if none exists (handled in LocalAuth.getUser)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        await ensureProfile(user)
      }
    }

    checkAndCreateProfile()
  }, [])

  return null // This component doesn't render anything
}

