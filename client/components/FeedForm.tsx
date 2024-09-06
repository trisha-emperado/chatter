import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { Post } from '../../models/posts'
import request from 'superagent'
import { useAuth0 } from '@auth0/auth0-react'

const FeedForm = () => {
  const [content, setContent] = useState('')

  const queryClient = useQueryClient()

  const { getAccessTokenSilently } = useAuth0()

  const mutation = useMutation({
    mutationFn: async (newPost: Partial<Post>) => {
      const token = await getAccessTokenSilently()

      if (!token) {
        throw new Error('No authentication token found')
      }

      await request
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(newPost)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutation.mutate({ content: content })
    setContent('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={handleChange} value={content} />
        <button type="submit"></button>
      </form>
    </div>
  )
}

export default FeedForm
