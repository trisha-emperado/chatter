import connection from '../db/connection.ts'
import { Post, PostAndUser, PostData } from '../../models/posts.ts'

// ╔═══════════════════╗
// ║   Get Functions   ║
// ╚═══════════════════╝

export async function getFollowedUserIds(
  userId: number,
  db = connection,
): Promise<number[]> {
  return db('followers').where('follower_id', userId).pluck('following_id')
}

export async function getAllPosts(
  db = connection,
): Promise<(Post & { username: string; profile_picture_url: string })[]> {
  return db('posts')
    .join('users', 'posts.user_id', 'users.id')
    .select('posts.*', 'users.username', 'users.profile_picture_url')
    .orderBy('posts.id', 'desc')
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
    .select(
      'posts.id',
      'posts.content',
      'posts.image_url',
      'posts.file_url',
      'posts.likes',
      'posts.created_at',
      'users.name',
      'users.profile_picture_url',
    )
    .first()
}
export async function getPostsByUserId(
  userId: number,
  id: number,
  db = connection,
): Promise<Post[]> {
  return db('posts')
    .where({ user_id: userId, id })
    .select('id', 'content', 'image_url', 'file_url', 'likes', 'created_at')
    .orderBy('id', 'desc')
}

export async function getPostsFromUserId(
  userId: number,
  db = connection,
): Promise<PostAndUser[]> {
  return db('posts')
    .where({ user_id: userId })
    .select('id', 'content', 'image_url', 'file_url', 'likes', 'created_at')
    .orderBy('created_at', 'desc')
}

export async function getPostsFromUserIdWithComments(
  userId: number,
  db = connection,
): Promise<
  (Post & {
    username: string
    profile_picture_url: string
    comments: Array<{
      id: number
      content: string
      created_at: Date
      username: string
      profile_picture_url: string
    }>
  })[]
> {
  const postsWithComments = await db('posts')
    .join('users as post_users', 'posts.user_id', 'post_users.id')
    .leftJoin('comments', 'posts.id', 'comments.post_id')
    .leftJoin('users as comment_users', 'comments.user_id', 'comment_users.id')
    .select(
      'posts.id as post_id',
      'posts.user_id as post_user_id',
      'posts.content as post_content',
      'posts.image_url',
      'posts.file_url',
      'posts.likes',
      'posts.created_at as post_created_at',
      'post_users.username as post_username',
      'post_users.profile_picture_url as post_profile_picture_url',

      'comments.id as comment_id',
      'comments.content as comment_content',
      'comments.created_at as comment_created_at',
      'comment_users.username as comment_username',
      'comment_users.profile_picture_url as comment_profile_picture_url',
    )
    .where('posts.user_id', userId)
    .orderBy('posts.created_at', 'desc')

  const postsMap: Record<
    number,
    Post & {
      username: string
      profile_picture_url: string
      comments: Array<{
        id: number
        content: string
        created_at: Date
        username: string
        profile_picture_url: string
      }>
    }
  > = {}

  postsWithComments.forEach((row) => {
    const postId = row.post_id

    if (!postsMap[postId]) {
      postsMap[postId] = {
        id: postId,
        user_id: row.post_user_id,
        content: row.post_content,
        image_url: row.image_url,
        file_url: row.file_url,
        likes: row.likes,
        created_at: row.post_created_at,
        username: row.post_username,
        profile_picture_url: row.post_profile_picture_url,
        comments: [],
      }
    }

    if (row.comment_id) {
      postsMap[postId].comments.push({
        id: row.comment_id,
        content: row.comment_content,
        created_at: row.comment_created_at,
        username: row.comment_username,
        profile_picture_url: row.comment_profile_picture_url,
      })
    }
  })

  return Object.values(postsMap)
}

export async function likePost(
  userId: number,
  postId: number,
  db = connection,
): Promise<void> {
  await db('likes').insert({ user_id: userId, post_id: postId })
}

export async function unlikePost(
  userId: number,
  postId: number,
  db = connection,
): Promise<void> {
  await db('likes').where({ user_id: userId, post_id: postId }).del()
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

export async function getAllPostsWithComments(db = connection): Promise<
  (Post & {
    username: string
    profile_picture_url: string
    comments: Array<{
      id: number
      content: string
      created_at: Date
      username: string
      profile_picture_url: string
    }>
  })[]
> {
  const postsWithComments = await db('posts')
    .join('users', 'posts.user_id', 'users.id')
    .leftJoin('comments', 'posts.id', 'comments.post_id')
    .leftJoin('users as comment_users', 'comments.user_id', 'comment_users.id')
    .select(
      'posts.id as post_id',
      'posts.user_id',
      'posts.content as post_content',
      'posts.image_url',
      'posts.file_url',
      'posts.likes',
      'posts.created_at as post_created_at',
      'users.username as post_username',
      'users.profile_picture_url as post_profile_picture_url',

      'comments.id as comment_id',
      'comments.content as comment_content',
      'comments.created_at as comment_created_at',
      'comment_users.username as comment_username',
      'comment_users.profile_picture_url as comment_profile_picture_url',
    )
    .orderBy('posts.created_at', 'desc')

  const postsMap: Record<
    number,
    Post & {
      username: string
      profile_picture_url: string
      comments: Array<{
        id: number
        content: string
        created_at: Date
        username: string
        profile_picture_url: string
      }>
    }
  > = {}

  postsWithComments.forEach((row) => {
    const postId = row.post_id

    if (!postsMap[postId]) {
      postsMap[postId] = {
        id: postId,
        user_id: row.user_id,
        content: row.post_content,
        image_url: row.image_url,
        file_url: row.file_url,
        likes: row.likes,
        created_at: row.post_created_at,
        username: row.post_username,
        profile_picture_url: row.post_profile_picture_url,
        comments: [],
      }
    }

    if (row.comment_id) {
      postsMap[postId].comments.push({
        id: row.comment_id,
        content: row.comment_content,
        created_at: row.comment_created_at,
        username: row.comment_username,
        profile_picture_url: row.comment_profile_picture_url,
      })
    }
  })

  return Object.values(postsMap)
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
