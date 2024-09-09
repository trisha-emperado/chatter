import { useParams } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import UserForm from './UserForm'
import { useUsersByID } from '../hooks/useUsers'
import { useAuth0 } from '@auth0/auth0-react'
import { useDeleteUser } from '../hooks/useUsers'
import { useNavigate } from 'react-router-dom'
import NavBar from './NavBar'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import request, { post } from 'superagent'
import { PostAndUser } from '../../models/posts'
import { Link } from 'react-router-dom'

function Profile() {
  const { id } = useParams()
  const userID = Number(id)
  const navigate = useNavigate()
  const { data: user, isPending, isError } = useUsersByID(userID)
  const [editUser, setEditUser] = useState(false)
  const [inputDisplay, setInputDisplay] = useState(false)
  const [displayComments, setDisplayComments] = useState<Set<number>>(new Set())
  const [activeSection, setActiveSection] = useState('aboutMe')

  const {
    user: authUser,
    getAccessTokenSilently,
    logout,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth0()

  const toggleComments = (postId: number) => {
    setDisplayComments((prev) => {
      const newDisplayComments = new Set(prev)
      if (newDisplayComments.has(postId)) {
        newDisplayComments.delete(postId)
      } else {
        newDisplayComments.add(postId)
      }
      return newDisplayComments
    })
  }

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
                      Change Header
                    </button>
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

                {/* Conditionally render the active section */}
                {activeSection === 'myPosts' && (
                  <div className="myPostsBox">
                    {data?.map((post: PostAndUser) => (
                      <div key={post.id} className="postsContainer">
                        <div className="postsCard">
                          <div className="postNav">
                            <img
                              src={user.profile_picture_url}
                              alt="profile pic"
                              className="postUserImg"
                            />
                            <Link to={`/user/${post.user_id}`}>
                              <p className="postUsername">{user.name}</p>
                            </Link>
                          </div>
                          <div className="postContentBox">
                            <p>{post.content}</p>
                          </div>
                          <div className="postDetailsBox">
                            <p className="postDetail">
                              {new Date(post.created_at).toLocaleDateString()}
                            </p>
                            {post.image_url && (
                              <img src={post.image_url} alt="Post" />
                            )}
                            <p className="postDetail">Likes: {post.likes}</p>
                            <button
                              className="showCommentButton"
                              onClick={() => toggleComments(post.id)}
                            >
                              {displayComments.has(post.id)
                                ? 'Hide Comments'
                                : 'Show Comments'}
                            </button>
                          </div>
                          {displayComments.has(post.id) &&
                            post.comments.map((comment) => (
                              <div key={comment.id} className="comment">
                                <div className="commentNav">
                                  <img
                                    src={comment.profile_picture_url}
                                    alt="commenter pic"
                                    className="commentUserImg"
                                  />
                                </div>
                                <div className="commentContentBox">
                                  <p className="commentUsername">
                                    {comment.username}
                                  </p>
                                  <p>{`${comment.content} ✦ ${new Date(comment.created_at).toLocaleDateString()}`}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === 'aboutMe' && (
                  <div className="profileInformation">
                    <div className="profileInput">
                      <p className="titleNav">Name </p>
                      <div className="informationBox">
                        <p>{user.name}</p>
                      </div>
                    </div>
                    <div className="profileInput">
                      <p className="titleNav">Age </p>
                      <div className="informationBox">
                        <p>{user.age}</p>
                      </div>
                    </div>
                    <div className="profileInput">
                      <p className="titleNav">Role </p>
                      <div className="informationBox">
                        <p>{user.current_role}</p>
                      </div>
                    </div>
                    <div className="profileInput">
                      <p className="titleNav">Cohort </p>
                      <div className="informationBox">
                        <p>{user.cohort}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* <div>
                  {authUser && authUser.sub === user.auth_id ? (
                    <>
                      <button onClick={handleEditProfile}>Edit</button>
                      <br></br>
                      <button
                        className="deleteUserButton"
                        onClick={handleDeleteAccount}
                      >
                        Delete Account
                      </button>
                    </>
                  ) : isFollowing ? (
                    <button onClick={handleUnfollow}>Unfollow</button>
                  ) : (
                    <button onClick={handleFollow}>Follow</button>
                  )}
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
