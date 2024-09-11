export async function seed(knex) {
  await knex('posts').del()

  await knex('posts').insert([
    {
      id: 1,
      user_id: 1,
      content:
        'Hey everyone, I just learnt about AWS and finished my certification for it. I could share my knowledge if anyone wanted to learn about it? Let me know!',
      image_url: '',
      file_url: '',
      likes: 5,
      created_at: '2024-09-04T12:00:00.000',
    },
    {
      id: 2,
      user_id: 2,
      content: 'How is everyone going?',
      image_url: '',
      file_url: '',
      likes: 10,
      created_at: '2024-09-04T12:00:00.000',
    },
    {
      id: 3,
      user_id: 3,
      content: 'I need a job ASAP - help!',
      image_url: '',
      file_url: '',
      likes: 7,
      created_at: '2024-09-04T12:00:00.000',
    },
    {
      id: 4,
      user_id: 4,
      content:
        'There is a job opening at the company I work at, anyone keen to apply?',
      image_url: '',
      file_url: '',
      likes: 7,
      created_at: '2024-09-04T12:00:00.000',
    },
    {
      id: 5,
      user_id: 5,
      content:
        'Remember to assessments are due this Sunday at 5PM. On. the. dot.',
      image_url: '',
      file_url: '',
      likes: 7,
      created_at: '2024-09-04T12:00:00.000',
    },
  ])
}
