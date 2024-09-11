export async function seed(knex) {
  await knex('comments').del()

  await knex('comments').insert([
    {
      id: 1,
      user_id: 3,
      post_id: 1,
      content: 'Me! Me! 🙋🏻‍♀️ I want to know!',
      created_at: '2024-09-04T12:00:00.000',
    },
    {
      id: 2,
      user_id: 2,
      post_id: 1,
      content: 'Wow amazing ☺️',
      created_at: '2024-09-04T12:00:00.000',
    },
    {
      id: 3,
      user_id: 4,
      post_id: 4,
      content: 'Hey, I know someone - direct message me!',
      created_at: '2024-09-04T12:00:00.000',
    },
    {
      id: 3,
      user_id: 5,
      post_id: 3,
      content: 'We can help 👩🏻‍💻👨🏻‍💻!',
      created_at: '2024-09-04T12:00:00.000',
    },
  ])
}
