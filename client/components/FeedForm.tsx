import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { Post } from '../../models/posts'
import request from 'superagent'
import { useAuth0 } from '@auth0/auth0-react'

const FeedForm = () => {
  const [content, setContent] = useState('')
  const { getAccessTokenSilently, user } = useAuth0() // Get user object

  console.log('Auth0 user:', user)

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (newPost: Partial<Post>) => {
      const token = await getAccessTokenSilently()

      if (!token) {
        throw new Error('No authentication token found')
      }

      // Include user_id and other fields
      const postData = {
        content: newPost.content,
        user_id: user?.sub, // Use user ID from Auth0
        // Add other fields if needed, e.g., image_url, file_url
      }

      await request
        .post('/api/v1/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(postData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
    onError: (error) => {
      console.error('Error creating post:', error)
    },
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutation.mutate({ content }) // Send content and other fields
    setContent('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={handleChange}
          value={content}
          placeholder="What's on your mind?"
        />
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Submitting...' : 'Submit'}
        </button>
        {mutation.isError && <p>Error submitting post. Please try again.</p>}
        {mutation.isSuccess && <p>Post submitted successfully!</p>}
      </form>
    </div>
  )
}

export default FeedForm
