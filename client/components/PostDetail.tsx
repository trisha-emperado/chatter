import { useParams } from "react-router-dom";
import { useState } from "react";
import { usePostDetails } from "../hooks/usePosts";
import { useToggleLike } from "../hooks/usePosts";

export default function PostDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: post, isPending, isError } = usePostDetails(Number(id));
  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const { likePost, unlikePost, isLiking, isUnliking } = useToggleLike(Number(id));

  const handleLikeToggle = () => {
    if (hasLiked) {
      unlikePost();
      setHasLiked(false);
    } else {
      likePost();
      setHasLiked(true);
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
      </div>

      {isCommentFormVisible && (
        <div>
          <form>
            <textarea
              placeholder="Write a comment..."
            />
            <button type="submit">Comment</button>
          </form>
        </div>
      )}
    </div>
  );
}