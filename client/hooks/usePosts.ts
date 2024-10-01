import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as api from '../apis/apiClient'
import { useAuth0 } from '@auth0/auth0-react'
import { PostData } from '../../models/posts'

interface DeletePostMutation {
  id: number
  token: string
}

interface LikeMutation {
  postId: number
  userId: number
  token: string
}

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
  const { getAccessTokenSilently } = useAuth0()
  return useMutation({
    mutationFn: async (newPost: PostData) => {
      const token = await getAccessTokenSilently()
      return api.addNewPost(newPost, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useToggleLike(postId: number) {
  const queryClient = useQueryClient()
  const likeMutation = useMutation({
    mutationFn: (data: LikeMutation) =>
      api.likePost(data.postId, data.userId, data.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes', postId] })
    },
  })

  const unlikeMutation = useMutation({
    mutationFn: (data: LikeMutation) =>
      api.unlikePost(data.postId, data.userId, data.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likes', postId] })
    },
  })

  return {
    likePost: likeMutation.mutate,
    unlikePost: unlikeMutation.mutate,
    isLiking: likeMutation.isPending,
    isUnliking: unlikeMutation.isPending,
  }
}

export function useDeletePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: DeletePostMutation) =>
      api.deletePost(data.id, data.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
