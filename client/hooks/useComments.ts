import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { CommentData } from '../../models/comments'
import * as api from '../apis/apiClient'

export function useAddComment() {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  return useMutation({
    mutationFn: async (newComment: CommentData) => {
      const token = await getAccessTokenSilently()
      return api.addComment(newComment, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })
}

export function useCommentsByPostId(postId: number) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => api.getCommentsByPostId(postId),
  })
}
