import NavBar from './NavBar'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

function App() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()

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
  return (
    <>
      <div className="app">
        <h1 className="text-3xl font-bold underline">
          Fullstack Boilerplate - with Fruits!
        </h1>
        <NavBar />
      </div>
      <Link to="/userForm">
        <button>Profile Information</button>
      </Link>
    </>
  )
}

export default App
