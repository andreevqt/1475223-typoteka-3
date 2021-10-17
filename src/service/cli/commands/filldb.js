'use strict';

const {Category, Article, Comment, User, service} = require(`../../models`);
const moment = require(`moment`);

const {
  readData,
  shuffle,
  randomInt,
} = require(`../../../utils`);

const {data} = require(`../../test-setup`);

const generatePicture = () => {
  const pictures = [`forest@2x.jpg`, `sea@2x.jpg`, `skyscraper@2x.jpg`];
  return pictures[randomInt(0, pictures.length - 1)];
};

const generateDate = () => {
  const now = moment();
  const diff = +now - +now.subtract(2, `months`);
  const randomDate = +now - randomInt(0, diff);
  return moment(randomDate).format(`YYYY-MM-DD hh:mm:ss`);
};

const getRndField = (arr) => arr[randomInt(0, arr.length - 1)];

const filldb = async (manager, args) => {
  const count = +args[0] || 0;
  const root = `${process.cwd()}/data`;

  // users
  await service.bulkDelete(`users`);
  const users = await User.bulkCreate(data.users);

  // categories
  await service.bulkDelete(`categories`);
  const categoriesText = await readData(`${root}/categories.txt`);
  const categories = await Category.bulkCreate(categoriesText.map((name) => ({
    name,
    createdAt: generateDate(),
    updatedAt: generateDate()
  })));

  /* eslint-disable indent */
  // articles
  await service.bulkDelete(`articles`);
  const titles = await readData(`${root}/titles.txt`);
  const sentences = await readData(`${root}/sentences.txt`);
  const articles = await Article.bulkCreate(
    Array(count).fill({})
      .map(() => ({
        title: getRndField(titles),
        announce: shuffle(sentences).slice(0, randomInt(1, 5)).join(` `),
        fullText: shuffle(sentences).slice(0, randomInt(1, sentences.length)).join(` `),
        picture: generatePicture(),
        authorId: users[randomInt(0, users.length - 1)].id,
        createdAt: generateDate(),
        updatedAt: generateDate(),
      }))
  );
  /* eslint-enable */

  // articles_categories
  await service.bulkDelete(`articles_categories`);
  const articlesCategories = articles.reduce((acc, article) => {
    const items = shuffle(categories)
      .slice(0, randomInt(1, categories.length))
      .map((category) => ({categoryId: category.id, articleId: article.id}));
    return [...acc, ...items];
  }, []);
  await service.bulkInsert(`articles_categories`, articlesCategories);

  // comments
  await service.bulkDelete(`comments`, null, {});
  const commentsTxt = await readData(`${root}/comments.txt`);
  const comments = articles.reduce((acc, article) => {
    const replies = shuffle(commentsTxt)
      .slice(0, randomInt(1, commentsTxt.length))
      .map((text) => ({
        text,
        authorId: users[randomInt(0, users.length - 1)].id,
        articleId: article.id,
        createdAt: generateDate(),
        updatedAt: generateDate()
      }));
    return [...acc, ...replies];
  }, []);
  await Comment.bulkCreate(comments);

  await service.close();
};

module.exports = filldb;
