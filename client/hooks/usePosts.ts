import { useQuery } from '@tanstack/react-query'
import * as api from '../apis/apiClient'

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: api.getAllPosts,
  })
}
