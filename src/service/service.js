'use strict';

const ConsoleCommandManager = require(`./cli/ConsoleCommandManager`);
const chalk = require(`chalk`);
const {
  generate,
  version,
  help,
  server
} = require(`./cli/commands`);

const command = process.argv[2];
const args = process.argv.slice(3);

/* eslint-disable */
const commandManager = new ConsoleCommandManager(
  `server`,
  `Программа запускает http-сервер и формирует файл с данными для API.`
);
/* eslint-enable */

commandManager
  .add(`--generate`, `формирует файл mocks.json`, generate, [`count`])
  .add(`--version`, `выводит номер версии`, version)
  .add(`--help`, `печатает этот текст`, help)
  .add(`--server`, `запускает http-server`, server, [`port`])
  .execute(command, args)
  .catch((err) => {
    console.log(chalk.red(`Ошибка`));
    console.log(chalk.red(err.message));
    process.exit(1);
  });
