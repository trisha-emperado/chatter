export interface Post {
  id: number
  user_id: number
  content: string
  image_url?: string
  file_url?: string
  likes: number
  comments: []
  created_at: string
}

export interface Comment {
  id: number
  user_id: number
  post_id: number
  content: string
  created_at: string
}
