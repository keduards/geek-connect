// Database types matching Supabase schema

export type Role = 'developer' | 'product_manager' | 'product_designer' | 'qa' | 'devops' | 'founder'

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export type MatchStatus = 'pending' | 'accepted' | 'rejected'

export type ProjectType = 'looking_for_team' | 'looking_to_join' | 'collaboration_opportunity'

export type PostStatus = 'open' | 'closed' | 'in_progress'

export interface Profile {
  id: string
  role: Role
  goals: string | null
  availability: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  category: string | null
  created_at: string
}

export interface UserSkill {
  id: string
  user_id: string
  skill_id: string
  level: SkillLevel | null
  created_at: string
}

export interface Match {
  id: string
  user1_id: string
  user2_id: string
  status: MatchStatus
  matched_at: string
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  read: boolean
  created_at: string
}

export interface Post {
  id: string
  author_id: string
  title: string
  description: string
  project_type: ProjectType
  status: PostStatus
  created_at: string
  updated_at: string
}

// Extended types with relations
export interface ProfileWithSkills extends Profile {
  skills?: (UserSkill & { skill: Skill })[]
}

export interface MatchWithProfiles extends Match {
  user1?: Profile
  user2?: Profile
}

export interface MessageWithProfiles extends Message {
  sender?: Profile
  receiver?: Profile
}

export interface PostWithAuthor extends Post {
  author?: Profile
}

