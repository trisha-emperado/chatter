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

export async function getFollowingUsersWithDetails(
  follower_id: string,
  db = connection,
) {
  return db('followers')
    .join('users', 'followers.following_id', '=', 'users.auth_id')
    .where({ follower_id })
    .select(
      'users.auth_id',
      'users.username',
      'users.name',
      'users.profile_picture_url',
    )
}

export async function getPostsFromFollowingUsers(
  follower_id: string,
  db = connection,
) {
  return db('followers')
    .join('users', 'followers.following_id', '=', 'users.auth_id')
    .join('posts', 'users.id', '=', 'posts.user_id')
    .where('followers.follower_id', follower_id)
    .select(
      'posts.id',
      'posts.content',
      'posts.image_url',
      'posts.file_url',
      'posts.likes',
      'posts.created_at',
      'users.name',
      'users.profile_picture_url',
    )
    .orderBy('posts.created_at', 'desc')
}
