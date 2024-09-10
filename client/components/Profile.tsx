import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import UserForm from './UserForm'
import { useUsersByID } from '../hooks/useUsers'
import { useAuth0 } from '@auth0/auth0-react'
import { useDeleteUser } from '../hooks/useUsers'
import { useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { post } from 'superagent'
import request from 'superagent'
import { PostAndUser } from '../../models/posts'
import { Link } from 'react-router-dom'
import { usePostDetails, useToggleLike, useDeletePost } from '../hooks/usePosts'
import CommentForm from './CommentForm'
import { useLikesByPostId } from '../hooks/useLikes'
import { useUserByAuthId } from '../hooks/useUsers'

function Profile() {
  const { id } = useParams()
  const userID = Number(id)
  const navigate = useNavigate()
  const { data: user, isPending, isError } = useUsersByID(userID)
  const [editUser, setEditUser] = useState(false)
  const [inputDisplay, setInputDisplay] = useState(false)
  const [displayComments, setDisplayComments] = useState<Set<number>>(new Set())
  const [activeSection, setActiveSection] = useState('aboutMe')
  const postID = Number(id)
  const [commentVisibility, setCommentVisibility] = useState<{
    [key: number]: boolean
  }>({})
  const [likedPosts, setLikedPosts] = useState<{ [key: number]: boolean }>({})
  const { likePost, unlikePost, isLiking, isUnliking } = useToggleLike(postID)
  const { data: likes } = useLikesByPostId(postID)
  const {
    user: authUser,
    getAccessTokenSilently,
    logout,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth0()
  const { data: userData } = useUserByAuthId(authUser?.sub || '')

  const deleteMutation = useDeleteUser()
  const queryClient = useQueryClient()

  const [isFollowing, setIsFollowing] = useState(false)
  const [header, setHeader] = useState(
    '/public/images/wallhpuuuurpaven-g7vxoe.jpg',
  )

  const handleAboutMeClick = () => {
    setActiveSection('aboutMe')
  }

  const handleMyPostsClick = () => {
    setActiveSection('myPosts')
  }

  const { data } = useQuery({
    queryKey: ['posts', user?.auth_id],
    queryFn: async () => {
      if (user?.auth_id) {
        return await request
          .get(`/api/v1/posts/users/${user.id}/posts`)
          .then((res) => res.body)
      }
      return []
    },
  })

  const toggleComments = (postId: number) => {
    setCommentVisibility((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }))
  }

  const handleLikeToggle = async (postId: number) => {
    const token = await getAccessTokenSilently()
    if (likedPosts[postId]) {
      unlikePost({ postId, userId: userData?.id ?? 0, token })
      setLikedPosts((prev) => ({ ...prev, [postId]: false }))
      queryClient.invalidateQueries({ queryKey: ['likes'] })
    } else {
      likePost({ postId, userId: userData?.id ?? 0, token })
      setLikedPosts((prev) => ({ ...prev, [postId]: true }))
    }
  }

  const checkIfLiked = (postId: number) => {
    return (
      likedPosts[postId] ||
      likes?.some(
        (like) => like.post_id === postId && like.user_id === userData?.id,
      )
    )
  }

  const handleDeletePost = async (postId: number) => {
    try {
      const token = await getAccessTokenSilently()
      deleteMutation.mutate({ id: postId, token })
      navigate('/feed')
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getAccessTokenSilently()
      const url = `/api/v1/users/${userID}/profile/edit`
      console.log('PATCH URL:', url)
      console.log('Payload:', { header_image_url: header })
      await request
        .patch(url)
        .set('Authorization', `Bearer ${token}`)
        .send({ header_image_url: header })
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
      console.log('Header set successfully!')
    },
    onError: (error) => {
      console.error('Error updating header:', error)
      throw error
    },
  })

  //Check if logged-in user is following this profile
  useEffect(() => {
    const checkFollowingStatus = async () => {
      if (authUser && user) {
        try {
          const response = await fetch(
            `/api/v1/followers/isFollowing?follower_id=${authUser.sub}&following_id=${user.auth_id}`,
          )
          const data = await response.json()
          setIsFollowing(data.isFollowing)
        } catch (err) {
          console.error('Error checking following status', err)
        }
      }
    }
    checkFollowingStatus()
  }, [authUser, user])

  if (isAuthLoading) {
    return <div>Loading authentication...</div>
  }

  if (isPending) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error fetching your feed...</div>
  }

  if (!userID) {
    return <UserForm />
  }

  if (editUser) {
    return <UserForm userID={id} isEditing={true} />
  }

  if (!isAuthenticated) {
    navigate('/signinfirst')
    return null
  }

  // HANDLE FOLLOW
  const handleFollow = async () => {
    try {
      await fetch('/api/v1/followers/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          follower_id: authUser?.sub,
          following_id: user.auth_id,
        }),
      })
      setIsFollowing(true)
    } catch (err) {
      console.error('Error following user', err)
    }
  }

  // HANDLE UNFOLLOW
  const handleUnfollow = async () => {
    try {
      await fetch('/api/v1/followers/unfollow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          follower_id: authUser?.sub,
          following_id: user.auth_id,
        }),
      })
      setIsFollowing(false)
    } catch (err) {
      console.error('Error unfollowing user', err)
    }
  }

  //HANDLE EDIT PROFILE
  const handleEditProfile = () => {
    setEditUser(true)
  }

  const handleDeleteAccount = async () => {
    try {
      const token = await getAccessTokenSilently()
      deleteMutation.mutate({ id: userID, token })
      logout()
    } catch (error) {
      console.error('Error deleting account:', error)
    }
  }

  const handleHeaderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setHeader(event.target.value)
  }

  const handleSubmitHeader = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    mutation.mutate()
    setInputDisplay(false)
  }

  if (editUser) {
    return <UserForm userID={id} isEditing={true} />
  }

  if (!isAuthenticated) {
    navigate('/signinfirst')
    return null
  }

  return (
    <>
      <div className="Home">
        <div className="homeContainer">
          <div className="navBar01">
            <NavBar />
          </div>
          <div className="feed023">
            <div className="ProfilePage">
              <div className="profileContainer">
                <div className="profileTop">
                  <div
                    className="profileTopBox"
                    style={{
                      backgroundImage: `url(${user?.header_image_url ? user.header_image_url : header})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <button
                      className="changeHeaderButton"
                      onClick={() => setInputDisplay(true)}
                    >
                      Change Header{' '}
                      {inputDisplay && (
                        <div className="headerInputBox">
                          <form onSubmit={handleSubmitHeader}>
                            <input
                              type="text"
                              value={header}
                              onChange={handleHeaderChange}
                              className="headerInputZ"
                            />
                            <button
                              type="submit"
                              className="headerSubmit"
                            ></button>
                          </form>
                        </div>
                      )}
                    </button>

                    <h2 className="profileUserName">{user.username}</h2>
                    <div className="profilePictureBox">
                      <img
                        src={user.profile_picture_url}
                        alt={user.name}
                        className="profilePicture"
                      />
                    </div>
                  </div>
                </div>
                <div className="profileNavs">
                  <div className="nav001">
                    {authUser && authUser.sub === user.auth_id ? (
                      <>
                        <button className="DN PN" onClick={handleEditProfile}>
                          Edit
                        </button>
                        <button
                          className="deleteUserButton DN PN"
                          onClick={handleDeleteAccount}
                        >
                          Delete Account
                        </button>
                      </>
                    ) : isFollowing ? (
                      <button className="unfollowBut" onClick={handleUnfollow}>
                        Following
                      </button>
                    ) : (
                      <button className="followBut" onClick={handleFollow}>
                        Follow
                      </button>
                    )}
                  </div>
                  <div className="nav002">
                    {' '}
                    <button
                      className={`aboutMeButton PN ${activeSection === 'aboutMe' ? 'active' : ''}`}
                      onClick={handleAboutMeClick}
                    >
                      About Me
                    </button>
                    <button
                      className={`myPostsButton PN ${activeSection === 'myPosts' ? 'active' : ''}`}
                      onClick={handleMyPostsClick}
                    >
                      My Posts
                    </button>
                    <a
                      href={user.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        className="githubLogo"
                        src="https://w7.pngwing.com/pngs/646/324/png-transparent-github-computer-icons-github-logo-monochrome-head-thumbnail.png"
                        alt="github logo"
                      />
                    </a>
                  </div>
                </div>

                {/* Conditionally render the active section */}
                {activeSection === 'myPosts' && (
                  <div className="myPostsBox">
                    {data?.map((post: PostAndUser) => (
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
                              <p>{post.content}</p>
                            </div>
                            <div className="postDetailsBox">
                              <p className="postDetail hideShowLike">
                                {new Date(post.created_at).toLocaleDateString()}
                              </p>
                              {post.image_url && (
                                <img src={post.image_url} alt="Post" />
                              )}
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
                              <button
                                className="hideShowLike"
                                onClick={() => toggleComments(post.id)}
                              >
                                {commentVisibility[post.id]
                                  ? 'Hide Comments'
                                  : 'Show Comments'}
                              </button>
                            </div>
                            {commentVisibility[post.id] && (
                              <>
                                {isAuthenticated && (
                                  <CommentForm
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
                                        <p className="commentUsername">
                                          {comment.username}
                                        </p>
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
                            {authUser && authUser.sub === post.auth_id && (
                              <button onClick={() => handleDeletePost(post.id)}>
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === 'aboutMe' && (
                  <div className="profileInformation">
                    <div className="profileInput">
                      <div className="InfoBackground">
                        <p className="titleNav">Name </p>
                        <div className="informationBox">
                          <p>{user.name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="profileInput">
                      <div className="InfoBackground">
                        <p className="titleNav">Age </p>
                        <div className="informationBox">
                          <p>{user.age}</p>
                        </div>
                      </div>
                    </div>
                    <div className="profileInput">
                      <div className="InfoBackground">
                        <p className="titleNav">Role </p>
                        <div className="informationBox">
                          <p>{user.current_role}</p>
                        </div>
                      </div>
                    </div>
                    <div className="profileInput">
                      <div className="InfoBackground">
                        <p className="titleNav">Cohort </p>
                        <div className="informationBox">
                          <p>{user.cohort}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
