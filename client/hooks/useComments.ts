import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addComment } from '../apis/apiClient'
import { useAuth0 } from '@auth0/auth0-react'

export function useAddComment(postId: number) {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  return useMutation({
    mutationFn: async (content: string) => {
      const token = await getAccessTokenSilently()
      return addComment(postId, content, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })
}
