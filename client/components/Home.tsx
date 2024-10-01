import Feed from './Feed'
import NavBar from './NavBar'
import PostForm from './PostForm'
import SideBar from './SideBar'

const Home = () => {
  return (
    <div className="Home">
      <div className="homeContainer">
        <div className="navBar01">
          <NavBar />
        </div>
        <div className="feed02">
          <Feed />
        </div>
        <div className="sideBar03">
          <SideBar />
        </div>
      </div>
      <div className="feedFormBox">
        <PostForm />
      </div>
    </div>
  )
}

export default Home
