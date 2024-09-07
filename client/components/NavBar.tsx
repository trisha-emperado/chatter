import { IfAuthenticated, IfNotAuthenticated } from './Authenticated.tsx'
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'

function NavBar() {
  const { loginWithRedirect, logout, user } = useAuth0()

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
            <Link to="/userForm">
              <button className="profile-info-btn">{user?.nickname}</button>
            </Link>

            <Link to="/feed">
              <button className="feed-btn">News Feed</button>
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
