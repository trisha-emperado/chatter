import { Router } from 'express'
import { Post } from '../../models/posts.ts'
import checkJwt, { JwtRequest } from '../auth0.ts'

import * as db from '../functions/posts.ts'

const router = Router()

// ╔════════════════╗
// ║   Get Routes   ║
// ╚════════════════╝

// This gets all the posts ✦

router.get('/', async (req, res) => {
  try {
    const posts = await db.getAllPosts()
    res.json(posts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// This gets an specific post by the posts id ✦

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const postById = await db.getPostById(id)
    return res.json(postById)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// This gets the posts made by a user using their id ✦

router.get('/:userId/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId)
    const postId = parseInt(req.params.id)
    const userPosts = await db.getPostsByUserId(userId, postId)
    return res.json(userPosts)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// ╔═════════════════╗
// ║   Post Routes   ║
// ╚═════════════════╝

// This is how you would create a new post ✦

router.post('/', checkJwt, async (req: JwtRequest, res) => {
  const { content, image_url, file_url } = req.body
  const user_id = req.auth?.sub

  if (user_id === undefined) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    const newPostData: Partial<Post> = {
      user_id: parseInt(user_id),
      content: content,
      image_url: image_url || null,
      file_url: file_url || null,
      likes: 0,
      created_at: new Date(),
    }

    const newPost = await db.addNewPost(newPostData)
    res.json(newPost)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// ╔══════════════════╗
// ║   Patch Routes   ║
// ╚══════════════════╝

// This is how you would edit a post by id ✦

router.patch('/:id', checkJwt, async (req: JwtRequest, res) => {
  const { content, image_url, file_url, likes } = req.body
  const id = parseInt(req.params.id)
  const user_id = req.auth?.sub

  if (user_id === undefined) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    const editedPostData: Partial<Post> = {
      user_id: parseInt(user_id),
      content: content,
      image_url: image_url || null,
      file_url: file_url || null,
      likes: likes,
    }

    const editedPost = await db.editPostById(id, editedPostData)
    res.json(editedPost)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// ╔═══════════════════╗
// ║   Delete Routes   ║
// ╚═══════════════════╝

// This is how you would delete a post by id ✦

router.delete('/:id', checkJwt, async (req: JwtRequest, res) => {
  const id = parseInt(req.params.id)
  try {
    await db.deletePostById(id)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default router
