'use strict'

const {readData, shuffle, randomInt} = require(`../../utils`);
const moment = require(`moment`);

const getRndField = (arr) => arr[randomInt(0, arr.length - 1)];

const generateDate = () => {
  const now = moment();
  const diff = +now - +now.subtract(2, `months`);
  const randomDate = +now - randomInt(0, diff);
  return moment(randomDate).format(`YYYY-MM-DD hh:mm:ss`);
};

const generatePicture = () => {
  const pictures = [`forest@2x.jpg`, `sea@2x.jpg`, `skyscraper@2x.jpg`];
  return pictures[randomInt(0, pictures.length - 1)];
};

module.exports.seed = async function (knex) {
  const {count = 0} = knex.userParams;

  const dir = `${process.cwd()}/data`;

  const usersData = [{
    name: `Евгений Cмирнов`,
    email: `evgen2002@ya.ru`,
    avatar: `/img/avatar02.jpg`,
    password: `5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5`,
  }, {
    name: `Василий Уткин`,
    email: `vas12121@ya.ru`,
    avatar: `/img/avatar.jpg`,
    password: `5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5`,
  }];

  // users
  await knex(`users`).del();
  const users = await knex(`users`)
    .insert(usersData)
    .returning(`*`);

  // categories
  await knex(`categories`).del();
  const categoriesText = await readData(`${dir}/categories.txt`);
  const categories = await knex(`categories`)
    .insert(categoriesText.map((name) => ({name})))
    .returning(`*`);

  // articles
  await knex(`articles`).del();

  const titles = await readData(`${dir}/titles.txt`);
  const sentences = await readData(`${dir}/sentences.txt`);

  const articles = await knex(`articles`).insert(Array(count).fill({}).map(() => ({
    title: getRndField(titles),
    announce: shuffle(sentences).slice(0, randomInt(1, 5)).join(` `),
    full_text: shuffle(sentences).slice(0, randomInt(1, sentences.length)).join(` `),
    picture: generatePicture(),
    author_id: users[randomInt(0, users.length - 1)].id,
    created_at: generateDate(),
    updated_at: generateDate(),
  }))).returning(`*`);


  // articles_categories
  await knex(`articles_categories`).del();
  const articlesCategories = articles.reduce((acc, article) => {
    const items = shuffle(categories)
      .slice(0, randomInt(1, categories.length))
      .map((category) => ({category_id: category.id, article_id: article.id}));
    return [...acc, ...items];
  }, []);
  await knex(`articles_categories`).insert(articlesCategories);

  // comments
  await knex(`comments`).del();
  const commentsTxt = await readData(`${dir}/comments.txt`);
  const comments = articles.reduce((acc, article) => {
    const replies = shuffle(commentsTxt)
      .slice(0, randomInt(1, commentsTxt.length))
      .map((text) => ({
        text,
        author_id: users[randomInt(0, users.length - 1)].id,
        article_id: article.id,
        created_at: generateDate(),
        updated_at: generateDate()
      }));
    return [...acc, ...replies];
  }, []);
  await knex(`comments`).insert(comments);
};
