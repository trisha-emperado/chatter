import express from 'express'
import * as Path from 'node:path'

import postRoutes from './routes/posts.ts'
import userRoutes from './routes/users.ts'
import commentRoutes from './routes/comments.ts'
import followerRoutes from './routes/followers.ts'
import likeRoutes from './routes/likes.ts'

const server = express()

server.use(express.json())

server.use('/api/v1/users', userRoutes)
server.use('/api/v1/posts', postRoutes)
server.use('/api/v1/comments', commentRoutes)
server.use('/api/v1/followers', followerRoutes)
server.use('/api/v1/likes', likeRoutes)

if (process.env.NODE_ENV === 'production') {
  server.use(express.static(Path.resolve('public')))
  server.use('/assets', express.static(Path.resolve('./dist/assets')))
  server.get('*', (req, res) => {
    res.sendFile(Path.resolve('./dist/index.html'))
  })
}

export default server
