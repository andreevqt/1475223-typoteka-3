'use strict';

const loadApis = require(`./loadApis`);

const loadModules = async (app) => {
  const [api] = await Promise.all([
    loadApis(app)
  ]);

  return {
    api
  };
}

module.exports = loadModules;
