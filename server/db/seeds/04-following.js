export async function seed(knex) {
  await knex('following').del()

  await knex('following').insert([
    { follower_id: 1, followed_id: 1 }
  ]);
};
