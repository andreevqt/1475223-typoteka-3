'use strict';

const {maxStringLen} = require(`../../../utils`);
const chalk = require(`chalk`);

const help = async (manager/* , args */) => {
  const {commands, name, description} = manager;

  const commandsToPrint = Array.from(commands).map((val) => {
    const command = val[1];
    const params = command.args.map((arg) => `<${arg}>`).join(` `);
    return {
      name: `${command.name + (params && ` ${params}`)}:`,
      description: command.description
    };
  });

  const max = maxStringLen(commandsToPrint.map((command) => command.name));

  const align = (str) => {
    const toFill = Array(max - str.length).fill(` `).join(``);
    return str + toFill;
  };

  let out = `    ${description}\n\n`;

  out += `    Гайд:\n`;
  out += `    ${name} <command>\n\n`;

  out += `    Команды:\n`;
  commandsToPrint.forEach((command) => {
    out += `    ${align(command.name)}  ${command.description}\n`;
  });

  console.log(chalk.grey(out));
};

module.exports = help;
