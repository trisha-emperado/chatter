/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('posts', (table) => {
    table.increments('id').primary()
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.string('content')
    table.string('image_url')
    table.string('file_url')
    table.integer('likes')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('posts')
}
