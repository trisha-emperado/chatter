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
        <label htmlFor="content">Post:</label>
        <textarea
          name="content"
          id="content"
          value={addingContent}
          onChange={handleChange}
          placeholder="What's on your mind?"
          required
        />

        <label htmlFor="image">Image:</label>
        <input
          type="file"
          name="image"
          id="image"
          value={addingImageUrl}
          onChange={handleChange}
          placeholder="Image"
        />

        <label htmlFor="file">File:</label>
        <input
          type="file"
          name="file"
          id="file"
          value={addingFileUrl}
          onChange={handleChange}
          placeholder="File"
        />

        <button type="submit" disabled={addingContent === ''}>
          Make Post
        </button>
      </form>
    </div>
  );
}
