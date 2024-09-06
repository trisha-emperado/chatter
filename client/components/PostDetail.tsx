import { usePostDetails } from "../hooks/usePostDetails";
import { useParams } from "react-router-dom";


export default function PostDetails() {
  const { id } = useParams<{ id: string }>()
  const { data: post, isPending, isError } = usePostDetails(Number(id))

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error loading session</p>;


  return (
    <div>
      <p>User ID: {post.user_id}</p>
      <p>Likes: {post.likes}</p>
      <p>Content: {post.content}</p>
      <p>Created At: {new Date(post.created_at).toLocaleString()}</p>
    </div>
  )
}

