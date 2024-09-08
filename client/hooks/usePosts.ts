import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '../apis/apiClient'

export function usePostDetails(id: number) {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: () => api.getPost(id),
  })
}

export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: api.getAllPosts,
  })
}

export function useNewPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.addNewPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useToggleLike(postId: number) {
  const queryClient = useQueryClient()

  const likeMutation = useMutation({
    mutationFn: () => api.likePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] })
    },
  })

  const unlikeMutation = useMutation({
    mutationFn: () => api.unlikePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', postId] })
    },
  })

  return {
    likePost: likeMutation.mutate,
    unlikePost: unlikeMutation.mutate,
    isLiking: likeMutation.isPending,
    isUnliking: unlikeMutation.isPending,
  }
}
