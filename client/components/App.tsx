import NavBar from './NavBar'
import Feed from './components/Feed.tsx'
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
      {/* <div className="app">
        <NavBar />
      </div> */}
    </>
  )
}

export default App
