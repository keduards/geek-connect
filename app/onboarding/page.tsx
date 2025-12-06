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

export default function Onboarding() {
  const [role, setRole] = useState('developer')
  const [skills, setSkills] = useState('')
  const [loading, setLoading] = useState(false)
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

      router.push('/matches')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-8 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quick Onboarding</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Set up your profile to start connecting
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="role">
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
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g., React, TypeScript, Node.js"
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple skills with commas
            </p>
          </div>

          <Button onClick={save} disabled={loading} className="w-full" size="lg">
            {loading ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </div>
    </div>
  )
}

