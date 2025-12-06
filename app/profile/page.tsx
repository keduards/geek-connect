'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient-local'
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
import { useRouter } from 'next/navigation'

export default function Profile() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    display_name: '',
    role: '',
    skills: '',
    bio: '',
  })
  const router = useRouter()

  useEffect(() => {
    const loadProfile = async () => {
      // User is auto-created, so always proceed
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setProfile(data)
        setFormData({
          display_name: data.display_name || '',
          role: data.role || '',
          skills: (data.skills || []).join(', '),
          bio: data.bio || '',
        })
      }
      setLoading(false)
    }

    loadProfile()
  }, [router])

  const handleSave = async () => {
    try {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      await supabase
        .from('profiles')
        .update({
          display_name: formData.display_name,
          role: formData.role,
          skills: formData.skills
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0),
          bio: formData.bio,
        })
        .eq('user_id', user.id)

      // Reload profile
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setProfile(data)
      }

      setEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>Profile not found</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-2xl space-y-6 rounded-lg border bg-card p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            {profile.display_name || 'Your Profile'}
          </h1>
          {!editing && (
            <Button onClick={() => setEditing(true)} variant="outline">
              Edit Profile
            </Button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) =>
                  setFormData({ ...formData, display_name: e.target.value })
                }
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
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
                value={formData.skills}
                onChange={(e) =>
                  setFormData({ ...formData, skills: e.target.value })
                }
                placeholder="e.g., React, TypeScript, Node.js"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Tell us about yourself..."
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={loading} className="flex-1">
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                onClick={() => {
                  setEditing(false)
                  setFormData({
                    display_name: profile.display_name || '',
                    role: profile.role || '',
                    skills: (profile.skills || []).join(', '),
                    bio: profile.bio || '',
                  })
                }}
                variant="outline"
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Role</Label>
              <p className="text-lg font-medium capitalize">
                {profile.role || 'Not set'}
              </p>
            </div>

            <div>
              <Label className="text-muted-foreground">Skills</Label>
              <p className="text-lg">
                {(profile.skills || []).length > 0
                  ? (profile.skills || []).join(', ')
                  : 'No skills added'}
              </p>
            </div>

            <div>
              <Label className="text-muted-foreground">Bio</Label>
              <p className="text-lg whitespace-pre-wrap">
                {profile.bio || 'No bio added'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

