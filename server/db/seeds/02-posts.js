export async function seed(knex) {
  await knex('posts').del()

  await knex('posts').insert([
    {
      id: 1,
      user_id: '1',
      content:
        'This is just some random text to make sure everything is working and im just typing anything over here',
      image_url: '',
      file_url: '',
      likes: 1,
      created_at: '2024-09-04T12:00:00.000',
    },
    {
      id: 2,
      user_id: '1',
      content:
        "Did you know that in Tekken 3, there's a hidden character named P. Jack? He’s an enhanced version of Jack, but he's not accessible through normal gameplay. To unlock him, you need to beat the game with all characters, which is a bit of a hidden challenge in itself!",
      image_url: '',
      file_url: '',
      likes: 1,
      created_at: '2024-09-04T12:00:00.000',
    },
    {
      id: 3,
      user_id: '1',
      content:
        'Space is a vast, infinite expanse filled with stars, planets, and mysteries, where time and gravity bend, and the possibilities are as limitless as the cosmos itself.',
      image_url: '',
      file_url: '',
      likes: 1,
      created_at: '2024-09-04T12:00:00.000',
    },
  ])
}
