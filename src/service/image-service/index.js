'use strict';

const sharp = require(`sharp`);
const path = require(`path`);
const config = require(`../../../config`);
const fs = require(`fs`).promises;

const url = `${config.app.url}:${config.server.port}/uploads`;
const uploadPath = path.resolve(__dirname, `../public/uploads`);

const makeFromBuffer = async (src, width, height) => {
  const decoded = Buffer.from(src, `base64`);
  if (decoded.toString(`base64`) !== src) {
    return;
  }

  return make(decoded, width, height);
};

const make = async (src, width, height) => {
  const image = sharp(src);
  const ext = (await image.metadata()).format;

  const small = image.clone().resize(width, height);
  const big = image.clone().resize(width * 2, height * 2);
  const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;

  const origName = `${uniquePrefix}.${ext}`;
  const smallName = `${uniquePrefix}__small.${ext}`;
  const bigName = `${uniquePrefix}__big.${ext}`;

  await small.toFile(`${uploadPath}/${smallName}`);
  await big.toFile(`${uploadPath}/${bigName}`);
  await image.toFile(`${uploadPath}/${origName}`);

  return {
    orig: `${url}/${origName}`,
    small: `${url}/${smallName}`,
    big: `${url}/${bigName}`
  };
};

const remove = async (picture) => {
  if (!picture) {
    return;
  }

  const small = `${uploadPath}/${path.basename(picture.small)}`;
  const orig = `${uploadPath}/${path.basename(picture.orig)}`;
  const big = `${uploadPath}/${path.basename(picture.big)}`;

  await fs.unlink(orig);
  await fs.unlink(small);
  await fs.unlink(big);
};

module.exports = {
  make,
  makeFromBuffer,
  remove,
};
