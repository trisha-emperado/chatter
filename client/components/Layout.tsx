import { Outlet } from 'react-router-dom'
import Navbar from './NavBar'

export default function Layout() {
  return (
    <>
      <div className="chatterIconPicture">
        <img
          src="../../images/chatterIcon.png"
          alt="Chatter Icon"
          className="chatterIcon"
        />
      </div>
      <Navbar />
      <div className="content">
        <Outlet />
      </div>
    </>
  )
}
