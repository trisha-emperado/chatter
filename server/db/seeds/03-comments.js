export async function seed(knex) {
  await knex('comments').del()

  await knex('comments').insert([
    { id: 1, user_id: 1, post_id: 1, content: 'Nice', created_at: "2024-09-04T12:00:00.000Z" }
  ]);
};
