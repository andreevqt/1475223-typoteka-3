'use strict';

const packageJson = require(`../../../../package.json`);
const chalk = require(`chalk`);


const version = async () => {
  console.log(chalk.blue(packageJson.version));
};

module.exports = version;
