'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const {
  shuffle,
  randomInt,
  formatDate
} = require(`../../../utils`);

const {
  MAX_POSTS_COUNT,
  ID_LEN
} = require(`../../constants`);

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

const generateComments = (comments) => {
  return shuffle(comments)
    .slice(0, randomInt(1, comments.length))
    .map((text) => ({
      id: nanoid(ID_LEN),
      text
    }));
};

const generatePost = (titles, sentences, categories, comments) => {
  const getDate = generateDate();
  return {
    id: nanoid(ID_LEN),
    title: getRndField(titles),
    announce: shuffle(sentences).slice(0, randomInt(1, 5)).join(` `),
    fullText: shuffle(sentences).slice(0, randomInt(1, sentences.length)).join(` `),
    createdDate: getDate(),
    category: shuffle(categories).slice(0, randomInt(1, 3)),
    comments: generateComments(comments)
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

  const rootDir = `${process.cwd()}/data`;

  const sentences = await readFile(`${rootDir}/sentences.txt`);
  const categories = await readFile(`${rootDir}/categories.txt`);
  const titles = await readFile(`${rootDir}/titles.txt`);
  const comments = await readFile(`${rootDir}/comments.txt`);

  const posts = Array(count).fill(``)
    .map(() => generatePost(titles, sentences, categories, comments));

  return writeFile(process.cwd(), posts)
    .then(() => console.log(chalk.green(`Сгенерировано ${posts.length} публикаций`)));
};

module.exports = generate;
