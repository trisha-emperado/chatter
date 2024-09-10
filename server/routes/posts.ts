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
    const postsWithUserDetails = await db.getAllPostsWithComments()
    res.json(postsWithUserDetails)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// This gets an specific post by the posts id ✦

router.get('/:id', async (req, res) => {
  try {
    console.log('test')
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

router.get('/users/:userId/posts', async (req, res) => {
  const userId = parseInt(req.params.userId, 10)

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' })
  }

  try {
    if (typeof db.getPostsFromUserIdWithComments !== 'function') {
      console.error(
        'getPostsFromUserIdWithComments is not a function or not properly imported',
      )
      return res.status(500).json({ error: 'Server configuration error' })
    }

    const posts = await db.getPostsFromUserIdWithComments(userId)
    res.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    res.status(500).json({ error: 'An error occurred while fetching posts' })
  }
})

// ╔═════════════════╗
// ║   Post Routes   ║
// ╚═════════════════╝

// This is how you would create a new post ✦

router.post('/', checkJwt, async (req: JwtRequest, res) => {
  const { content, image_url, file_url, likes } = req.body
  const authId = req.auth?.sub

  if (!authId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    const user = await connection('users').where({ auth_id: authId }).first()

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const newPostData: PostData = {
      user_id: user.id,
      content: content,
      image_url: image_url || null,
      file_url: file_url || null,
      likes: likes || 0,
    }

    const newPost = await db.addNewPost(newPostData)
    res.json(newPost)
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.post('/like', checkJwt, async (req, res) => {
  const { postId, userId } = req.body

  try {
    // const hasLiked = await db.hasLikedPost(userId, postId)
    // if (hasLiked) {
    //   return res
    //     .status(400)
    //     .json({ message: 'User has already liked this post' })
    // }

    await db.likePost(userId, postId)
    res.status(200).json({ message: 'Post liked' })
  } catch (error) {
    console.error('Error liking post:', error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.delete('/unlike', checkJwt, async (req, res) => {
  const { postId, userId } = req.body

  try {
    const hasLiked = await db.hasLikedPost(userId, postId)
    if (!hasLiked) {
      return res.status(400).json({ message: 'User has not liked this post' })
    }
    await db.unlikePost(userId, postId)
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
  try {
    await db.deletePostById(id)
    res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default router
