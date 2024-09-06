import { usePostDetails } from "../hooks/usePostDetails";
import { useParams } from "react-router-dom";

export default function PostDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: post, isPending, isError } = usePostDetails(Number(id));

  if (isPending) return <p>Loading...</p>;
  if (isError) return <p>Error loading post</p>;

  return (
    <div>
      <div>
        {post.profile_picture_url && (
          <img
            src={post.profile_picture_url}
            alt={`${post.username}'s profile`}
          />
        )}
        <p>Username: {post.username}</p>
      </div>
      <p>Likes: {post.likes}</p>
      <p>Content: {post.content}</p>
      <p>Created At: {new Date(post.created_at).toLocaleString()}</p>
    </div>
  );
}