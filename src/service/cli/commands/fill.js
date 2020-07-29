'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const moment = require(`moment`);

const {
  shuffle,
  randomInt
} = require(`../../../utils`);

const {
  MAX_POSTS_COUNT
} = require(`../../constants`);

const usersData = [{
  id: 1,
  name: `Евгений Cмирнов`,
  email: `evgen2002@ya.ru`,
  avatar: `/img/avatar-1.png`,
  password: `5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5`,
}, {
  id: 2,
  name: `Василий Уткин`,
  email: `vas12121@ya.ru`,
  avatar: `/img/avatar-2.png`,
  password: `5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5`,
}];

const getRndField = (arr) => arr[randomInt(0, arr.length - 1)];

const generatePicture = () => {
  const pictures = [`forest`, `sea`, `skyscraper`, null];
  const picture = pictures[randomInt(0, pictures.length)];
  return (
    picture ? JSON.stringify({
      orig: `${picture}@2x.jpg`,
      big: `${picture}@2x.jpg`,
      small: `${picture}@1x.jpg`,
    }) : null
  );
};

const makeCommentsQuery = (comments) => {
  return `-- comments
INSERT INTO public.comments (text, author_id, article_id) VALUES 
\t${comments.map((comment) => `('${comment.text}', ${comment.author.id}, ${comment.article.id})`).join(`,\n\t`)};\n\n`;
};

const makeCategoriesQuery = (categories) => {
  return `-- categories
INSERT INTO public.categories (name) VALUES
\t${categories.map((category) => `('${category.name}')`).join(`,\n\t`)};\n\n`;
};

const makeArticlesQuery = (articles) => {
  return `-- articles
INSERT INTO public.articles (title, announce, full_text, picture, author_id, created_at) VALUES
\t${articles.map((article) => `('${article.title.slice(0, 250)}', '${article.announce.slice(0, 250)}', '${article.fullText}', ${article.picture ? `'${article.picture}'` : null}, ${article.author.id}, '${article.createdAt}')`).join(`,\n\t`)};\n\n`;
};

const makeArticlesCategoriesQuery = (items) => {
  return `-- articles_categories
INSERT INTO public.articles_categories (article_id, category_id) VALUES
\t${items.map((item) => `(${item.article.id}, ${item.category.id})`).join(`,\n\t`)};\n\n`;
};

const makeUsersQuery = (users) => {
  return `-- users
INSERT INTO public.users (name, email, avatar, password) VALUES
\t${users.map((user) => `('${user.name}', '${user.email}', '${user.avatar}', '${user.password}')`).join(`,\n\t`)};\n\n`;
};

const generateDate = () => {
  const now = moment();
  const diff = +now - +now.subtract(2, `months`);
  const randomDate = +now - randomInt(0, diff);
  return moment(randomDate).format(`YYYY-MM-DD hh:mm:ss`);
};

const generatePost = (id, titles, sentences, users) => {
  return {
    id,
    title: getRndField(titles),
    announce: shuffle(sentences).slice(0, randomInt(1, 5)).join(` `),
    fullText: shuffle(sentences).slice(0, randomInt(1, sentences.length)).join(` `),
    picture: generatePicture(),
    author: users[randomInt(0, users.length - 1)],
    createdAt: generateDate()
  };
};

const generateCategory = (id, name) => {
  return {
    id,
    name
  };
};

const generateComment = (id, text, author, article) => {
  return {
    id,
    text,
    author,
    article
  };
};

const writeFile = (outDir, data) => {
  const {articles, categories, comments, categoriesForArticles, users} = data;
  let query = ``;

  query += makeUsersQuery(users);
  query += makeArticlesQuery(articles);
  query += makeCategoriesQuery(categories);
  query += makeArticlesCategoriesQuery(categoriesForArticles);
  query += makeCommentsQuery(comments);

  return fs.mkdir(outDir, {recursive: true})
    .then(() => fs.writeFile(`${outDir}/fill-db.sql`, query));
};

const readFile = (file) => {
  return fs.readFile(file, `utf8`).then((data) => data.split(/\r?\n/));
};

const fill = async (manager, args) => {
  const count = +args[0] || 0;

  if (count > MAX_POSTS_COUNT) {
    throw Error(`Максимальное количество публикаций ${MAX_POSTS_COUNT}`);
  }

  const rootDir = `${process.cwd()}/data`;

  const sentences = await readFile(`${rootDir}/sentences.txt`);
  const cats = await readFile(`${rootDir}/categories.txt`);
  const titles = await readFile(`${rootDir}/titles.txt`);
  const commentsTxt = await readFile(`${rootDir}/comments.txt`);

  const articles = Array(count).fill({})
    .map((_item, idx) => generatePost(idx + 1, titles, sentences, usersData));

  const categories = cats.map((cat, idx) => generateCategory(idx + 1, cat));

  const comments = articles.reduce((acc, article) => {
    const replies = shuffle(commentsTxt)
      .slice(0, randomInt(1, commentsTxt.length))
      .map((text, idx) => generateComment(idx + 1, text, usersData[randomInt(0, usersData.length - 1)], article));
    return [...acc, ...replies];
  }, []);

  const categoriesForArticles = articles.reduce((acc, article) => {
    const items = shuffle(categories)
      .slice(0, randomInt(1, categories.length))
      .map((category) => ({category, article}));
    return [...acc, ...items];
  }, []);

  const data = {
    articles,
    comments,
    categories,
    categoriesForArticles,
    users: usersData
  };

  return writeFile(process.cwd(), data)
    .then(() => console.log(chalk.green(`Сгенерировано ${articles.length} предложений!`)));
};

module.exports = fill;
