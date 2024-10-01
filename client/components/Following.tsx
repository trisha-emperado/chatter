import { useAuth0 } from '@auth0/auth0-react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import request from 'superagent'
import { User } from '../../models/users'

function Following() {
  const { user } = useAuth0()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['followers', user?.sub],
    queryFn: async () => {
      const response = await request
        .get('/api/v1/users')
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
      <div className="followerHeader">Find Users</div>
      <div className="followersBox">
        {data?.map((user: User) => (
          <div key={user.id} className="following">
            <img
              className="followImage"
              src={
                user.profile_picture_url ||
                'https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg'
              }
              alt={user.username}
              onError={(e) =>
                (e.currentTarget.src =
                  'https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg')
              }
            />
            <Link to={`/user/${user.id}`}>
              <p className="followTitle">{user.username}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Following
