'use strict';

const packageJson = require(`../../../../package.json`);

const version = async (/* commandsManager,  args */) => {
  console.log(packageJson.version);
};

module.exports = version;
