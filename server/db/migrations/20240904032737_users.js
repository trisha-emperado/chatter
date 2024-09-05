/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('auth_id')
    table.string('username').unique()
    table.string('name')
    table.string('current_role')
    table.integer('age')
    table.string('profile_picture_url').defaultTo('')
    table.string('cohort')
    table.string('facilitator')
    table.string('github_url')
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('users')
}
