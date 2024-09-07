export async function seed(knex) {
  await knex('followers').del()

  await knex('followers').insert([
    { follower_id: 1, following_id: 2 },
    { follower_id: 2, following_id: 3 },
    { follower_id: 1, following_id: 3 },
  ])
}
