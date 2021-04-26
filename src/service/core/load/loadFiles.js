'use strict';

const _ = require(`lodash`);
const glob = require(`./glob`);
const filePathToPath = require('./fileToPropPath');
const fse = require(`fs-extra`);
const path = require(`path`);

const loadFiles = async (dir, pattern, opts = {}) => {
  const {requireFn = require, shouldUseFileNameAsKey = () => true, globArgs = {}} = opts;

  const root = {};

  const files = await glob(pattern, { cwd: dir, ...globArgs });

  for (let file of files) {
    const absolutePath = path.resolve(dir, file);

    // load module
    delete require.cache[absolutePath];
    let mod;

    if (path.extname(absolutePath) === '.json') {
      mod = await fse.readJson(absolutePath);
    } else {
      mod = requireFn(absolutePath);
    }

    Object.defineProperty(mod, '__filename__', {
      enumerable: true,
      configurable: false,
      writable: false,
      value: path.basename(file),
    });

    const propPath = filePathToPath(file, shouldUseFileNameAsKey(file));

    if (propPath.length === 0) _.merge(root, mod);
    _.merge(root, _.setWith({}, propPath, mod, Object));
  }

  return root;
};

module.exports = loadFiles;
