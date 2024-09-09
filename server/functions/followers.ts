import connection from '../db/connection.ts'

// ╔═══════════════════╗
// ║  Follow A User    ║
// ╚═══════════════════╝

export async function followUser(
  follower_id: string,
  following_id: string,
  db = connection,
) {
  return db('followers').insert({ follower_id, following_id })
}

// ╔═══════════════════╗
// ║  Unfollow A User  ║
// ╚═══════════════════╝

export async function unfollowUser(
  follower_id: string,
  following_id: string,
  db = connection,
) {
  return db('followers').where({ follower_id, following_id }).del()
}

// ╔═══════════════════════════════════════════╗
// ║  Check if user is following another user  ║
// ╚═══════════════════════════════════════════╝
export async function isFollowing(
  follower_id: string,
  following_id: string,
  db = connection,
) {
  return db('followers').where({ follower_id, following_id }).first()
}

// ╔═════════════════════════════════════════════════════════╗
// ║ Get a list of users that a specific user is following   ║
// ╚═════════════════════════════════════════════════════════╝
export async function getFollowedUsers(follower_id: string, db = connection) {
  return db('followers')
    .join('users', 'followers.following_id', 'users.auth_id')
    .select('users.id', 'users.username', 'users.name','users.profile_picture_url')
    .where('followers.follower_id', follower_id)
}
