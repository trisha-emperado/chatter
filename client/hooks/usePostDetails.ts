import { useQuery } from '@tanstack/react-query'
import * as api from '../apis/apiClient'

export function usePostDetails(id: number) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => api.getPost(id),
  })
}
