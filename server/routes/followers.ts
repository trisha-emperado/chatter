import { Router } from 'express'
import * as db from '../functions/followers'
import { isFollowing } from '../functions/followers'

const router = Router()

//Route to follow a user
router.post('/follow', async (req, res) => {
  const { follower_id, following_id } = req.body
  try {
    await db.followUser(follower_id, following_id)
    res.status(200).json({ message: 'Followed successfully' })
  } catch (err) {
    console.error('Error in follow route:', err)
    res.status(500).json({ error: 'Failed to follow user' })
  }
})

//Unfollow User Endpoint
router.post('/unfollow', async (req, res) => {
  const { follower_id, following_id } = req.body
  try {
    await db.unfollowUser(follower_id, following_id)
    res.status(200).json({ message: 'Unfollowed successfully' })
  } catch (err) {
    console.error('Error in unfollow route:', err)
    res.status(500).json({ error: 'Failed to unfollow user' })
  }
})

//Check if a user is following another user
router.get('/isFollowing', async (req, res) => {
  const { follower_id, following_id } = req.query
  try {
    const result = await isFollowing(
      follower_id as string,
      following_id as string,
    )
    res.status(200).json({ isFollowing: !!result })
  } catch (err) {
    res.status(500).json({ error: 'Failed to check follow status' })
  }
})

//Get a list of users that is followed by a specific user
router.get('/following/:follower_id', async (req, res) => {
  const { follower_id } = req.params
  try {
    const followedUsers = await db.getFollowedUsers(follower_id)
    res.status(200).json(followedUsers)
  } catch (err) {
    console.error('Error fetching followed users:', err)
    res.status(500).json({ error: 'Failed to fetch followed users' })
  }
})

export default router
