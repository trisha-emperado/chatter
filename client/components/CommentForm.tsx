import { useState } from 'react';
import { useAddComment } from '../hooks/useComments';

interface CommentFormProps {
  postId: number;
  onSuccess: () => void;
  onError: () => void;
}

export default function CommentForm({ postId, onSuccess, onError }: CommentFormProps) {
  const [commentContent, setCommentContent] = useState('');
  const { mutate: addComment, isPending: isCommenting } = useAddComment(postId);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentContent.trim()) {
      addComment(commentContent, {
        onSuccess: () => {
          setCommentContent('');
          onSuccess();
        },
        onError,
      });
    }
  };

  return (
    <form onSubmit={handleCommentSubmit}>
      <textarea
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        placeholder="Write a comment..."
      />
      <button type="submit" disabled={isCommenting}>
        {isCommenting ? 'Commenting...' : 'Comment'}
      </button>
    </form>
  );
}
