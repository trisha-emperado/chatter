/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('comments', (table) => {
    table.increments('id').primary()
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE')
    table.integer('post_id').references('id').inTable('posts').onDelete('CASCADE')
    table.string('content')
    table.timestamp('created_at')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('comments')
};
