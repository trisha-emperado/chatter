import FeedForm from './FeedForm'
import AllPosts from './AllPosts'
import NavBar from './NavBar'
import UserForm from './UserForm'
import { Link } from 'react-router-dom'

const Feed = () => {
  return (
    <div className="feedBox">
      <div className="feedNavBox">
        <h3 className="feedTitle">Feed</h3>
        <div className="feedFilters">
          <p className="allPosts">All Posts</p>
          <p className="friendsPosts">Friends Posts</p>
        </div>
      </div>
      <div className="postsAndForm">
        <div className="postsBox">
          <NavBar />
          <AllPosts />
          <Link to="/userForm">User Form</Link>
        </div>
        <div className="feedFormBox">
          <FeedForm />
        </div>
      </div>
    </div>
  )
}

export default Feed
