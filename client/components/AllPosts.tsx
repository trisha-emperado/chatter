import { useQuery } from '@tanstack/react-query'
import request from 'superagent'
import { PostAndUser } from '../../models/posts'
import Loading from './Loading'

const AllPosts = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await request.get('/api/v1/posts')
      return response.body as PostAndUser[]
    },
  })

  if (isPending) return <Loading />
  if (isError) return <div>Error loading posts</div>

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
              <p className="postUsername"> {post.username}</p>
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
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AllPosts
