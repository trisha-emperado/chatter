export interface Comment {
  id: number
  user_id: number
  post_id: number
  content: string
  created_at?: Date
}
export interface DetailedComment extends Comment {
  username: string
  profile_picture_url: string
  auth_id: string
}
export interface CommentData {
  user_id: number
  post_id: number
  content: string
}
