import connection from '../db/connection.ts'
import { Comment, CommentData } from '../../models/comments.ts'

// ╔═══════════════════╗
// ║   Get Functions   ║
// ╚═══════════════════╝

export async function getAllComments(db = connection): Promise<Comment[]> {
  return db('comments').select('*').orderBy('id', 'desc')
}

export async function getCommentById(
  id: number,
  db = connection,
): Promise<
  Comment & { username: string; profile_picture_url: string; auth_id: string }
> {
  return db('comments')
    .join('users', 'comments.user_id', 'users.id')
    .join('posts', 'comments.post_id', 'posts.id')
    .where('comments.id', id)
    .select(
      'comments.*',
      'users.username',
      'users.profile_picture_url',
      'users.auth_id',
    )
    .first()
}

// ╔════════════════════╗
// ║   Post Functions   ║
// ╚════════════════════╝

export async function addComment(
  comment: CommentData,
  db = connection,
): Promise<Comment> {
  const [newComment] = await db('comments').insert(comment, ['*'])
  return newComment
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
