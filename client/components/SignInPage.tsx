import { IfAuthenticated, IfNotAuthenticated } from './Authenticated.tsx'
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'
import { useUserByAuthId } from '../hooks/useUsers.ts'

function SignInPage() {
  const { loginWithRedirect, logout, user } = useAuth0()
  const { data: userData } = useUserByAuthId(user?.sub || '')

  const handleSignOut = () => {
    logout()
  }

  const handleSignIn = () => {
    loginWithRedirect()
  }

  return (
    <div className="signInPageContainer">
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
        <div className="signInPageBox">
          <div className="chatterIconPicture">
            <img
              src="../../images/chatterIcon.png"
              alt="Chatter Icon"
              className="chatterIcon"
            />
          </div>
          <div className="signnBox">
            <h3>Lets get you signed in!</h3>
            <button className="signButtonn" onClick={handleSignIn}>
              Sign in
            </button>
          </div>
        </div>
      </IfNotAuthenticated>
    </div>
  )
}

export default SignInPage
