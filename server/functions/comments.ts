import connection from '../db/connection.ts'
import { Comment } from '../../models/comments.ts'

// ╔═══════════════════╗
// ║   Get Functions   ║
// ╚═══════════════════╝

export async function getAllComments(db = connection): Promise<Comment[]> {
  return db('comments').select('*').orderBy('id', 'desc')
}

// ╔════════════════════╗
// ║   Post Functions   ║
// ╚════════════════════╝

export async function addComment(
  comment: Omit<Comment, 'id' | 'created_at'>,
  db = connection,
): Promise<void> {
  await db('comments').insert(comment)
}

// ╔═════════════════════╗
// ║   Patch Functions   ║
// ╚═════════════════════╝

export async function editComment(
  id: number,
  editedComment: Partial<Comment>,
  db = connection,
): Promise<Comment[]> {
  await db('comments').where('id', id).update(editComment, ['*'])
  return db('comments').where('id', id).select()
}

// ╔══════════════════════╗
// ║   Delete Functions   ║
// ╚══════════════════════╝

export async function deleteCommentById(
  id: number,
  db = connection,
): Promise<void> {
  await db('comments').where('id', id).del()
}
