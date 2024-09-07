import { useState } from 'react';
import { Post } from '../../models/posts';
import { useNewPost } from '../hooks/usePosts';

const emptyPost: Post = {
  id: 0,
  user_id: 1,
  content: '',
  image_url: '',
  file_url: '',
  likes: 0,
  created_at: new Date(),
};

export default function PostForm() {
  const [newPost, setNewPost] = useState<Post>(emptyPost);
  const { content, image_url, file_url } = newPost;
  const { mutate: addPost, isPending, isError } = useNewPost();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPost({
      ...newPost,
      [name]: value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (content.trim() === '') {
      console.error('Invalid input: Content must be entered');
      return;
    }

    try {
      await addPost({
        id: 0,
        user_id: 1,
        content,
        image_url: image_url || '',
        file_url: file_url || '',
        likes: 0,
        created_at: new Date(),
      });
      console.log('New post submitted:', newPost);
      setNewPost(emptyPost);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="content">Post:</label>
        <textarea
          name="content"
          id="content"
          value={content}
          onChange={handleChange}
          placeholder="What's on your mind?"
          required
        />

        <label htmlFor="image_url">Image URL:</label>
        <input
          type="file"
          name="image_url"
          id="image_url"
          value={image_url}
          onChange={handleChange}
          placeholder="Image URL"
        />

        <label htmlFor="file_url">File URL:</label>
        <input
          type="file"
          name="file_url"
          id="file_url"
          value={file_url}
          onChange={handleChange}
          placeholder="File URL"
        />

        <button type="submit" disabled={content === '' || isPending}>
          {isPending ? 'Posting...' : 'Make Post'}
        </button>

        {isError && <p>Error creating post</p>}
      </form>
    </div>
  );
}
