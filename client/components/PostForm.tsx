import { useState } from 'react';
import { PostData } from '../../models/posts';
import { useNewPost } from '../hooks/usePosts';

const emptyPostData: PostData = {
  content: '',
  image_url: '',
  file_url: '',
};

export default function PostForm() {
  const [newPost, setNewPost] = useState(emptyPostData);
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

    try {
      await addPost(newPost);
      console.log('New post submitted:', newPost);
      setNewPost(emptyPostData);
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

        <label htmlFor="image">Image URL:</label>
        <input
          type="text"
          name="image_url"
          id="image"
          value={image_url}
          onChange={handleChange}
          placeholder="Image URL"
        />

        <label htmlFor="file">File URL:</label>
        <input
          type="text"
          name="file_url"
          id="file"
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
