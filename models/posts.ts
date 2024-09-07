export interface Post {
  id: number
  user_id: number
  content: string
  image_url: string
  file_url: string
  likes: number
  created_at: Date
}

export interface PostData {
  content: string
  image_url?: string
  file_url?: string
}
