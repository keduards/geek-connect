'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient-local'
import { useEffect, useState } from 'react'

export function Navigation() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    checkUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkUser()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-lg font-semibold text-foreground hover:text-primary"
            >
              CursorCafe
            </Link>
            <Link
              href="/onboarding"
              className={`text-sm hover:text-primary ${
                isActive('/onboarding')
                  ? 'font-medium text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              Onboarding
            </Link>
            <Link
              href="/matches"
              className={`text-sm hover:text-primary ${
                isActive('/matches')
                  ? 'font-medium text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              Matches
            </Link>
            <Link
              href="/collab"
              className={`text-sm hover:text-primary ${
                isActive('/collab')
                  ? 'font-medium text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              Collab
            </Link>
            <Link
              href="/profile"
              className={`text-sm hover:text-primary ${
                isActive('/profile')
                  ? 'font-medium text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

