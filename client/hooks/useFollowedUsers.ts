import { useQuery } from '@tanstack/react-query'
import { getFollowedUsers } from '../apis/apiClient'

export function useFollowedUsers(followerId: string) {
  return useQuery({
    queryKey: ['followedUsers', followerId],
    queryFn: () => getFollowedUsers(followerId),
    enabled: !!followerId,
  })
}
