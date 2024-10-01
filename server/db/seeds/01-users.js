export async function seed(knex) {
  await knex('users').del()

  await knex('users').insert([
    {
      id: 1,
      auth_id: 'authidhere',
      username: 'giogiorgio',
      name: 'Giovanni',
      current_role: 'Expert AWS Engineer',
      age: 30,
      profile_picture_url:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeUqKd_Bdt2PyKhVeuL5R7dQ9BsPon6Y32YA&s',
      cohort: 'Karaka-24',
      facilitator: false,
      github_url: 'https://github.com/giovanni-ambriz',
      header_image_url:
        'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,q_75,w_1200/v1/crm/queenstownnz/wanaka_tree_E1295D89-6EE2-4138-B7E2F6BC837C1213_3c771e1b-e3af-4a38-99e76baa849b4e2f.jpg',
    },
    {
      id: 2,
      auth_id: 'authid2',
      username: 'GGJUNE26',
      name: 'Georgia Harris',
      current_role: 'Poor Unemployed Graduate',
      age: 27,
      profile_picture_url:
        'https://m.media-amazon.com/images/I/513eV9QFlAL._AC_UF894,1000_QL80_.jpg',
      cohort: 'Karaka-24',
      facilitator: true,
      github_url: 'https://github.com/gharris26',
      header_image_url:
        'https://upload.wikimedia.org/wikipedia/en/1/1f/WomanYellingAtACat_meme.jpg',
    },
    {
      id: 3,
      auth_id: 'authid3',
      username: 'ahsirt.e',
      name: 'Trisha Emperado',
      current_role: 'Hopeful Software Developer',
      age: 27,
      profile_picture_url:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGHMF1KgRaERTaVAKjSYeBNPaxMMIeXtbtLw&s',
      cohort: 'Karaka-24',
      facilitator: false,
      github_url: 'https://github.com/trisha-emperado',
      header_image_url:
        'https://th-thumbnailer.cdn-si-edu.com/v_QRuNpWkqpSSe175Yr3cBfuNEE=/1000x750/filters:no_upscale()/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/31/7f/317f7f56-c30e-4a99-ba23-5f671018ddfb/japan-autumn-kyoto.jpg',
    },
    {
      id: 4,
      auth_id: 'authid4',
      username: 'Nora The Explorer',
      name: 'Nora',
      current_role: 'A++ Student',
      age: 19,
      profile_picture_url:
        'https://ih1.redbubble.net/image.4048453202.3700/st,small,845x845-pad,1000x1000,f8f8f8.jpg',
      cohort: 'Karaka',
      facilitator: false,
      github_url: 'github.com/manija-wahab',
      header_image_url:
        'https://64.media.tumblr.com/752e98a41362e1c7e51c7a50a78c179c/f56cd24a7cd794d6-54/s660x432/bb763082d79d0281b7d21a077816641b63e531fb.gif',
    },
    {
      id: 5,
      auth_id: 'authid5',
      username: 'John-Shrena',
      name: 'John-Shrna',
      current_role: 'Fantastic Facilitators',
      age: 32,
      profile_picture_url:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFxdYaM7ucFUnQlBcwauGbD52dVd3rDoBCcA&s',
      cohort: 'Karaka-18',
      facilitator: true,
      github_url: 'https://github.com/dev-academy-admin',
      header_image_url: '',
    },
  ])
}
