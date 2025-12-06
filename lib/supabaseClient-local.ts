// Local Supabase client replacement
import { LocalDB } from './db/local-db'
import { LocalAuth } from './auth/local-auth'

export const supabase = {
  auth: {
    getUser: async () => {
      return await LocalAuth.getUser()
    },
    signInWithOAuth: async (options: any) => {
      if (options.provider === 'github') {
        return await LocalAuth.signInWithGitHub()
      }
      return { error: new Error('Provider not supported') }
    },
    signOut: async () => {
      LocalAuth.signOut()
      return { error: null }
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Simple mock - just call with current user
      const user = LocalAuth.getCurrentUser()
      if (user) {
        callback('SIGNED_IN', { user })
      }
      const subscription = {
        unsubscribe: () => {},
      }
      return {
        data: { subscription },
        unsubscribe: () => {},
      }
    },
  },
  from: (table: string) => {
    return {
      select: (columns: string = '*') => {
        let data: any[] = []
        
        // Get base data
        if (table === 'profiles') {
          data = LocalDB.getProfiles()
        } else if (table === 'collab_posts' || table === 'iniciativas') {
          data = LocalDB.getPosts()
        } else if (table === 'comments' || table === 'comentarios') {
          data = LocalDB.getComments()
        } else if (table === 'participants' || table === 'iniciativa_participante') {
          data = LocalDB.getParticipants()
        } else {
          data = []
        }

        const queryBuilder = {
          eq: (column: string, value: any) => {
            // Handle different column name formats
            let filterColumn = column
            if (column === 'id_iniciativa' && table === 'comments') {
              filterColumn = 'id_iniciativa'
            } else if (column === 'user_id' && table === 'profiles') {
              filterColumn = 'user_id'
            }
            
            const filtered = data.filter((item: any) => {
              // Handle both id_iniciativa and id formats
              if (column === 'id_iniciativa') {
                return item.id_iniciativa === value || item.id === value
              }
              return item[filterColumn] === value
            })
            return {
              single: async () => {
                return { data: filtered[0] || null, error: null }
              },
              limit: async (count: number) => {
                return { data: filtered.slice(0, count), error: null }
              },
            }
          },
          neq: (column: string, value: any) => {
            const filtered = data.filter((item: any) => item[column] !== value)
            return {
              limit: async (count: number) => {
                return { data: filtered.slice(0, count), error: null }
              },
            }
          },
          order: (column: string, options: any) => {
            const sorted = [...data].sort((a, b) => {
              const aVal = a[column] || ''
              const bVal = b[column] || ''
              if (options.ascending === false) {
                return bVal > aVal ? 1 : -1
              }
              return aVal > bVal ? 1 : -1
            })
            return {
              limit: async (count: number) => {
                return { data: sorted.slice(0, count), error: null }
              },
            }
          },
          limit: async (count: number) => {
            return { data: data.slice(0, count), error: null }
          },
        }
        return queryBuilder
      },
      insert: async (data: any[]) => {
        if (table === 'profiles') {
          LocalDB.createProfile(data[0])
          return { data: null, error: null }
        }
        if (table === 'collab_posts' || table === 'iniciativas') {
          LocalDB.createPost(data[0])
          return { data: null, error: null }
        }
        if (table === 'messages') {
          LocalDB.createMessage(data[0])
          return { data: null, error: null }
        }
        if (table === 'comments' || table === 'comentarios') {
          LocalDB.createComment(data[0])
          return { data: null, error: null }
        }
        if (table === 'participants' || table === 'iniciativa_participante') {
          LocalDB.addParticipant(data[0])
          return { data: null, error: null }
        }
        return { data: null, error: null }
      },
      update: (updates: any) => ({
        eq: async (column: string, value: any) => {
          if (table === 'profiles') {
            LocalDB.updateProfile(value, updates)
            return { data: null, error: null }
          }
          return { data: null, error: null }
        },
      }),
    }
  },
}

// Initialize with seed data on first load (client-side only)
if (typeof window !== 'undefined') {
  // Check if posts exist, if not, seed them
  const posts = LocalDB.getPosts()
  const seeded = localStorage.getItem('db_seeded')
  
  if (!seeded || posts.length === 0) {
    const mockUsers = [
      { user_id: 'u1', id: 'profile_u1', display_name: 'Alex', role: 'developer', skills: ['react', 'typescript', 'aws'], bio: 'Full-stack developer passionate about building scalable web applications.' },
      { user_id: 'u2', id: 'profile_u2', display_name: 'Maya', role: 'founder', skills: ['healthcare', 'product', 'research'], bio: 'Healthcare entrepreneur building the future of patient care.' },
      { user_id: 'u3', id: 'profile_u3', display_name: 'Ravi', role: 'developer', skills: ['python', 'fastapi', 'ml'], bio: 'ML engineer specializing in backend systems and AI applications.' },
      { user_id: 'u4', id: 'profile_u4', display_name: 'Lina', role: 'product_designer', skills: ['figma', 'ux', 'product'], bio: 'Product designer focused on creating intuitive user experiences.' },
    ]
    mockUsers.forEach(user => LocalDB.createProfile(user))
    
    // Seed 5 mock posts with different personas
    const mockPosts = [
      {
        author_id: 'u2',
        title: 'Healthcare App MVP - Need React Developer',
        description: 'Looking for an experienced React developer to join our healthcare startup. We\'re building a patient management platform and need someone who can work with TypeScript, React Query, and modern UI libraries. This is a paid project with equity options.',
        tipo: 'PROYECTO',
        role_needed: 'developer',
        skills_required: ['react', 'typescript', 'healthcare'],
        estado: 'VALIDANDO',
      },
      {
        author_id: 'u1',
        title: 'Open Source Design System - Designers Welcome',
        description: 'I\'m starting an open-source design system for healthcare applications. Looking for product designers who are passionate about accessibility and healthcare UX. This is a collaborative project where we can all contribute and learn together.',
        tipo: 'IDEA',
        role_needed: 'product_designer',
        skills_required: ['figma', 'ux', 'accessibility'],
        estado: 'BORRADOR',
      },
      {
        author_id: 'u3',
        title: 'AI-Powered Analytics Platform - Backend Engineer Needed',
        description: 'Building a machine learning platform for business analytics. Need a Python/FastAPI developer who has experience with ML pipelines, data processing, and API design. Remote work, flexible hours, competitive rate.',
        tipo: 'PROYECTO',
        role_needed: 'developer',
        skills_required: ['python', 'fastapi', 'ml', 'aws'],
        estado: 'EN_EJECUCION',
      },
      {
        author_id: 'u4',
        title: 'SaaS Product - Product Manager Collaboration',
        description: 'Early-stage SaaS product looking for a product manager to help define roadmap and user stories. We have a working MVP and need someone to help prioritize features and work with our dev team. Equity-based opportunity.',
        tipo: 'IDEA',
        role_needed: 'product_manager',
        skills_required: ['product', 'roadmap', 'agile'],
        estado: 'VALIDANDO',
      },
      {
        author_id: 'u1',
        title: 'DevOps Infrastructure Setup - AWS Expert',
        description: 'Need help setting up CI/CD pipelines and cloud infrastructure for a new project. Looking for someone with AWS, Docker, and Kubernetes experience. This could lead to a full-time role if the project succeeds.',
        tipo: 'PROYECTO',
        role_needed: 'devops',
        skills_required: ['aws', 'docker', 'kubernetes', 'ci/cd'],
        estado: 'BORRADOR',
      },
    ]
    mockPosts.forEach(post => LocalDB.createPost(post))
    
    localStorage.setItem('db_seeded', 'true')
  }
}

