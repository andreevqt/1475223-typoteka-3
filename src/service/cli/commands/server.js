'use strict';

const express = require(`express`);
const {once} = require(`events`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const app = express();
app.use(express.json());

app.use(`/posts`, async (_req, res) => {
  try {
    const posts = await getMocks();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).send(err);
  }
});

const getMocks = async () => {
  return JSON.parse(await fs.readFile(`mocks.json`, `utf8`));
};

const server = (manager, args) => {
  const port = args[0] || 3000;
  return once(app.listen(port), `listening`)
    .then(() => console.log(chalk.green(`Ожидаю соединений на ${port}`)));
};

module.exports = server;
