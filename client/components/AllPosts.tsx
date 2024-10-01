import { useQuery, useQueryClient } from '@tanstack/react-query'
import request from 'superagent'
import { PostAndUser } from '../../models/posts'
import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useToggleLike, useDeletePost } from '../hooks/usePosts'
import { useAuth0 } from '@auth0/auth0-react'
import CommentForm from './CommentForm'
import { useUserByAuthId } from '../hooks/useUsers'
import LikesCounter from './LikeButtonAndCounter'

const AllPosts = ({ showFriendsPosts }: { showFriendsPosts: boolean }) => {
  const [commentVisibility, setCommentVisibility] = useState<{
    [key: number]: boolean
  }>({})

  // useEffect(() => {
  //   const storedVisibility = localStorage.getItem('commentVisibility')
  //   if (storedVisibility) {
  //     setCommentVisibility(JSON.parse(storedVisibility))
  //   }
  // }, [])

  const [likedPosts, setLikedPosts] = useState<{ [key: number]: boolean }>({})
  const { id } = useParams<{ id: string }>()
  const postID = Number(id)
  const { likePost, unlikePost } = useToggleLike(postID)
  const deleteMutation = useDeletePost()
  const navigate = useNavigate()
  const { user: authUser, getAccessTokenSilently, isAuthenticated } = useAuth0()
  const { data: userData } = useUserByAuthId(authUser?.sub || '')
  const queryClient = useQueryClient()

  const {
    data: posts,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['posts', 'comments'],
    queryFn: async () => {
      const response = await request.get('/api/v1/posts')
      return response.body as PostAndUser[]
    },
  })

  const { data: followedUsers } = useQuery({
    queryKey: ['followedUsers', authUser?.sub],
    queryFn: async () => {
      if (!authUser?.sub) return []
      const response = await request.get(
        `/api/v1/followers/following/${authUser.sub}`,
      )
      return response.body as { id: number }[]
    },
  })

  if (isPending) return <div>Loading posts</div>
  if (isError) return <div>Error loading posts</div>

  const filteredPosts = showFriendsPosts
    ? posts?.filter((post) =>
        followedUsers?.some((followed) => followed.id === post.user_id),
      )
    : posts

  const toggleComments = (postId: number) => {
    setCommentVisibility((prev) => {
      const newVisibility = !prev[postId]
      localStorage.setItem(
        'commentVisibility',
        JSON.stringify({
          ...prev,
          [postId]: newVisibility,
        }),
      )
      return {
        ...prev,
        [postId]: newVisibility,
      }
    })
  }

  const handleCommentAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['posts', 'comments'] })
  }

  const handleLikeToggle = async (postId: number, isAlreadyLiked: boolean) => {
    const token = await getAccessTokenSilently()

    if (isAlreadyLiked) {
      unlikePost({ postId, userId: userData?.id ?? 0, token })
      setLikedPosts((prev) => ({ ...prev, [postId]: false }))
      queryClient.invalidateQueries({ queryKey: ['likes'] })
    } else {
      likePost({ postId, userId: userData?.id ?? 0, token })
      setLikedPosts((prev) => ({ ...prev, [postId]: true }))
    }

    // if (likedPosts[postId]) {
    //   unlikePost({ postId, userId: userData?.id ?? 0, token })
    //   setLikedPosts((prev) => ({ ...prev, [postId]: false }))
    //   queryClient.invalidateQueries({ queryKey: ['likes'] })
    // } else {
    //   likePost({ postId, userId: userData?.id ?? 0, token })
    //   setLikedPosts((prev) => ({ ...prev, [postId]: true }))
    // }
  }

  const handleDeletePost = async (postId: number) => {
    try {
      const token = await getAccessTokenSilently()
      deleteMutation.mutate({ id: postId, token })
      navigate('/Home')
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  return (
    <div className="postsComp">
      {filteredPosts?.map((post: PostAndUser) => (
        <div key={post.id} className="postsContainer">
          <div className="postsCard">
            <div className="postBackground">
              <div className="postNav">
                <img
                  src={post.profile_picture_url}
                  alt="profile pic"
                  className="postUserImg"
                />
                <Link to={`/user/${post.user_id}`}>
                  <p className="postUsername">{post.username}</p>
                </Link>
              </div>
              <div className="postContentBox">
                <p className="contents">{post.content}</p>
              </div>
              <div className="postDetailsBox">
                <p className="postDetail hideShowLike">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                {post.image_url && <img src={post.image_url} alt="Post" />}
                <p className="postDetail">
                  <LikesCounter
                    postId={post.id}
                    likedPosts={likedPosts}
                    handleLikeToggle={handleLikeToggle}
                  />
                </p>
                <button
                  className="hideShowLike showC"
                  onClick={() => toggleComments(post.id)}
                >
                  {commentVisibility[post.id]
                    ? 'Hide Comments'
                    : 'Show Comments'}
                </button>
                {authUser && authUser.sub === post.auth_id && (
                  <button
                    className="postDetail deleteB"
                    onClick={() => handleDeletePost(post.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
              {commentVisibility[post.id] && (
                <>
                  {isAuthenticated && (
                    <CommentForm
                      onCommentAdded={handleCommentAdded}
                      postId={post.id}
                      userId={userData?.id ?? 0}
                    />
                  )}
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <div className="commentData">
                        <div className="commentNav">
                          <img
                            src={comment.profile_picture_url}
                            alt="commenter pic"
                            className="commentUserImg"
                          />
                          <p className="commentUsername">{comment.username}</p>
                        </div>
                        <div className="commentContentBox">
                          <img
                            src={comment.profile_picture_url}
                            alt="commenter pic"
                            className="commentUserImg imgx"
                          />
                          <div className="contentxBox">
                            <p className="commentContent">{`${comment.content} ✦ ${new Date(comment.created_at).toLocaleDateString()}`}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AllPosts
