'use strict';

const fs = require(`fs`).promises;
const path = require(`path`);

const {
  snuffle,
  randomInt,
  pad
} = require(`../../../utils`);

const {
  TITLES,
  CATEGORIES,
  SENTENCES,
  MAX_POSTS_COUNT,
} = require(`../constants`);

const getRndField = (arr) => arr[randomInt(0, arr.length - 1)];

const generateDate = () => {
  // TODO: format date;
  const date = new Date();
  const year = date.getFullYear();
  const month = pad(date.getMonth(), 2);
  const day = pad(date.getDay(), 2)
  const hours = pad(date.getHours(), 2)
  const minutes = pad(date.getMinutes(), 2);
  const seconds = pad(date.getHours(), 2)
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const generatePost = () => {

  return {
    title: getRndField(TITLES),
    announce: snuffle(SENTENCES).slice(0, randomInt(1, 5)).join(` `),
    fullText: snuffle(SENTENCES).slice(0, randomInt(1, SENTENCES.length)).join(` `),
    category: snuffle(CATEGORIES).slice(0, randomInt(1, 3)),
    date: generateDate()
  };
};

const writeFile = (outDir, posts) => {
  return fs.mkdir(outDir, {recursive: true})
    .then(() => fs.writeFile(`${outDir}/mocks.json`, JSON.stringify(posts, null, 2)));
};

const generate = async (commandManager, args) => {
  const count = +args[0];

  if (count > MAX_POSTS_COUNT) {
    throw Error(`Максимальное количество публикаций ${MAX_POSTS_COUNT}`);
  }

  const outDir = path.resolve(__dirname, `../../../../`);
  const offers = count ? [...Array(count).keys()].map(() => generatePost()) : [];

  return writeFile(outDir, offers);
};

module.exports = generate;
