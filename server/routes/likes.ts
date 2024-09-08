import { Router } from 'express'
import * as db from '../functions/likes'

const router = Router()

//Route to get all likes
router.get('/:postId', async (req, res) => {
  try {
    const postId = parseInt(req.params.postId)
    const likeByPostId = await db.getLikeByPostId(postId)
    return res.json(likeByPostId)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

//Route to like a post
router.post('/like', async (req, res) => {
  const { post_id, user_id } = req.body
  try {
    await db.likePost(post_id, user_id)
    res.status(200).json({ message: 'Liked post successfully' })
  } catch (err) {
    console.error('Error in like route:', err)
    res.status(500).json({ error: 'Failed to like post' })
  }
})

//Route to unlike a post
router.post('/unlike', async (req, res) => {
  const { post_id, user_id } = req.body
  try {
    await db.unlikePost(post_id, user_id)
    res.status(200).json({ message: 'Unliked successfully' })
  } catch (err) {
    console.error('Error in unlike route:', err)
    res.status(500).json({ error: 'Failed to remover like' })
  }
})

export default router
