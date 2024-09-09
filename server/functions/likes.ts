import connection from '../db/connection.ts'
import { Like } from '../../models/likes.ts'

// ╔═══════════════════╗
// ║   Like Functions  ║
// ╚═══════════════════╝

export async function getLikesByPostId(
  postId: number,
  db = connection,
): Promise<Like[]> {
  return db('likes').where('post_id', postId).select('*')
}
