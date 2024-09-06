import FeedForm from './FeedForm'

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
      <div className="postsBox"></div>
      <div className="feedFormBox">
        <FeedForm />
      </div>
    </div>
  )
}

export default Feed
