import { Router } from 'express'
import { Post } from '../../models/posts.ts'
import checkJwt, { JwtRequest } from '../auth0.ts'

import * as db from '../functions/posts.ts'
import connection from '../db/connection.ts'

const router = Router()

// ╔════════════════╗
// ║   Get Routes   ║
// ╚════════════════╝

// This gets all the posts ✦

router.get('/post', async (req, res) => {
  try {
    const postsWithUserDetails = await db.getPosts()
    res.json(postsWithUserDetails)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.get('/', async (req, res) => {
  try {
    const postsWithUserDetails = await db.getAllPosts()
    res.json(postsWithUserDetails)
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
  const userAuthId = req.auth?.sub // This is the user identifier from JWT

  if (!userAuthId) {
    return res.status(400).json({ message: 'User ID from JWT is required' })
  }

  try {
    // Fetch the actual user_id from the database based on userAuthId
    const user = await connection('users').where('auth_id', userAuthId).first()

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const userId = user.id // This is the user_id you want to use

    const newPostData: Partial<Post> = {
      user_id: userId, // Use the user_id from the database
      content: content,
      image_url: image_url || null,
      file_url: file_url || null,
      likes: 0,
      created_at: new Date(),
    }

    // Add new post to the database
    const newPost = await connection('posts').insert(newPostData).returning('*')
    res.json(newPost[0]) // Respond with the newly created post
  } catch (error) {
    console.error('Error adding new post:', error)
    res.status(500).json({ message: 'Something went wrong', error: error })
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
