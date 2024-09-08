import { Router } from 'express'
import { Post, PostData } from '../../models/posts.ts'
import checkJwt, { JwtRequest } from '../auth0.ts'
import * as db from '../functions/posts.ts'
import connection from '../db/connection.ts'

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
  console.log('Post route hit')

  const { content, image_url, file_url, likes } = req.body
  const authId = req.auth?.sub
  console.log('Auth ID:', authId)

  if (!authId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    // Query to find user by authId
    const user = await connection('users').where({ auth_id: authId }).first()

    if (!user) {
      console.log('User not found')
      return res.status(404).json({ message: 'User not found' })
    }

    console.log('User found:', user)

    const newPostData: PostData = {
      user_id: user.id,
      content: content,
      image_url: image_url || null,
      file_url: file_url || null,
      likes: likes || 0,
    }

    console.log('New Post Data:', newPostData)

    const newPost = await db.addNewPost(newPostData)
    res.json(newPost)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.post('/:id/like', checkJwt, async (req, res) => {
  const userId = req.auth?.sub
  const postId = parseInt(req.params.postId)

  try {
    const hasLiked = await db.hasLikedPost(userId, postId)
    if (hasLiked) {
      return res
        .status(400)
        .json({ message: 'User has already liked this post' })
    }

    await db.likePost(userId, postId)
    res.status(200).json({ message: 'Post liked' })
  } catch (error) {
    console.error('Error liking post:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.post('/:id/unlike', checkJwt, async (req, res) => {
  const userId = req.auth?.sub
  const postId = parseInt(req.params.postId)

  try {
    const hasLiked = await db.hasLikedPost(userId, postId)
    if (!hasLiked) {
      return res.status(400).json({ message: 'User has not liked this post' })
    }

    await db.unlikePost(userId, postId)
    res.status(200).json({ message: 'Post unliked' })
  } catch (error) {
    console.error('Error unliking post:', error)
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
  const userId = Number(req.auth?.sub)

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    await db.deletePostById(id, userId)
    res.status(204).send()
  } catch (error) {
    if (error === 'Unauthorized: You are not the owner of this post') {
      res.status(403).json({ message: error })
    } else {
      console.error(error)
      res.status(500).json({ message: 'Something went wrong' })
    }
  }
})

export default router
