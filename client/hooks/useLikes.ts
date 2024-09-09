import { useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '../apis/apiClient'

export function useLikesByPostId(postId: number) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['likes', postId],
    queryFn: () => api.getLikesByPostId(postId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes'], postId })
    },
  })
}
