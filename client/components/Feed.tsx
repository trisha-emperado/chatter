import AllPosts from './AllPosts'

const Feed = () => {
  return (
    <div className="feedBox">
      <div className="feedNavBox">
        <p className="feedTitle">Feed</p>
        <div className="feedFilters">
          <p className="allPosts">All Posts</p>
          <p className="friendsPosts">Friends Posts</p>
        </div>
      </div>
      <div className="postsAndForm">
        <div className="postsBox">
          <AllPosts />
        </div>
      </div>
    </div>
  )
}

export default Feed
