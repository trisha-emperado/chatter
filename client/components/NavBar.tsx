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
        {user && (
          <div className="mainNavBox">
            <div className="navImageBox">
              <div className="navImages">
                <img
                  src={user?.picture}
                  alt="profile pic"
                  className="navImage"
                />
              </div>

              <p className="navText">Signed in as: {user?.given_name}</p>
              <p className="userEmail">{user?.email}</p>
            </div>
            <div className="navButtonsBox">
              <Link to="/feed">
                <button className="feed-btn btn">Feed</button>
              </Link>

              {/* <Link to={`/user/${user.sub}`}>
                <button className="my-profile-btn btn">My Profile</button>
              </Link> */}
              <Link to={`/userForm`}>
                <button className="my-profile-btn btn">My Profile</button>
              </Link>

              <button className="friends-btn btn">Friends</button>
            </div>
            <div className="signoutBox">
              <button className="sign-out" onClick={handleSignOut}>
                Sign out
              </button>
            </div>
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
