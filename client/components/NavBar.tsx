import { IfAuthenticated, IfNotAuthenticated } from './Authenticated.tsx'
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'
import { useUserByAuthId } from '../hooks/useUsers'

function NavBar() {
  const { loginWithRedirect, logout, user } = useAuth0()
  const { data: userData } = useUserByAuthId(user?.sub || '')

  const handleSignOut = () => {
    logout()
  }

  const handleSignIn = () => {
    loginWithRedirect()
  }

  return (
    <>
      <IfAuthenticated>
        <button onClick={handleSignOut}>Sign out</button>
        {user && (
          <div>
            <img src={user?.picture} alt="profile pic" />
            <p>
              Signed in as: {user?.nickname} / {user?.given_name}
            </p>
            <p>Email: {user?.email}</p>

            <Link to={`/user/${userData?.id}`}>
              <button className="my-profile-btn">My Profile</button>
            </Link>

            <Link to="/feed">
              <button className="feed-btn">Feed</button>
            </Link>
          </div>
        )}
      </IfAuthenticated>
      <IfNotAuthenticated>
        <button onClick={handleSignIn}>Sign in</button>
      </IfNotAuthenticated>
    </>
  )
}

export default NavBar
