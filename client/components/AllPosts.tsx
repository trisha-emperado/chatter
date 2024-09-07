import { useQuery } from '@tanstack/react-query'
import request from 'superagent'
import { Post } from '../../models/posts'
import Loading from './Loading'

const AllPosts = () => {
  const { data, isPending, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await request.get('/api/v1/posts')
      return response.body
    },
  })

  if (isPending) return <Loading />
  if (isError) return <div>Error loading posts</div>

  return (
    <div>
      {data?.map((post: Post) => (
        <div key={post.id}>
          {post.content} {post.created_at}
          {post.image_url}
          {post.likes}
        </div>
      ))}
    </div>
  )
}

export default AllPosts
