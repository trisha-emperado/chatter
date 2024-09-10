import { useQuery } from '@tanstack/react-query'
import * as api from '../apis/apiClient'

export function useLikesByPostId(postId: number) {
  return useQuery({
    queryKey: ['likes', postId],
    queryFn: () => api.getLikesByPostId(postId),
  })
}
