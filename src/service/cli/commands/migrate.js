'use strict';

const Migrator = require(`../../core/migrations/Migrator`);

module.exports = async (manager, args) => {
  const migrator = new Migrator();
  try {
    await migrator.init();
    await migrator.migrate();
  } catch (err) {
    throw err;
  } finally {
    await migrator.destroy();
  }
};
