import { useAuth0 } from '@auth0/auth0-react'
import { useFollowedUsers } from '../hooks/useFollowedUsers'

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
    <>
      <h1 className="following-header">Following</h1>
      <ul>
        {followedUsers.length > 0 ? (
          followedUsers.map(
            (user: {
              id: number
              username: string
              name: string
              profile_picture_url: string
            }) => (
              <li key={user.id}>
                <img src={user.profile_picture_url} alt={user.username} />
                <p> {user.username}</p>
                <p> {user.name}</p>
              </li>
            ),
          )
        ) : (
          <p> You are not following anyone yet.</p>
        )}
      </ul>
    </>
  )
}

export default Following
