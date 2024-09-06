import request from 'superagent'
import { User } from '../../models/users'

const rootURL = '/api'

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
