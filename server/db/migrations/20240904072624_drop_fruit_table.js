/**
 * @param {import('knex').Knex} knex
 */
export async function up(knex) {
  return knex.schema.dropTableIfExists('fruit');
}

/**
 * @param {import('knex').Knex} knex
 */
export async function down(knex) {
  return knex.schema.createTable('fruit', (table) => {
    table.increments('id');
    table.string('name');
    table.string('owner').defaultTo(null);
  });
}
