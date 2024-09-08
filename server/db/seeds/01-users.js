export async function seed(knex) {
  await knex('users').del()

  await knex('users').insert([
    {
      id: 1,
      auth_id: 'authidhere',
      username: 'giogiorgio',
      name: 'Giovanni',
      current_role: 'Student',
      age: 30,
      profile_picture_url:
        'https://static.vecteezy.com/system/resources/thumbnails/002/387/693/small_2x/user-profile-icon-free-vector.jpg',
      cohort: 'Karaka-24',
      facilitator: false,
      github_url: 'https://github.com/giovanni-ambriz',
    },
    {
      id: 2,
      auth_id: 'authid2',
      username: 'mariogomez',
      name: 'Mario Gomez',
      current_role: 'Developer',
      age: 25,
      profile_picture_url:
        'https://static.vecteezy.com/system/resources/thumbnails/002/387/694/small_2x/user-profile-icon-free-vector.jpg',
      cohort: 'Kea-21',
      facilitator: true,
      github_url: 'https://github.com/mariogomez',
    },
    {
      id: 3,
      auth_id: 'authid3',
      username: 'lucyskywalker',
      name: 'Lucy Skywalker',
      current_role: 'Engineer',
      age: 27,
      profile_picture_url:
        'https://static.vecteezy.com/system/resources/thumbnails/002/387/695/small_2x/user-profile-icon-free-vector.jpg',
      cohort: 'Ruru-19',
      facilitator: false,
      github_url: 'https://github.com/lucyskywalker',
    },
    {
      id: 4,
      auth_id: 'authid4',
      username: 'sambrown',
      name: 'Sam Brown',
      current_role: 'Designer',
      age: 32,
      profile_picture_url:
        'https://static.vecteezy.com/system/resources/thumbnails/002/387/696/small_2x/user-profile-icon-free-vector.jpg',
      cohort: 'Kotare-18',
      facilitator: false,
      github_url: 'https://github.com/sambrown',
    },
  ])
}
