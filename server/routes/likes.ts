import { Router } from 'express'
import * as db from '../functions/likes.ts'

const router = Router()

// ╔═══════════════════╗
// ║  Get Like Routes  ║
// ╚═══════════════════╝

router.get('/:id', async (req, res) => {
  try {
    console.log('test')
    const postId = parseInt(req.params.id)
    const likes = await db.getLikesByPostId(postId)
    res.json(likes)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default router
