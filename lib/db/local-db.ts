// Local database using localStorage (client-side only)

// Client-side database using localStorage
export class LocalDB {
  private static getStorage() {
    if (typeof window === 'undefined') return null
    return window.localStorage
  }

  private static getItem(key: string): any[] {
    const storage = this.getStorage()
    if (!storage) return []
    const data = storage.getItem(key)
    return data ? JSON.parse(data) : []
  }

  private static setItem(key: string, data: any[]): void {
    const storage = this.getStorage()
    if (storage) {
      storage.setItem(key, JSON.stringify(data))
    }
  }

  // Profiles
  static getProfiles(): any[] {
    return this.getItem('profiles')
  }

  static getProfile(userId: string): any | null {
    const profiles = this.getProfiles()
    return profiles.find((p: any) => p.user_id === userId) || null
  }

  static createProfile(profile: any): void {
    const profiles = this.getProfiles()
    // Check if profile already exists
    const exists = profiles.some((p: any) => p.user_id === profile.user_id)
    if (exists) {
      return // Don't create duplicate
    }
    // Use user_id as id if not provided, or generate unique id
    const id = profile.id || profile.user_id || `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    profiles.push({ ...profile, id, created_at: new Date().toISOString() })
    this.setItem('profiles', profiles)
  }

  static updateProfile(userId: string, updates: any): void {
    const profiles = this.getProfiles()
    const index = profiles.findIndex((p: any) => p.user_id === userId)
    if (index !== -1) {
      profiles[index] = { ...profiles[index], ...updates, updated_at: new Date().toISOString() }
      this.setItem('profiles', profiles)
    }
  }

  // Posts
  static getPosts(): any[] {
    return this.getItem('collab_posts')
  }

  static createPost(post: any): void {
    const posts = this.getPosts()
    posts.push({ ...post, id: `post_${Date.now()}`, created_at: new Date().toISOString() })
    this.setItem('collab_posts', posts)
  }

  // Messages
  static getMessages(): any[] {
    return this.getItem('messages')
  }

  static createMessage(message: any): void {
    const messages = this.getMessages()
    messages.push({ ...message, id: `msg_${Date.now()}`, created_at: new Date().toISOString() })
    this.setItem('messages', messages)
  }

  // Comments (for initiatives/posts)
  static getComments(): any[] {
    return this.getItem('comments')
  }

  static getCommentsByInitiative(initiativeId: string): any[] {
    const comments = this.getComments()
    return comments.filter((c: any) => c.id_iniciativa === initiativeId)
  }

  static createComment(comment: any): void {
    const comments = this.getComments()
    comments.push({ 
      ...comment, 
      id_comentario: `comment_${Date.now()}`, 
      created_at: new Date().toISOString() 
    })
    this.setItem('comments', comments)
  }

  // Participants (for initiatives)
  static getParticipants(): any[] {
    return this.getItem('participants')
  }

  static getParticipantsByInitiative(initiativeId: string): any[] {
    const participants = this.getParticipants()
    return participants.filter((p: any) => p.id_iniciativa === initiativeId)
  }

  static addParticipant(participant: any): void {
    const participants = this.getParticipants()
    // Check if already exists
    const exists = participants.some(
      (p: any) => p.id_iniciativa === participant.id_iniciativa && 
                  p.id_usuario === participant.id_usuario
    )
    if (!exists) {
      participants.push({ 
        ...participant, 
        joined_at: new Date().toISOString() 
      })
      this.setItem('participants', participants)
    }
  }
}

