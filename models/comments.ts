export interface Comment {
  id: number
  user_id: number
  post_id: number
  content: string
  created_at?: Date
}

export interface CommentData {
  user_id: number
  post_id: number
  content: string
}
