import AllPosts from './AllPosts'
import PostForm from './PostForm'

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
          <AllPosts />
        </div>
        <div className="feedFormBox">
          <PostForm />
        </div>
      </div>
    </div>
  )
}

export default Feed
