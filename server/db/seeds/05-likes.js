export async function seed(knex) {
  await knex('likes').del()

  await knex('likes').insert([
    { post_id: 1, user_id: 1, created_at: knex.fn.now() },
  ])
}
