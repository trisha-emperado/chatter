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
      <div className="postsAndForm">
        <div className="postsBox">Posts go here!</div>
        <div className="feedFormBox">
          <FeedForm />
        </div>
      </div>
    </div>
  )
}

export default Feed
