/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('followers', (table) => {
    table.increments('id').primary()
    table.string('follower_id').notNullable()
    table.string('following_id').notNullable()
    table
      .foreign('follower_id')
      .references('auth_id')
      .inTable('users')
      .onDelete('CASCADE')
    table
      .foreign('following_id')
      .references('auth_id')
      .inTable('users')
      .onDelete('CASCADE')

    table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('followers')
}
