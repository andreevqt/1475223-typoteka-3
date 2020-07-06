'use strict';

const fs = require(`fs`).promises;

module.exports = async () => JSON.parse(await fs.readFile(`${process.cwd()}/mocks.json`));
