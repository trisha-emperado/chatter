export async function seed(knex) {
  await knex('likes').del()

  await knex('likes').insert([
    { id: 1, user_id: 2, post_id: 1 },
    { id: 2, user_id: 3, post_id: 1 },
  ])
}
