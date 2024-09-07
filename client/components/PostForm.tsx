import { useState } from 'react';
import { PostData } from '../../models/posts';

const emptyPost: PostData = {
  content: '',
  image_url: '',
  file_url: '',
};

export default function PostForm() {
  const [newPost, setNewPost] = useState(emptyPost);

  const { content: addingContent, image_url: addingImageUrl, file_url: addingFileUrl } = newPost;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPost({
      ...newPost,
      [name]: value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (addingContent.trim() === '') {
      console.error('Invalid input: Content must be entered');
      return;
    }

    console.log('New post submitted:', newPost);

    setNewPost(emptyPost);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="content">Content:</label>
        <textarea
          name="content"
          id="content"
          value={addingContent}
          onChange={handleChange}
          placeholder="What's on your mind?"
          required
        />

        <label htmlFor="image_url">Image URL:</label>
        <input
          type="text"
          name="image_url"
          id="image_url"
          value={addingImageUrl}
          onChange={handleChange}
          placeholder="Image URL"
        />

        <label htmlFor="file_url">File URL:</label>
        <input
          type="text"
          name="file_url"
          id="file_url"
          value={addingFileUrl}
          onChange={handleChange}
          placeholder="File URL"
        />

        <button type="submit" disabled={addingContent === ''}>
          Post
        </button>
      </form>
    </div>
  );
}
