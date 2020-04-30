"use strict";

const fs = require(`fs`).promises;
const path = require(`path`);

const {
  snuffle,
  randomInt,
  formatDate
} = require(`../../../utils`);

const {
  TITLES,
  CATEGORIES,
  SENTENCES,
  MAX_POSTS_COUNT,
} = require(`../constants`);

const getRndField = (arr) => arr[randomInt(0, arr.length - 1)];

const generateDate = () => {
  const from = new Date();
  const to = new Date();
  to.setMonth(from.getMonth() - 2);

  return () => {
    const diff = from - to;
    const randomDate = +from - randomInt(0, diff);
    return formatDate(new Date(randomDate));
  };
};

const generatePost = () => {
  const getDate = generateDate();
  return {
    title: getRndField(TITLES),
    announce: snuffle(SENTENCES).slice(0, randomInt(1, 5)).join(` `),
    fullText: snuffle(SENTENCES).slice(0, randomInt(1, SENTENCES.length)).join(` `),
    createdDate: getDate(),
    category: snuffle(CATEGORIES).slice(0, randomInt(1, 3)),
  };
};

const writeFile = (outDir, posts) => {
  return fs.mkdir(outDir, {recursive: true})
    .then(() =>
      fs.writeFile(`${outDir}/mocks.json`, JSON.stringify(posts, null, 2))
    );
};

const generate = async (manager, args) => {
  const count = +args[0];

  if (count > MAX_POSTS_COUNT) {
    throw Error(`Максимальное количество публикаций ${MAX_POSTS_COUNT}`);
  }

  const outDir = path.resolve(__dirname, `../../../../`);
  const posts = count
    ? [...Array(count).keys()].map(() => generatePost())
    : [];

  return writeFile(outDir, posts);
};

module.exports = generate;
