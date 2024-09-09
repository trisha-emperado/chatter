import { useState } from 'react'
import { PostData } from '../../models/posts'
import { useNewPost } from '../hooks/usePosts'
import { useAuth0 } from '@auth0/auth0-react'

const emptyPostData: PostData = {
  user_id: 0,
  content: '',
  image_url: '',
  file_url: '',
}

export default function PostForm() {
  const { user } = useAuth0()
  const [newPost, setNewPost] = useState(emptyPostData)
  const { content, image_url, file_url } = newPost
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
        image_url: image_url || '',
        file_url: file_url || '',
      })
      console.log('New post submitted:', newPost)
      setNewPost(emptyPostData)
    } catch (error) {
      console.error('Error creating post:', error)
    }
  }

  return (
    <div className="postFormContainer">
      <form className="theForm" onSubmit={handleSubmit}>
        <div className="formTop">
          <div className="formTopImg">
            <img src={user?.picture} alt="profile pic" className="usersPic" />
          </div>
          <div className="formTopInput">
            <textarea
              className="postInput"
              name="content"
              id="content"
              value={content}
              onChange={handleChange}
              placeholder="What's on your mind?"
              required
            />
          </div>
        </div>

        <div className="formBottom">
          <div className="filesContain">
            <div className="files">
              <img
                src="https://icons.veryicon.com/png/o/system/dan_system/file-60.png"
                alt="file icon"
                className="fileIcon"
              />
            </div>
            <label className="file-label">
              <input
                type="file"
                name="file_url"
                id="file"
                onChange={handleChange}
                placeholder="File URL"
              />
              Add File
            </label>
          </div>

          <div className="imagesContain">
            <div className="images">
              <img
                src="https://pixsector.com/cache/517d8be6/av5c8336583e291842624.png"
                alt="image icon"
                className="imgIcon"
              />
            </div>
            <label className="file-label">
              <input
                type="file"
                name="image_url"
                id="image"
                onChange={handleChange}
                placeholder="Image URL"
              />
              Add Image
            </label>
          </div>

          <button type="submit" disabled={content === '' || isPending}>
            {isPending ? 'Posting...' : 'Make Post'}
          </button>
        </div>

        {isError && <p>Error creating post</p>}
      </form>
    </div>
  )
}
