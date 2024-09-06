export interface Post {
  id: number
  user_id: number
  content: string
  image_url: string
  file_url: string
  likes: number
  comments: string[]
  created_at: string
}
