import connection from '../db/connection.ts'
import { User } from '../../models/users.ts'

// ╔═══════════════════╗
// ║   Get Functions   ║
// ╚═══════════════════╝

export async function getAllUsers(db = connection): Promise<User[]> {
  return await db('users').select('*').orderBy('id', 'desc')
}

export async function getUserById(id: number, db = connection): Promise<User> {
  return await db('users').where('id', id).select().first()
}

export async function getUserByAuthId(
  authId: string,
  db = connection,
): Promise<User | undefined> {
  return db('users').where('auth_id', authId).first()
}

// ╔════════════════════╗
// ║   Post Functions   ║
// ╚════════════════════╝

export async function addNewUser(
  newUser: Omit<User, 'id'>,
  db = connection,
): Promise<User> {
  const [newUserId] = await db('users').insert(newUser).returning('*')
  return newUserId
}

// ╔═════════════════════╗
// ║   Patch Functions   ║
// ╚═════════════════════╝

export async function editUserById(
  id: number,
  editedUser: Partial<User>,
  db = connection,
): Promise<User> {
  await db('users').where('id', id).update(editedUser, ['*'])
  return await db('users').where('id', id).select().first()
}

// ╔══════════════════════╗
// ║   Delete Functions   ║
// ╚══════════════════════╝

export async function deleteUserById(
  id: number,
  db = connection,
): Promise<void> {
  await db('users').where('id', id).del()
}
