import { useAuth0 } from '@auth0/auth0-react'
import { useFollowedUsers } from '../hooks/useFollowedUsers'
import { Link } from 'react-router-dom'

function Following() {
  const { user } = useAuth0()
  const {
    data: followedUsers,
    isPending,
    isError,
  } = useFollowedUsers(user?.sub || '')

  if (isPending) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error fetching followed users...</div>
  }

  return (
    <div className="followerContain">
      <div className="followerHeader">Friends list!</div>
      <div className="followersBox">
        {followedUsers.length > 0 ? (
          followedUsers.map(
            (user: {
              id: number
              username: string
              name: string
              profile_picture_url: string
            }) => (
              <div key={user.id} className="following">
                <img
                  className="followImage"
                  src={user.profile_picture_url}
                  alt={user.username}
                />
                <Link to={`/user/${user?.id}`}>
                  <p className="followTitle"> {user.username}</p>{' '}
                </Link>
              </div>
            ),
          )
        ) : (
          <p> You are not following anyone yet.</p>
        )}
      </div>
    </div>
  )
}

export default Following
