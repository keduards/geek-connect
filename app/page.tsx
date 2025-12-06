'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient-local'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Auto-create user and go to onboarding
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      // User is auto-created if none exists, so just redirect
      router.push('/onboarding')
    }
    init()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div>Loading...</div>
    </div>
  )
}
