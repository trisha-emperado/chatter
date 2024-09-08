import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import UserForm from './UserForm'
import { useUserByAuthId } from '../hooks/useUsers'
import { Outlet } from 'react-router-dom'

function App() {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0()

  useEffect(() => {
    if (isAuthenticated) {
      const fetchToken = async () => {
        try {
          const token = await getAccessTokenSilently()
          console.log('JWT Token:', token)
        } catch (error) {
          console.error('Error getting token:', error)
        }
      }

      fetchToken()
    }
  }, [isAuthenticated, getAccessTokenSilently])

  const { data: authUser } = useUserByAuthId(user?.sub || '')

  // if not authenticated and we dont have the user in the dabase then show the user form
  if (isAuthenticated && !authUser) {
    return <UserForm isEditing={false} />
  }

  return (
    <div className="app">
      {/* <div className="app">
        <h1 className="text-3xl font-bold underline">Welcome to Chatter!</h1>
      </div>
      <div className="chatterIconPicture">
        <img
          src="../../images/chatterIcon.png"
          alt="Chatter Icon"
          className="chatterIcon"
        />
      </div> */}
      <Outlet />
    </div>
  )
}

export default App
