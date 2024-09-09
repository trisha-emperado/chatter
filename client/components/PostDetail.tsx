import { useParams } from "react-router-dom";
import { useState } from "react";
import { usePostDetails } from "../hooks/usePosts";
import { useToggleLike } from "../hooks/usePosts";
import { useDeletePost } from "../hooks/usePosts";
import { useAuth0 } from "@auth0/auth0-react";
import CommentForm from "./CommentForm";
import { useLikesByPostId } from '../hooks/useLikes'
import { useUserByAuthId } from '../hooks/useUsers'
import { useNavigate } from "react-router-dom";

export default function PostDetails() {
  const { id } = useParams<{ id: string }>()
  const postID = Number(id)
  const { data: post, isPending, isError } = usePostDetails(Number(id));
  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const { likePost, unlikePost, isLiking, isUnliking } = useToggleLike(Number(id));
  const deleteMutation = useDeletePost();
  const navigate = useNavigate()
  const { user: authUser, getAccessTokenSilently, isAuthenticated } = useAuth0()
  const { data: likes } = useLikesByPostId(postID)
  const { data: userData } = useUserByAuthId(authUser?.sub || '')

  const handleLikeToggle = async () => {
    const token = await getAccessTokenSilently()
    if (hasLiked) {
      unlikePost({ postId: postID, userId: userData?.id ?? 0, token })
      setHasLiked(false)
    } else {
      likePost({ postId: postID, userId: userData?.id ?? 0, token })
      setHasLiked(true)
    }
  }

  const checkIfLiked = () => {
    if (hasLiked && likes?.find((like) => like.user_id === userData?.id)) {
      return true
    }

    return false
  }

  const handleDeletePost = async () => {
    try {
      const token = await getAccessTokenSilently()
      deleteMutation.mutate({ id: postID, token })
    } catch (error) {
      console.error('Error deleting post:', error)
    }
    navigate('/feed')
  }

  if (isPending) return <p>Loading...</p>
  if (isError) return <p>Error loading post</p>

  const commentForm = () => {
    setIsCommentFormVisible(!isCommentFormVisible)
  }

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
        <p>Likes: {likes?.length}</p>
        <button onClick={handleLikeToggle} disabled={isLiking || isUnliking}>
          {checkIfLiked() ? 'Unlike' : 'Like'}
        </button>
        {isAuthenticated && (
          <button onClick={commentForm}>
            {isCommentFormVisible ? 'Cancel' : 'Comment'}
          </button>
        )}

        {authUser && authUser.sub === post.auth_id && (
          <button onClick={handleDeletePost}>Delete</button>
        )}
      </div>

      {isCommentFormVisible && (
        <CommentForm
          postId={Number(id)}
          userId={Number(id)}
        />
      )}
    </div>
  )
}
