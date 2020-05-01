'use strict';

const http = require(`http`);
const path = require(`path`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const getMocks = async () => {
  const root = path.resolve(__dirname, `../../../../`);
  const mocks = JSON.parse(await fs.readFile(`${root}/mocks.json`, `utf8`));
  return `<ul>
    ${mocks.map((mock) => `<li>${mock.title}</li>`).join(``)}
  </ul>`;
};

const response = (res, status, data, type = `text/html`) => {
  res.writeHead(status, {
    [`Content-Type`]: `${type}; charset=UTF-8`
  });
  res.end(data);
};

const onClientConnect = async (req, res) => {
  switch (req.url) {
    case `/`:
      try {
        const mocks = await getMocks();
        response(res, 200, mocks);
      } catch (err) {
        response(res, 404, `404 Not found`, `text\plain`);
      }
      break;
    default:
      response(res, 404, `404 Not found`, `text\plain`);
  }
};

const server = async (manager, args) => {
  const port = args[0] || 3000;
  const httpServer = http.createServer(onClientConnect);

  httpServer.listen(port, (err) => {
    if (err) {
      console.log(chalk.red(err.message));
    }

    return console.log(`Сервер слушает ${port} порт`);
  });
};

module.exports = server;
