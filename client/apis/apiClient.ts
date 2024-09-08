import request from 'superagent'
import { User } from '../../models/users'
import { Post } from '../../models/posts'
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
): Promise<Post & { username: string; profile_picture_url: string }> {
  const res = await request.get(`${rootURL}/posts/${id}`)
  return res.body
}

export async function addNewPost(newPost: Post) {
  const res = await request.post(rootURL + '/posts/').send(newPost)
  return res.body
}

// ╔═══════════════════╗
// ║    User Routes    ║
// ╚═══════════════════╝

export async function getLikeByPostId(postId: number): Promise<Like> {
  try {
    const res = await request.get(rootURL + `/likes/${postId}`)
    return res.body as Like
  } catch (error) {
    console.error('Failed to fetch like of that post', error)
    throw new Error('Unable to fetch that like from the post')
  }
}

export async function likePost(likeData: Like) {
  const res = await request.post(rootURL + '/users/like').send(likeData)
  return res.body
}

export async function unlikePost(likeData: Like) {
  const res = await request.post(rootURL + '/users/unlike').send(likeData)
  return res.body
}
