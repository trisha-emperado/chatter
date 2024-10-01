import { useState } from 'react'
import { CommentData } from '../../models/comments'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import request from 'superagent'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'

const emptyCommentData: Omit<CommentData, 'user_id' | 'post_id'> = {
  content: '',
}

interface CommentFormProps {
  userId: number
  postId: number
  onCommentAdded: () => void
}

export default function CommentForm({
  userId,
  postId,
  onCommentAdded,
}: CommentFormProps) {
  const [newComment, setNewComment] = useState(emptyCommentData)
  const { content } = newComment
  const { getAccessTokenSilently } = useAuth0()

  const queryClient = useQueryClient()

  const { isError, isPending, refetch } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const response = await request.get(`/api/v1/comments/post/${postId}`)
      return response.body
    },
  })

  const addCommentMutation = useMutation({
    mutationFn: async (newComment: CommentData) => {
      const token = await getAccessTokenSilently()
      await request
        .post(`/api/v1/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send(newComment)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      onCommentAdded()
    },
  })

  useEffect(() => {
    if (addCommentMutation.isSuccess) {
      refetch()
    }
  }, [addCommentMutation.isSuccess, refetch])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    setNewComment({
      ...newComment,
      content: value,
    })
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const scrollPosition = window.scrollY

      await addCommentMutation.mutate({
        ...newComment,
        user_id: userId,
        post_id: postId,
      })

      window.scrollTo(0, scrollPosition)
      setNewComment(emptyCommentData)
    } catch (error) {
      console.error('Error creating comment:', error)
    }
  }

  return (
    <div className="makeCommentBox">
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={content}
          onChange={handleChange}
          placeholder="Write a comment..."
          className="commentInput"
          name="content"
        />
        <button
          className="makeCommentButton"
          type="submit"
          disabled={isPending}
        >
          {isPending ? 'Commenting...' : 'Comment'}
        </button>

        {isError && <p>Error creating comment</p>}
      </form>
    </div>
  )
}
