// Local authentication using localStorage
export class LocalAuth {
  private static getStorage() {
    if (typeof window === 'undefined') return null
    return window.localStorage
  }

  static getCurrentUser(): any | null {
    const storage = this.getStorage()
    if (!storage) return null
    const userStr = storage.getItem('current_user')
    return userStr ? JSON.parse(userStr) : null
  }

  static setCurrentUser(user: any): void {
    const storage = this.getStorage()
    if (storage) {
      storage.setItem('current_user', JSON.stringify(user))
    }
  }

  static signOut(): void {
    const storage = this.getStorage()
    if (storage) {
      storage.removeItem('current_user')
    }
  }

  static signInWithGitHub(): Promise<any> {
    // Mock GitHub sign-in - creates a demo user
    return new Promise((resolve) => {
      const mockUser = {
        id: `user_${Date.now()}`,
        email: 'demo@example.com',
        user_metadata: {
          full_name: 'Demo User',
          name: 'Demo User',
        },
      }
      this.setCurrentUser(mockUser)
      resolve({ data: { user: mockUser }, error: null })
    })
  }

  static getUser(): Promise<{ data: { user: any | null }, error: any }> {
    let user = this.getCurrentUser()
    
    // Auto-create demo user if none exists
    if (!user) {
      user = {
        id: `user_${Date.now()}`,
        email: 'demo@example.com',
        user_metadata: {
          full_name: 'Demo User',
          name: 'Demo User',
        },
      }
      this.setCurrentUser(user)
    }
    
    return Promise.resolve({
      data: { user },
      error: null,
    })
  }
}

