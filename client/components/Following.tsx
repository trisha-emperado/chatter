import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import request from 'superagent'

type FollowedUser = {
  id: number
  username: string
  profile_picture_url: string
}

function Following() {
  const { user } = useAuth0()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['followers', user?.sub],
    queryFn: async () => {
      const response = await request
        .get(`/api/v1/followers/following/${user?.sub}`)
        .then((res) => res.body)
      return response
    },
    enabled: !!user?.sub,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error fetching followed users...</div>
  }

  return (
    <div className="followerContain">
      <div className="followerHeader">Friends list!</div>
      <div className="followersBox">
        {data && data.length > 0 ? (
          data.map((user: FollowedUser) => (
            <div key={user.id} className="following">
              <img
                className="followImage"
                src={user.profile_picture_url}
                alt={user.username}
              />
              <Link to={`/user/${user.id}`}>
                <p className="followTitle">{user.username}</p>
              </Link>
            </div>
          ))
        ) : (
          <p className="not">You are not following anyone yet.</p>
        )}
      </div>
    </div>
  )
}

export default Following
