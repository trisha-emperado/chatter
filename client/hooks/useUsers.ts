import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import * as api from '../apis/apiClient'
import { User } from '../../models/users'

export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: api.getAllUsers })
}

export function useUsersByID(id: number) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => api.getUserByID(id),
  })
}

interface MutationData {
  userID?: number
  user: User
  token: string
}

export function useAddUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: MutationData) => api.addUser(data.user, data.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useEditUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: MutationData) =>
      api.editUser(data.user, data.userID, data.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
