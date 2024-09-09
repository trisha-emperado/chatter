import { useCommentsByPostId } from '../hooks/useComments'
import { DetailedComment } from '../../models/comments';

interface CommentsListProps {
  postId: number;
}

export default function CommentsList({ postId }: CommentsListProps) {
  const { data, isLoading, error } = useCommentsByPostId(postId);

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return <div>Error loading comments</div>;
  }

  const comments = data as DetailedComment[];

  return (
    <div>
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id}>
            <img
              src={comment.profile_picture_url}
              alt={comment.username}
            />
            <div>
              <strong>{comment.username}</strong>
              <p>{comment.content}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No comments yet</p>
      )}
    </div>
  );
}
