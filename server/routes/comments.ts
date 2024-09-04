import { Router } from 'express'
import { Comment } from '../../models/comments.ts'
import checkJwt, { JwtRequest } from '../auth0.ts'

import * as db from '../functions/comments.ts'

const router = Router()

// ╔════════════════╗
// ║   Get Routes   ║
// ╚════════════════╝

// This gets all the comments ✦

router.get('/', async (req, res) => {
  try {
    const comments = await db.getAllComments()
    res.json(comments)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// ╔═════════════════╗
// ║   Post Routes   ║
// ╚═════════════════╝

// This is how you would create a new comment ✦

router.post('/', checkJwt, async (req: JwtRequest, res) => {
  const { content } = req.body
  const user_id = req.auth?.sub

  if (user_id === undefined) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    const newCommentData: Partial<Comment> = {
      content: content,
      created_at: new Date(),
    }

    const newPost = await db.addNewComment(newCommentData)
    res.json(newPost)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// ╔══════════════════╗
// ║   Patch Routes   ║
// ╚══════════════════╝

// This is how you would edit a comment by id (We probably shouldn't add this lol) ✦

router.patch('/:id', checkJwt, async (req: JwtRequest, res) => {
  const { content } = req.body
  const id = parseInt(req.params.id)
  const user_id = req.auth?.sub

  if (user_id === undefined) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    const editedCommentData: Partial<Comment> = {
      content: content,
    }

    const editedComment = await db.editComment(id, editedCommentData)
    res.json(editedComment)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// ╔═══════════════════╗
// ║   Delete Routes   ║
// ╚═══════════════════╝

// This is how you would delete a comment by id (Again not a good idea but maybe)✦

router.delete('/:id', checkJwt, async (req: JwtRequest, res) => {
  const id = parseInt(req.params.id)
  try {
    await db.deleteCommentById(id)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default router
