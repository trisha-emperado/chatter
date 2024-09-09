import request from 'superagent'
import { User } from '../../models/users'
import { Post, PostData } from '../../models/posts'
import { CommentData, DetailedComment } from '../../models/comments'
import { Like } from '../../models/likes'

const rootURL = '/api/v1'

// ╔═══════════════════╗
// ║    User Routes    ║
// ╚═══════════════════╝

export async function getAllUsers(): Promise<User[]> {
  try {
    const res = await request.get(rootURL + '/users')
    return res.body as User[]
  } catch (error) {
    console.error('Failed to fetch any users', error)
    throw new Error('Unable to fetch any users')
  }
}

export async function getUserByID(id: number): Promise<User> {
  try {
    const res = await request.get(rootURL + `/users/${id}`)
    return res.body as User
  } catch (error) {
    console.error('Failed to fetch that user', error)
    throw new Error('Unable to fetch that user')
  }
}

export async function getUserByAuthId(authId: string): Promise<User> {
  try {
    const res = await request.get(rootURL + `/users/authId/${authId}`)
    return res.body as User
  } catch (error) {
    console.error('Failed to fetch that user', error)
    throw new Error('Unable to fetch that user')
  }
}

export async function addUser(newUser: User, token: string) {
  return await request
    .post(rootURL + '/users')
    .set('Authorization', `Bearer ${token}`)
    .send(newUser)
}

export async function editUser(
  currentUser: User,
  userID: number | undefined,
  token: string,
) {
  return await request
    .patch(rootURL + `/users/${userID}`)
    .set('Authorization', `Bearer ${token}`)
    .send(currentUser)
}

export async function deleteUserById(id: number, token: string) {
  return await request
    .del(rootURL + `/users/${id}`)
    .set('Authorization', `Bearer ${token}`)
}

// ╔═══════════════════╗
// ║     Post Routes   ║
// ╚═══════════════════╝

export async function getAllPosts() {
  const res = await request.get(rootURL + '/posts/')
  return res.body
}

export async function getPost(
  id: number,
): Promise<
  Post & { username: string; profile_picture_url: string; auth_id: string }
> {
  const res = await request.get(`${rootURL}/posts/${id}`)
  return res.body
}

export async function addNewPost(newPost: PostData, token: string) {
  const res = await request
    .post(rootURL + '/posts/')
    .set('Authorization', `Bearer ${token}`)
    .send(newPost)
  return res.body
}

export async function likePost(
  postId: number,
  userId: number,
  token: string,
): Promise<void> {
  await request
    .post(`${rootURL}/posts/like`)
    .set('Authorization', `Bearer ${token}`)
    .send({ postId, userId, token })
}

export async function unlikePost(postId: number): Promise<void> {
  await request.post(`${rootURL}/posts/${postId}/unlike`)
}

export async function deletePost(id: number, token: string) {
  await request
    .delete(`${rootURL}/posts/${id}`)
    .set('Authorization', `Bearer ${token}`)
}

export async function addComment(newComment: CommentData, token: string) {
  const res = await request
    .post(rootURL + '/comments/')
    .set('Authorization', `Bearer ${token}`)
    .send(newComment)
  return res.body
}

// ╔════════════════════════╗
// ║     Following Routes   ║
// ╚════════════════════════╝

export async function getFollowedUsers(followerId: string) {
  try {
    const res = await request.get(
      rootURL + `/followers/following/${followerId}`,
    )
    return res.body
  } catch (error) {
    console.error('Failed to fetch followed users', error)
    throw new Error('Unable to fetch followed users')
  }
}

// ╔═══════════════════╗
// ║    Likes Routes   ║
// ╚═══════════════════╝

export async function getLikesByPostId(postId: number): Promise<Like[]> {
  try {
    const res = await request.get(rootURL + `/likes/${postId}`)
    return res.body as Like[]
  } catch (error) {
    console.error('Failed to fetch the likes for that post', error)
    throw new Error('Unable to fetch the likes for that post')
  }
}

// ╔═══════════════════╗
// ║ Comments Routes   ║
// ╚═══════════════════╝

export async function getCommentsByPostId(
  postId: number,
): Promise<DetailedComment[]> {
  const res = await request.get(`${rootURL}/post/${postId}`)
  return res.body as DetailedComment[]
}
