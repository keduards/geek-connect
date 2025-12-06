'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient-local'
import { useEffect, useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navigation() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    checkUser()

    // For local auth, we don't need to subscribe to changes
    // Just check user on mount
  }, [])

  const isActive = (path: string) => pathname === path

  const navLinks = [
    { href: '/onboarding', label: 'Onboarding' },
    { href: '/matches', label: 'Matches' },
    { href: '/collab', label: 'Collab' },
    { href: '/profile', label: 'Profile' },
  ]

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      onClick={() => setMobileMenuOpen(false)}
      className={`py-2 px-4 rounded-md text-base hover:bg-accent hover:text-accent-foreground transition-colors ${
        isActive(href)
          ? 'font-medium text-primary bg-accent'
          : 'text-muted-foreground'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold text-foreground hover:text-primary"
          >
            Geek Connect
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </div>

          {/* Mobile Burger Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-6 py-6">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-semibold text-foreground pb-4 border-b"
                >
                  Geek Connect
                </Link>
                <div className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <NavLink key={link.href} href={link.href} label={link.label} />
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

