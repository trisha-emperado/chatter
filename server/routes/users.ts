import { Router } from 'express'
import { User } from '../../models/users.ts'
import checkJwt, { JwtRequest } from '../auth0.ts'

import * as db from '../functions/users.ts'

const router = Router()

// ╔════════════════╗
// ║   Get Routes   ║
// ╚════════════════╝

// This gets all the users ✦

router.get('/', async (req, res) => {
  try {
    const users = await db.getAllUsers()
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// This gets an specific user by the users id ✦

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const userById = await db.getUserById(id)
    return res.json(userById)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.get('/authId/:authId', async (req, res) => {
  try {
    const authId = req.params.authId
    const userByAuthId = await db.getUserByAuthId(authId)
    return res.json(userByAuthId)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// ╔═════════════════╗
// ║   Post Routes   ║
// ╚═════════════════╝

// This is how you would create a new user ✦

router.post('/', checkJwt, async (req: JwtRequest, res) => {
  const authId = req.auth?.sub
  const {
    username,
    name,
    age,
    cohort,
    current_role,
    facilitator,
    github_url,
    profile_picture_url,
    auth_id,
  } = req.body

  if (!authId) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    const existingUser = await db.getUserByAuthId(authId)
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const newUser: Omit<User, 'id'> = {
      username: username || '',
      name: name || '',
      current_role: current_role || '',
      age: age || 0,
      profile_picture_url: profile_picture_url || '',
      cohort: cohort || '',
      facilitator: facilitator,
      github_url: github_url || '',
      auth_id: auth_id,
    }

    const addedUser = await db.addNewUser(newUser)
    res.json(addedUser)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// ╔══════════════════╗
// ║   Patch Routes   ║
// ╚══════════════════╝

// This is how you would edit a users details by the users id  ✦

router.patch('/:id', checkJwt, async (req: JwtRequest, res) => {
  const {
    username,
    name,
    current_role,
    age,
    profile_picture_url,
    cohort,
    facilitator,
    github_url,
  } = req.body
  const id = parseInt(req.params.id)

  try {
    const editedUserData: Partial<User> = {
      username: username,
      name: name,
      current_role: current_role,
      age: age,
      profile_picture_url: profile_picture_url,
      cohort: cohort,
      facilitator: facilitator,
      github_url: github_url,
    }

    const editedUser = await db.editUserById(id, editedUserData)
    res.json(editedUser)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.patch('/:id/profile/edit', checkJwt, async (req: JwtRequest, res) => {
  const { header_image_url, status } = req.body
  const id = parseInt(req.params.id)

  try {
    const editedUserData: Partial<User> = {
      header_image_url: header_image_url,
      status: status,
    }

    const editedUser = await db.editUserProfileById(id, editedUserData)
    res.json(editedUser)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

// ╔═══════════════════╗
// ║   Delete Routes   ║
// ╚═══════════════════╝

// This is how you would delete a user by id (not sure if we will even use this) ✦

router.delete('/:id', checkJwt, async (req: JwtRequest, res) => {
  const id = parseInt(req.params.id)
  try {
    await db.deleteUserById(id)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

export default router
