export async function seed(knex) {
  await knex('followers').del()

  await knex('followers').insert([
    { follower_id: 'authidhere', following_id: 'authid2' },
    { follower_id: 'authid2', following_id: 'authid3' },
    { follower_id: 'authidhere', following_id: 'authid3' },
  ])
}
