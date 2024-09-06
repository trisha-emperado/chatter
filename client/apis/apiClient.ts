import request from 'superagent'
import { User } from '../../models/users'
import { Post } from '../../models/posts'

const rootURL = '/api/v1'

export async function getAllUsers(): Promise<User[]> {
  try {
    const res = await request.get(rootURL + '/users')
    return res.body as User[]
  } catch (error) {
    console.error('Failed to fetch any users', error)
    throw new Error('Unable to fetch any users')
  }
}

export async function addUser(newUser: User) {
  return await request.post(rootURL).send(newUser)
}

export async function getAllPosts() {
  try {
    const res = await request.get(rootURL + '/posts/')
    return res.body
  } catch (error) {
    console.error('Failed to fetch posts', error)
    throw new Error('Unable to fetch posts')
  }
}

export async function getPost(id: number): Promise<Post> {
  try {
    const res = await request.get(`${rootURL}/posts/${id}`)
    return res.body
  } catch (error) {
    console.error('Failed to fetch any post', error)
    throw new Error('Unable to fetch any post')
  }
}
