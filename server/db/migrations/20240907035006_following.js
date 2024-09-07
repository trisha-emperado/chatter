/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('following', (table) => {
    table.integer('follower_id').references('id').inTable('users').onDelete('CASCADE')
    table.integer('followed_id').references('id').inTable('users').onDelete('CASCADE')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('following')
};
