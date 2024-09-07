import connection from '../db/connection.ts'

// ╔═══════════════════╗
// ║  Follow A User    ║
// ╚═══════════════════╝

export async function followUser(
  follower_id: number,
  following_id: number,
  db = connection,
) {
  return db('followers').insert({ follower_id, following_id })
}

// ╔═══════════════════╗
// ║  Unfollow A User  ║
// ╚═══════════════════╝

export async function unfollowUser(
  follower_id: number,
  following_id: number,
  db = connection,
) {
  return db('followers').where({ follower_id, following_id }).del()
}

// ╔═══════════════════════════════════════════╗
// ║  Check if user is following another user  ║
// ╚═══════════════════════════════════════════╝
export async function isFollowing(
  follower_id: number,
  following_id: number,
  db = connection,
) {
  return db('followers').where({ follower_id, following_id }).first()
}
