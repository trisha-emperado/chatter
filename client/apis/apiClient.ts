import request from 'superagent'
import { User } from '../../models/users'

const rootURL = '/api/v1/users'

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
