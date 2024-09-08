import { useState } from 'react'
import { Post } from '../../models/posts'
import { useNewPost } from '../hooks/usePosts'

const emptyPost: Post = {
  id: 0,
  user_id: 1,
  content: '',
  image_url: '',
  file_url: '',
  likes: 0,
  created_at: new Date(),
}

export default function PostForm() {
  const [newPost, setNewPost] = useState(emptyPost)
  const {
    content: addingContent,
    image_url: addingImageUrl,
    file_url: addingFileUrl,
  } = newPost
  const { mutate: addPost, isPending, isError } = useNewPost()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setNewPost({
      ...newPost,
      [name]: value,
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    try {
      await addPost({
        ...newPost,
        image_url: addingImageUrl || '',
        file_url: addingFileUrl || '',
      })
      console.log('New post submitted:', newPost)
      setNewPost(emptyPost)
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

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

        <label htmlFor="image">Image URL:</label>
        <input
          type="file"
          name="image_url"
          id="image"
          value={addingImageUrl}
          onChange={handleChange}
          placeholder="Image URL"
        />

        <label htmlFor="file">File URL:</label>
        <input
          type="file"
          name="file_url"
          id="file"
          value={addingFileUrl}
          onChange={handleChange}
          placeholder="File URL"
        />

        <button type="submit" disabled={addingContent === '' || isPending}>
          {isPending ? 'Posting...' : 'Make Post'}
        </button>

        {isError && <p>Error creating post</p>}
      </form>
    </div>
  )
}
