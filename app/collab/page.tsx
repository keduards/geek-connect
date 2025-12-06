'use client'

import { useState, useEffect } from 'react'
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
import { CommentsList } from './CommentsList'

export default function Collab() {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [tipo, setTipo] = useState('IDEA') // IDEA or PROYECTO
  const [roleNeeded, setRoleNeeded] = useState('developer')
  const [posts, setPosts] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [applying, setApplying] = useState<string | null>(null)
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({})
  const router = useRouter()

  useEffect(() => {
    const loadPosts = async () => {
      // User is auto-created, so always proceed
      const { data: postsData } = await supabase
        .from('collab_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30)

      const { data: profilesData } = await supabase
        .from('profiles')
        .select('*')
        .limit(100)

      setPosts(postsData || [])
      setProfiles(profilesData || [])
      setLoading(false)
    }

    loadPosts()
  }, [router])

  const getAuthorName = (authorId: string) => {
    const profile = profiles.find((p: any) => p.user_id === authorId)
    return profile?.display_name || 'Anonymous'
  }

  const create = async () => {
    try {
      setCreating(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      await supabase.from('collab_posts').insert([
        {
          author_id: user.id,
          title,
          description: desc,
          tipo: tipo, // IDEA or PROYECTO
          role_needed: roleNeeded,
          skills_required: [],
          estado: 'BORRADOR', // BORRADOR | VALIDANDO | EN_EJECUCION | CERRADO
        },
      ])

      // Reload posts
      const { data: postsData } = await supabase
        .from('collab_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30)

      setPosts(postsData || [])
      setTitle('')
      setDesc('')
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  const handleApply = async (post: any) => {
    try {
      setApplying(post.id)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // Add as participant
      await supabase.from('participants').insert([
        {
          id_iniciativa: post.id,
          id_usuario: user.id,
          rol: 'COLABORADOR',
        },
      ])

      alert('Applied successfully!')
    } catch (error) {
      console.error('Error applying:', error)
      alert('Failed to apply. Please try again.')
    } finally {
      setApplying(null)
    }
  }

  const handleAddComment = async (postId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      const comment = commentText[postId]
      
      if (!comment?.trim()) return

      await supabase.from('comments').insert([
        {
          id_iniciativa: postId,
          id_usuario: user.id,
          contenido: comment,
        },
      ])

      setCommentText({ ...commentText, [postId]: '' })
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Collab Board</h1>

        {/* 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Slim: Create Post Form */}
          <div className="lg:col-span-3">
            <div className="sticky top-6 rounded-lg border bg-card p-4 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Add New Post</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Looking for a React developer"
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo" className="text-sm">Type</Label>
                  <Select value={tipo} onValueChange={setTipo}>
                    <SelectTrigger id="tipo" className="text-sm">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IDEA">Idea</SelectItem>
                      <SelectItem value="PROYECTO">Project</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm">Role Needed</Label>
                  <Select value={roleNeeded} onValueChange={setRoleNeeded}>
                    <SelectTrigger id="role" className="text-sm">
                      <SelectValue placeholder="Select role needed" />
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
                  <Label htmlFor="description" className="text-sm">Description</Label>
                  <textarea
                    id="description"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Describe your project..."
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <Button onClick={create} disabled={creating || !title || !desc} className="w-full text-sm">
                  {creating ? 'Creating...' : 'Create Post'}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Wide: Recent Posts */}
          <div className="lg:col-span-9">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Recent Posts</h2>

          {posts.length === 0 ? (
            <div className="rounded-lg border bg-card p-8 text-center">
              <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
            </div>
          ) : (
            posts.map((p) => (
              <div
                key={p.id}
                className="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{p.title}</h3>
                          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                            {p.tipo || 'IDEA'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Posted by <span className="font-medium">{getAuthorName(p.author_id)}</span>
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground capitalize">
                          Looking for: {p.role_needed || 'Not specified'}
                        </p>
                        {p.estado && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Status: {p.estado}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm text-foreground">{p.description}</div>

                  {p.skills_required && p.skills_required.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      <strong>Skills required:</strong>{' '}
                      {p.skills_required.join(', ')}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setExpandedPost(expandedPost === p.id ? null : p.id)}
                        variant="outline"
                        size="sm"
                      >
                        {expandedPost === p.id ? 'Hide' : 'View'} Comments
                      </Button>
                      <Button
                        onClick={() => handleApply(p)}
                        disabled={applying === p.id}
                        variant="default"
                        size="sm"
                      >
                        {applying === p.id ? 'Applying...' : 'Join'}
                      </Button>
                    </div>
                  </div>

                  {expandedPost === p.id && (
                    <div className="mt-4 space-y-3 border-t pt-4">
                      <div className="space-y-2">
                        <Label>Add Comment</Label>
                        <div className="flex gap-2">
                          <Input
                            value={commentText[p.id] || ''}
                            onChange={(e) =>
                              setCommentText({ ...commentText, [p.id]: e.target.value })
                            }
                            placeholder="Share your thoughts..."
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleAddComment(p.id)
                              }
                            }}
                          />
                          <Button onClick={() => handleAddComment(p.id)} size="sm">
                            Post
                          </Button>
                        </div>
                      </div>
                      <CommentsList postId={p.id} />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

