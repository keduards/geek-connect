'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient-local'
import { scoreMatch, explainMatch } from '@/lib/matching'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Matches() {
  const [me, setMe] = useState<any>(null)
  const [others, setOthers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [requesting, setRequesting] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const loadMatches = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // User is auto-created, so always proceed
      const { data: meProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!meProfile) {
        router.push('/onboarding')
        return
      }

      setMe(meProfile)

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .neq('user_id', user.id)
        .limit(20)

      const scored = (data || [])
        .map((p: any) => ({
          ...p,
          score: scoreMatch(meProfile, p),
          explanation: explainMatch(meProfile, p),
        }))
        .sort((a, b) => b.score - a.score)

      setOthers(scored)
      setLoading(false)
    }

    loadMatches()
  }, [router])

  const handleRequestIntro = async (otherProfile: any) => {
    try {
      setRequesting(otherProfile.id)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // User is auto-created, so always proceed

      await supabase.from('messages').insert([
        {
          from_id: user.id,
          to_id: otherProfile.user_id,
          body: 'Hi — I would like to connect about collaborating.',
        },
      ])

      alert('Intro requested')
    } catch (error) {
      console.error('Error requesting intro:', error)
      alert('Failed to send intro request. Please try again.')
    } finally {
      setRequesting(null)
    }
  }

  if (loading || !me) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Matches</h1>

        {others.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">No matches found yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {others.map((o, index) => (
              <div
                key={o.user_id || o.id || `match_${index}`}
                className="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <strong className="text-lg">
                        {o.display_name || 'Anonymous'}
                      </strong>
                      <span className="text-sm text-muted-foreground">—</span>
                      <span className="text-sm font-medium capitalize">
                        {o.role || 'No role'}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>Skills:</strong>{' '}
                      {(o.skills || []).length > 0
                        ? (o.skills || []).join(', ')
                        : 'No skills listed'}
                    </div>
                    {o.bio && (
                      <p className="text-sm text-muted-foreground">{o.bio}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-muted-foreground">
                        Match Score:
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {(o.score * 100).toFixed(0)}%
                      </span>
                    </div>
                    {o.explanation && (
                      <div className="text-xs text-muted-foreground italic">
                        {o.explanation}
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => handleRequestIntro(o)}
                    disabled={requesting === o.id}
                    variant="default"
                    className="ml-4"
                  >
                    {requesting === o.id ? 'Sending...' : 'Request Intro'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

