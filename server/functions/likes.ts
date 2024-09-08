import connection from '../db/connection'
import { Like } from '../../models/likes'

export async function getLikeByPostId(
  postId: number,
  db = connection,
): Promise<Like> {
  return await db('likes').where('post_id', postId).select().first()
}

// Like a post
export async function likePost(
  post_id: number,
  user_id: number,
  db = connection,
) {
  return db('likes').insert({ post_id, user_id })
}

// Unlike a post
export async function unlikePost(
  post_id: number,
  user_id: number,
  db = connection,
) {
  return db('likes').where({ post_id, user_id }).del()
}
