import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import * as api from '../apis/apiClient'
import { User } from '../../models/user'

export function useUsers() {
  return useQuery({ queryKey: ['users'], queryFn: api.getAllUsers })
}

export function useAddUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: User) => api.addUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
