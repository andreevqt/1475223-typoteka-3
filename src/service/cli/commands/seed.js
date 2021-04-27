'use strict';

const Seeder = require(`../../core/migrations/Seeder`);

module.exports = async (manager, args) => {
  const seeder = new Seeder();
  try {
    await seeder.init();
    await seeder.seed();
  } catch (err) {
    throw err;
  } finally {
    await seeder.destroy();
  }
};
