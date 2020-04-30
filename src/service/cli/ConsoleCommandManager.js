'use strict';

class ConsoleCommandManager {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.commands = new Map();
  }

  add(name, description, cb, args = []) {
    this.commands.set(name, {name, description, cb, args});
    return this;
  }

  async execute(name, args) {
    const command = this.commands.get(name);

    if (!command) {
      throw new Error(`Неизвестная команда`);
    }

    return command.cb(this, args);
  }
}

module.exports = ConsoleCommandManager;
