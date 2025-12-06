'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient-local'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Welcome to Geek Connect</h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground">
              Set up your profile to start connecting with other professionals
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-base">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role" className="h-[60px] text-base">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="developer">Developer</SelectItem>
                  <SelectItem value="product_manager">Product Manager</SelectItem>
                  <SelectItem value="product_designer">Product Designer</SelectItem>
                  <SelectItem value="qa">QA</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                  <SelectItem value="founder">Founder</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills" className="text-base">Skills (comma separated)</Label>
              <Input
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., React, TypeScript, Node.js"
                className="h-12"
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple skills with commas
              </p>
            </div>

            <Button onClick={save} disabled={loading} className="w-full h-12 text-base" size="lg">
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

