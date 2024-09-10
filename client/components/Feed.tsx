import { useState } from 'react'
import AllPosts from './AllPosts'

const Feed = () => {
  const [showFriendsPosts, setShowFriendsPosts] = useState(false)

  return (
    <div className="feedBox">
      <div className="feedNavBox">
        <p className="feedTitle">Feed</p>
        <div className="feedFilters">
          <button
            className={`allPosts pf ${!showFriendsPosts ? 'active' : ''}`}
            onClick={() => setShowFriendsPosts(false)}
          >
            All Posts
          </button>
          <button
            className={`friendsPosts pf ${showFriendsPosts ? 'active' : ''}`}
            onClick={() => setShowFriendsPosts(true)}
          >
            Friends Posts
          </button>
        </div>
      </div>
      <div className="postsAndForm">
        <div className="postsBox">
          <AllPosts showFriendsPosts={showFriendsPosts} />
        </div>
      </div>
    </div>
  )
}

export default Feed
