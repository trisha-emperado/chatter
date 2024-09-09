export interface Post {
  id: number
  user_id: string
  content: string
  image_url?: string
  file_url?: string
  likes?: number
  created_at: Date
}

export interface PostAndUser {
  id: number
  user_id: number
  content: string
  image_url: string
  file_url: string
  likes: number
  created_at: Date
  username: string
  profile_picture_url: string
  comments: Comment[]
}

export interface Comment {
  id: number
  user_id: number
  post_id: number
  content: string
  created_at: Date
  username: string
  profile_picture_url: string
}
export interface PostData {
  content: string
  image_url?: string
  file_url?: string
}
