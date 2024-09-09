import connection from '../db/connection.ts'
import { Comment, CommentData, DetailedComment } from '../../models/comments.ts'

// type CommentWithUser = Comment & { username: string }

// ╔═══════════════════╗
// ║   Get Functions   ║
// ╚═══════════════════╝

export async function getAllComments(db = connection): Promise<Comment[]> {
  return db('comments').select('*').orderBy('id', 'desc')
}

export async function getCommentsByPostId(
  postId: number,
  db = connection,
): Promise<DetailedComment[]> {
  return db('comments')
    .join('users', 'comments.user_id', 'users.id')
    .join('posts', 'comments.post_id', 'posts.id')
    .where('comments.post_id', postId)
    .select(
      'comments.*',
      'users.username',
      'users.profile_picture_url',
      'users.auth_id',
    )
}

// export async function getCommentsByPostId(
//   post_id: number,
//   db = connection,
// ): Promise<CommentWithUser[]> {
//   return db('comments')
//     .select('comments.*', 'users.username')
//     .where('comments.post_id', post_id)
//     .orderBy('created_at', 'desc')
// }

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
