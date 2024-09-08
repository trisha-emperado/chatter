import { useParams } from "react-router-dom";
import { useState } from "react";
import { usePostDetails } from "../hooks/usePosts";
import { useToggleLike } from "../hooks/usePosts";
import { useDeletePost } from "../hooks/usePosts";
import { useAddComment } from "../hooks/useComments";
import { useAuth0 } from "@auth0/auth0-react";

export default function PostDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: post, isPending, isError } = usePostDetails(Number(id));
  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [hasLiked, setHasLiked] = useState(false);
  const { likePost, unlikePost, isLiking, isUnliking } = useToggleLike(Number(id));
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
  const { mutate: addComment, isPending: isCommenting } = useAddComment(Number(id));

  const { user } = useAuth0();
  const currentUser = user?.sub;

  const handleLikeToggle = () => {
    if (hasLiked) {
      unlikePost();
      setHasLiked(false);
    } else {
      likePost();
      setHasLiked(true);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentContent.trim()) {
      addComment(commentContent, {
        onSuccess: () => {
          setCommentContent('');
          setIsCommentFormVisible(false);
        },
        onError: () => {
          alert('Failed to add comment.');
        }
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(Number(id), {
        onSuccess: () => {
          alert('Post deleted');
        },
        onError: () => {
          alert('Failed to delete the post.');
        },
      });
    }
  };

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error loading post</p>;

  const commentForm = () => {
    setIsCommentFormVisible(!isCommentFormVisible);
  };


  return (
    <div>
      <div className="post-profile-picture">
        {post.profile_picture_url && (
          <img
            src={post.profile_picture_url}
            alt={`${post.username}'s profile`}
          />
        )}
        <p>{post.username}</p>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
      </div>
      <div>
        <p>Likes: {post.likes}</p>
        <button onClick={handleLikeToggle} disabled={isLiking || isUnliking}>
          {hasLiked ? 'Unlike' : 'Like'}
        </button>
        <button onClick={commentForm}>
          {isCommentFormVisible ? 'Cancel' : 'Comment'}
        </button>

        {currentUser === String(post.user_id) && (
          <button onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete Post'}
          </button>
        )}
      </div>

      {isCommentFormVisible && (
        <div>
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
        </div>
      )}
    </div>
  );
}