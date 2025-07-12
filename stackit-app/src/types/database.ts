export interface Question {
    id: number
    title: string
    description: string
    tags: string[]
    votes: number
    views: number
    author: string
    created_at: string
    updated_at: string
    answers?: number
    timeAgo?: string
    isHot?: boolean
  }
  
  export interface Answer {
    id: number
    question_id: number
    content: string
    author: string
    votes: number
    is_accepted: boolean
    created_at: string
    updated_at: string
  }
  
  export interface Vote {
    id: number
    user_id: string
    question_id?: number
    answer_id?: number
    vote_type: number
    created_at: string
  }