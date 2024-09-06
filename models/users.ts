export interface User {
  id?: number
  username: string
  name: string
  current_role: string
  age: number
  profile_picture_url: string
  cohort: string
  facilitator: boolean
  github_url: string
  auth_id: string | undefined
}
