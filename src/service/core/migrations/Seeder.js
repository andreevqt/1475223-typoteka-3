'use strict';

const Base = require(`./MigratorBase`);
const path = require(`path`);

class Seeder extends Base {
  constructor() {
    super();
    this.setDir(path.resolve(__dirname, `../../seeders`));
  }

  async seed() {
    return this.knex.seed.run({directory: this.dir});
  }
}

module.exports = Seeder;
