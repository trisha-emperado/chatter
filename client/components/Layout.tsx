import { IfAuthenticated, IfNotAuthenticated } from './Authenticated.tsx'
import SignInPage from './SignInPage.tsx'
import { Outlet } from 'react-router-dom'

function NavBar() {
  return (
    <div className="officalBox">
      <IfAuthenticated>
        <Outlet />
      </IfAuthenticated>
      <IfNotAuthenticated>
        <SignInPage />
      </IfNotAuthenticated>
    </div>
  )
}

export default NavBar
