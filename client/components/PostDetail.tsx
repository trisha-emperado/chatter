import { useQuery } from '@tanstack/react-query'
import request from 'superagent'
import { PostAndUser } from '../../models/posts'
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
import { Link } from "react-router-dom";

export default function PostDetails() {
  const { id } = useParams<{ id: string }>()
  const postID = Number(id)
  const { data } = usePostDetails(Number(id));
  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const { likePost, unlikePost, isLiking, isUnliking } = useToggleLike(Number(id));
  const deleteMutation = useDeletePost();
  const navigate = useNavigate()
  const { user: authUser, getAccessTokenSilently, isAuthenticated } = useAuth0()
  const { data: likes } = useLikesByPostId(postID)
  const { data: userData } = useUserByAuthId(authUser?.sub || '')
  const {
    data: posts,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await request.get('/api/v1/posts/')
      return response.body as PostAndUser[]
    },
  })
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
    navigate('/Home')
  }

  if (isPending) return <p>Loading...</p>
  if (isError) return <p>Error loading post</p>

  const commentForm = () => {
    setIsCommentFormVisible(!isCommentFormVisible)
  }

  return (
    <div className="postsComp">
      <div className="postsContainer">
        <div className="postsCard">
          <div className="postBackground">
            <div>
              {posts.profile_picture_url && (
                <img
                  src={posts.profile_picture_url}
                  alt="profile pic"
                  className="postUserImg"
                />
              )}
              <Link to={`/user/${post.user_id}`}>
                <p className="postUsername">{post.username}</p>
              </Link>
              <div className="postContentBox">
                <p>{post.content}</p>
              </div>
              <div className="postDetailsBox">
                <p className="postDetail hideShowLike">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                {post.image_url && <img src={post.image_url} alt="Post" />}
                <p className="postDetail">
                  <button
                    className="hideShowLike"
                    onClick={() => handleLikeToggle(post.id)}
                    disabled={isLiking || isUnliking}
                  >
                    {checkIfLiked(post.id) ? (
                      <img
                        className="heart"
                        src="https://www.freeiconspng.com/thumbs/heart-icon/valentine-heart-icon-6.png"
                        alt="heart"
                      />
                    ) : (
                      <img
                        className="heart"
                        src="https://freesvg.org/img/heart-15.png"
                        alt="heart"
                      />
                    )}
                    {post.likes}
                  </button>
                </p>
              </div>
              <div>
                {isAuthenticated && (
                  <button onClick={commentForm}>
                    {isCommentFormVisible ? 'Cancel' : 'Comment'}
                  </button>
                )}


              </div>

              {isCommentFormVisible && (
                <CommentForm
                  postId={Number(id)}
                  userId={Number(id)}
                />
              )}
              <br></br>
              {authUser && authUser.sub === post.auth_id && (
                <button className="sign-out" onClick={handleDeletePost}>Delete post</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
