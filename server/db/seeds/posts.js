export async function seed(knex) {
  await knex('posts').del()

  await knex('posts').insert([
    {
      id: 1, user_id: 1, content: 'Hello', image_url: '', file_url: '', likes: 1, comments: JSON.stringify([]), created_at: "2024-09-04T12:00:00.000Z"
    },
  ]);
};
