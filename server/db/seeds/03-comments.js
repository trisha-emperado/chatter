export async function seed(knex) {
  await knex('comments').del()

  await knex('comments').insert([
    {
      id: 1,
      user_id: 1,
      post_id: 1,
      content: 'Nice',
      created_at: '2024-09-04T12:00:00.000',
    },
    {
      id: 2,
      user_id: 1,
      post_id: 1,
      content: 'Wow amazing',
      created_at: '2024-09-04T12:00:00.000',
    },
    {
      id: 3,
      user_id: 1,
      post_id: 1,
      content: 'AKJBFKLHBkjbfglzkhrgugkjbkvsbfkjwesherdgkjbszeklrjvgkj',
      created_at: '2024-09-04T12:00:00.000',
    },
  ])
}
