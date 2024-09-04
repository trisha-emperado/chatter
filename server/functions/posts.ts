import connection from '../db/connection.ts'
import { Post } from '../../models/posts.ts'

// ╔═══════════════════╗
// ║   Get Functions   ║
// ╚═══════════════════╝

export async function getAllPosts(db = connection): Promise<Post[]> {
  return db('posts').select('*').orderBy('id', 'desc')
}

export async function getPostById(id: number, db = connection): Promise<Post> {
  return db('posts').where('id', id).select().first()
}

export async function getPostsByUserId(
  userId: number,
  db = connection,
): Promise<Post[]> {
  return db('posts').where('userId', userId).select('*').orderBy('id', 'desc')
}

// ╔════════════════════╗
// ║   Post Functions   ║
// ╚════════════════════╝

export async function addNewPost(
  newPost: Partial<Post>,
  db = connection,
): Promise<Post[]> {
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
  return db('posts').where('id', id).select()
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
