import React, { useState } from 'react';
import { useAddComment } from '../hooks/useComments';
import { CommentData } from '../../models/comments';

const emptyCommentData: Omit<CommentData, 'user_id' | 'post_id'> = {
  content: '',
};

interface CommentFormProps {
  userId: number;
  postId: number;
  onNewComment: (newComment: CommentData) => void;
}

export default function CommentForm({ userId, postId, onNewComment }: CommentFormProps) {
  const [newComment, setNewComment] = useState(emptyCommentData);
  const { content } = newComment;
  const { mutate: addComment, isPending, isError } = useAddComment();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setNewComment({
      ...newComment,
      content: value,
    });
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await addComment({
        ...newComment,
        user_id: userId,
        post_id: postId,
      });
      onNewComment(response); // Call onNewComment to update the parent component's state
      setNewComment(emptyCommentData);
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

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
  );
}
