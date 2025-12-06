'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient-local'
import LoginForm from './login-form'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/onboarding')
      }
    }
    checkAuth()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to CursorCafe</h1>
          <p className="mt-2 text-muted-foreground">
            Connect with product development professionals
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

