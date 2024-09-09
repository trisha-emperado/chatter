import { useQuery } from '@tanstack/react-query'
import request from 'superagent'
import { PostAndUser } from '../../models/posts'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const AllPosts = () => {
  const [displayComments, setDisplayComments] = useState<Set<number>>(new Set())

  const { data, isPending, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await request.get('/api/v1/posts')
      return response.body as PostAndUser[]
    },
  })

  if (isPending) return <div>Loading posts</div>
  if (isError) return <div>Error loading posts</div>

  const toggleComments = (postId: number) => {
    setDisplayComments((prev) => {
      const newDisplayComments = new Set(prev)
      if (newDisplayComments.has(postId)) {
        newDisplayComments.delete(postId)
      } else {
        newDisplayComments.add(postId)
      }
      return newDisplayComments
    })
  }

  return (
    <div className="postsComp">
      {data?.map((post: PostAndUser) => (
        <div key={post.id} className="postsContainer">
          <div className="postsCard">
            <div className="postNav">
              <img
                src={post.profile_picture_url}
                alt="profile pic"
                className="postUserImg"
              />
              <Link to={`/user/${post.user_id}`}>
                <p className="postUsername">{post.username}</p>
              </Link>
            </div>
            <div className="postContentBox">
              <p>{post.content}</p>
            </div>
            <div className="postDetailsBox">
              <p className="postDetail">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
              {post.image_url && <img src={post.image_url} alt="Post" />}
              <p className="postDetail">Likes: {post.likes}</p>
              <button
                className="showCommentButton"
                onClick={() => toggleComments(post.id)}
              >
                {displayComments.has(post.id)
                  ? 'Hide Comments'
                  : 'Show Comments'}
              </button>
            </div>
            {displayComments.has(post.id) &&
              post.comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="commentNav">
                    <img
                      src={comment.profile_picture_url}
                      alt="commenter pic"
                      className="commentUserImg"
                    />
                  </div>
                  <div className="commentContentBox">
                    <p className="commentUsername">{comment.username}</p>
                    <p className="commentContent">{`${comment.content} ✦ ${new Date(comment.created_at).toLocaleDateString()}`}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AllPosts
