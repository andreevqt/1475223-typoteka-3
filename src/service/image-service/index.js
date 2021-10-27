'use strict';

const sharp = require(`sharp`);
const path = require(`path`);
const config = require(`../../../config`);
const fs = require(`fs`).promises;

const url = `${config.app.url}:${config.server.port}/upload`;
const uploadPath = path.resolve(__dirname, `../public/upload`);

const makeThumbnail = async (src, width, height) => {
  const decoded = Buffer.from(src, `base64`);
  if (decoded.toString(`base64`) !== src) {
    return null;
  }

  const image = sharp(decoded);
  const ext = (await image.metadata()).format;

  const small = image.clone().resize(width, height);
  const big = image.clone().resize(width * 2, height * 2);
  const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;

  const smallName = `${uniquePrefix}.${ext}`;
  const bigName = `${uniquePrefix}@2x.${ext}`;

  await small.toFile(`${uploadPath}/${smallName}`);
  await big.toFile(`${uploadPath}/${bigName}`);

  return {
    orig: `${url}/${src}`,
    small: `${url}/${smallName}`,
    big: `${url}/${bigName}`
  };
};

const removeThumbnail = async (src) => {
  const basename = path.basename(src);
  const small = `${uploadPath}/${basename}`;
  const big = `${uploadPath}/${basename.replace(/\.(?=[^.]*$)/, `@2x.`)}`;

  await fs.unlink(small);
  await fs.unlink(big);
};

module.exports = {
  makeThumbnail,
  removeThumbnail,
};
