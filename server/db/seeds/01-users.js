export async function seed(knex) {
  await knex('users').del()

  await knex('users').insert([
    {
      id: 1,
      auth_id: 'authidhere',
      username: 'Random Test User',
      name: 'User',
      current_role: 'Student',
      age: 30,
      profile_picture_url:
        'https://static.vecteezy.com/system/resources/thumbnails/002/387/693/small_2x/user-profile-icon-free-vector.jpg',
      cohort: 'Karaka-24',
      facilitator: false,
      github_url: 'https://github.com/giovanni-ambriz',
    },
  ])
}
