'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient-local'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'

export default function Onboarding() {
  const [role, setRole] = useState('developer')
  const [skills, setSkills] = useState('')
  const [loading, setLoading] = useState(false)
  const [showConnectingModal, setShowConnectingModal] = useState(false)
  const router = useRouter()

  const save = async () => {
    try {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      await supabase
        .from('profiles')
        .update({
          role,
          skills: skills.split(',').map((s) => s.trim()).filter((s) => s.length > 0),
        })
        .eq('user_id', user.id)

      // Show connecting modal
      setShowConnectingModal(true)
      setLoading(false)

      // Wait 5 seconds then redirect
      setTimeout(() => {
        router.push('/matches')
      }, 5000)
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-12 w-full">
        <div className="mx-auto w-full md:max-w-2xl space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Welcome to Geek Connect</h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground">
              Set up your profile to start connecting with other professionals
            </p>
          </div>

          <div className="space-y-6 w-full">
            <div className="space-y-4 w-full">
              <Label htmlFor="role" className="text-base h-[60px] flex items-center">Role</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
                {[
                  { value: 'developer', label: 'Developer' },
                  { value: 'product_manager', label: 'Product Manager' },
                  { value: 'product_designer', label: 'Product Designer' },
                  { value: 'qa', label: 'QA' },
                  { value: 'devops', label: 'DevOps' },
                  { value: 'founder', label: 'Founder' },
                ].map((roleOption) => (
                  <button
                    key={roleOption.value}
                    type="button"
                    onClick={() => setRole(roleOption.value)}
                    className={`h-[60px] rounded-lg text-base font-medium transition-colors ${
                      role === roleOption.value
                        ? 'bg-black text-white'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    {roleOption.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 w-full">
              <Label htmlFor="skills" className="text-base h-[60px] flex items-center">Skills (comma separated)</Label>
              <Input
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., React, TypeScript, Node.js"
                className="h-[60px] w-full text-base"
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple skills with commas
              </p>
            </div>

            <Button onClick={save} disabled={loading} className="w-full h-[60px] text-base" size="lg">
              {loading ? 'Saving...' : 'Save & Continue'}
            </Button>
          </div>
        </div>
      </div>

      {/* Connecting Modal - Full Screen */}
      {showConnectingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blur backdrop with 60% white opacity */}
          <div className="absolute inset-0 bg-white/60 backdrop-blur-md" />
          
          {/* Full screen content */}
          <div className="relative z-10 flex flex-col items-center justify-center space-y-6 w-full h-full p-6">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-center text-xl md:text-2xl font-medium text-foreground max-w-md">
              Connecting you to the best talent you can work with today
            </p>
          </div>
        </div>
      )}
    </>
  )
}

