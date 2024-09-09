import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addComment } from '../apis/apiClient'
import { useAuth0 } from '@auth0/auth0-react'
import { CommentData } from '../../models/comments'

export function useAddComment() {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  return useMutation({
    mutationFn: async (newComment: CommentData) => {
      const token = await getAccessTokenSilently()
      return addComment(newComment, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })
}
