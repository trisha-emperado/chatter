import { useState } from 'react'
import { PostData } from '../../models/posts'
import { useAuth0 } from '@auth0/auth0-react'

const emptyPost: PostData = {
  content: '',
  image_url: '',
  file_url: '',
}

export default function PostForm() {
  const [newPost, setNewPost] = useState(emptyPost)
  const { user } = useAuth0()

  const {
    content: addingContent,
    image_url: addingImageUrl,
    file_url: addingFileUrl,
  } = newPost

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setNewPost({
      ...newPost,
      [name]: value,
    })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (addingContent.trim() === '') {
      console.error('Invalid input: Content must be entered')
      return
    }

    console.log('New post submitted:', newPost)

    setNewPost(emptyPost)
  }

  return (
    <div className="feedFormPage">
      <form onSubmit={handleSubmit} className="postForm">
        <div className="formTop">
          <div className="formTopImg">
            <img
              src={user?.picture}
              alt="users profile pic"
              className="usersPic"
            />
          </div>
          <div className="formTopInput">
            <input
              className="postInput"
              name="content"
              id="content"
              value={addingContent}
              onChange={handleChange}
              placeholder="What's on your mind?"
              required
            />
          </div>
        </div>
        <div className="formBottom">
          <div className="images">
            <img
              src="https://w7.pngwing.com/pngs/745/306/png-transparent-gallery-image-images-photo-picture-pictures-set-app-incredibles-icon-thumbnail.png"
              alt="img icon"
              className="imgIcon"
            />
            <input
              type="file"
              name="image"
              id="image"
              value={addingImageUrl}
              onChange={handleChange}
              placeholder="Image"
            />
          </div>
          <div className="files">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTg7hLYt4lXOocWshH-2GQgAXJXuS3osquYBA&s"
              alt="file icon"
              className="fileIcon"
            />
            <input
              type="file"
              name="file"
              id="file"
              value={addingFileUrl}
              onChange={handleChange}
              placeholder="File"
            />
          </div>

          <button type="submit" disabled={addingContent === ''}>
            Make Post
          </button>
        </div>
      </form>
    </div>
  )
}
