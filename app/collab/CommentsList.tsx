'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient-local'
import { LocalDB } from '@/lib/db/local-db'

export function CommentsList({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any[]>([])

  useEffect(() => {
    const loadComments = async () => {
      // Load comments for this initiative using LocalDB directly
      const commentsData = LocalDB.getCommentsByInitiative(postId)
      
      // Load all profiles for name lookup
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .limit(100)
      
      setComments(commentsData || [])
      setProfiles(profilesData || [])
    }
    loadComments()
    
    // Refresh every 2 seconds to catch new comments
    const interval = setInterval(loadComments, 2000)
    return () => clearInterval(interval)
  }, [postId])

  const getProfileName = (userId: string) => {
    const profile = profiles.find((p: any) => p.user_id === userId)
    return profile?.display_name || 'Anonymous'
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold">Comments ({comments.length})</h4>
      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>
      ) : (
        <div className="space-y-2">
          {comments.map((comment: any) => (
            <div key={comment.id_comentario} className="rounded border bg-muted/50 p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium">{getProfileName(comment.id_usuario)}</p>
                  <p className="mt-1 text-sm text-foreground">{comment.contenido}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

