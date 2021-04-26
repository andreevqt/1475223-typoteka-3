'use strict';

const path = require(`path`);

const loadFiles = require(`./loadFiles`);
const {existsSync} = require('fs-extra');

const loadApis = async ({dir}) => {
  const apiDir = path.join(dir, `api`);

  if (!existsSync(apiDir)) {
    throw new Error(
      `Missing api folder. Please create one in your api directory`
    );
  }

  const apis = await loadFiles(apiDir, '**/*.*js');

  return apis;
}

module.exports = loadApis;
