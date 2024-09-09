import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addComment } from '../apis/apiClient'

export function useAddComment(postId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (content: string) => addComment(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })
}
