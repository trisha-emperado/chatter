import connection from '../db/connection.ts'
import { Post, PostData } from '../../models/posts.ts'

// ╔═══════════════════╗
// ║   Get Functions   ║
// ╚═══════════════════╝

export async function getAllPosts(db = connection): Promise<Post[]> {
  return db('posts').select('*').orderBy('id', 'desc')
}

export async function getPostById(
  id: number,
  db = connection,
): Promise<
  Post & { username: string; profile_picture_url: string; auth_id: string }
> {
  return db('posts')
    .join('users', 'posts.user_id', 'users.id')
    .where('posts.id', id)
    .select(
      'posts.*',
      'users.username',
      'users.profile_picture_url',
      'users.auth_id',
    )
    .first()
}

export async function getPostsByUserId(
  userId: number,
  id: number,
  db = connection,
): Promise<Post[]> {
  return db('posts')
    .where({ userId, id })
    .select('id', id)
    .orderBy('id', 'desc')
}

export async function likePost(
  userId: number,
  postId: number,
  db = connection,
): Promise<void> {
  await db('likes').insert({ user_id: userId, post_id: postId })
  // await db('posts').where('id', postId).increment('likes', 1)
}

export async function unlikePost(
  userId: number,
  postId: number,
  db = connection,
): Promise<void> {
  await db('likes').where({ user_id: userId, post_id: postId }).del()
  await db('posts').where('id', postId).decrement('likes', 1)
}

export async function hasLikedPost(
  userId: number,
  postId: number,
  db = connection,
): Promise<boolean> {
  const like = await db('likes')
    .where({ user_id: userId, post_id: postId })
    .first()
  return !!like
}

// ╔════════════════════╗
// ║   Post Functions   ║
// ╚════════════════════╝

export async function addNewPost(
  newPost: PostData,
  db = connection,
): Promise<Post> {
  const [newPostId] = await db('posts').insert(newPost, ['*'])
  return newPostId
}

// ╔═════════════════════╗
// ║   Patch Functions   ║
// ╚═════════════════════╝

export async function editPostById(
  id: number,
  editedPost: Partial<Post>,
  db = connection,
): Promise<Post[]> {
  await db('posts').where('id', id).update(editedPost, ['*'])
  return db('posts').where('id', id).select('*')
}

// ╔══════════════════════╗
// ║   Delete Functions   ║
// ╚══════════════════════╝

export async function deletePostById(
  id: number,
  db = connection,
): Promise<void> {
  await db('posts').where('id', id).del()
}
