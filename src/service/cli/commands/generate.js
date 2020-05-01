'use strict';

const fs = require(`fs`).promises;
const path = require(`path`);
const chalk = require(`chalk`);

const {
  snuffle,
  randomInt,
  formatDate
} = require(`../../../utils`);

const {
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

const generatePost = (titles, sentences, categories) => {
  const getDate = generateDate();
  return {
    title: getRndField(titles),
    announce: snuffle(sentences).slice(0, randomInt(1, 5)).join(` `),
    fullText: snuffle(sentences).slice(0, randomInt(1, sentences.length)).join(` `),
    createdDate: getDate(),
    category: snuffle(categories).slice(0, randomInt(1, 3)),
  };
};

const writeFile = (outDir, posts) => {
  return fs.mkdir(outDir, {recursive: true})
    .then(() =>
      fs.writeFile(`${outDir}/mocks.json`, JSON.stringify(posts, null, 2))
    );
};

const readFile = (file) => {
  return fs.readFile(file, `utf8`).then((data) => data.split(/\r?\n/));
};

const generate = async (manager, args) => {
  const count = +args[0] || 0;

  if (count > MAX_POSTS_COUNT) {
    throw Error(`Максимальное количество публикаций ${MAX_POSTS_COUNT}`);
  }

  const rootDir = path.resolve(__dirname, `../../../../`);

  const sentences = await readFile(`${rootDir}/data/sentences.txt`);
  const categories = await readFile(`${rootDir}/data/categories.txt`);
  const titles = await readFile(`${rootDir}/data/titles.txt`);

  const posts = Array(count).fill(``)
    .map(() => generatePost(titles, sentences, categories));

  return writeFile(rootDir, posts)
    .then(() => console.log(chalk.green(`Сгенерировано ${posts.length} публикаций`)));
};

module.exports = generate;
