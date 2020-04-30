'use strict';

const ConsoleCommandManager = require(`./cli/ConsoleCommandManager`);
const {
  generate,
  version,
  help
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
  .execute(command, args)
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });
