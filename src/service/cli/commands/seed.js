'use strict';

const Seeder = require(`../../core/migrations/Seeder`);

module.exports = async (manager, args) => {
  const count = +args[0] || 0;

  const seeder = new Seeder();
  try {
    await seeder.init();
    await seeder.seed(count);
  } catch (err) {
    throw err;
  } finally {
    await seeder.destroy();
  }
};
