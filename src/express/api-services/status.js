'use strict';

const Base = require(`src/express/api-services/base`);
const axios = require(`axios`);

class Status extends Base {
  async getStatus() {
    try {
      const response = (await axios.get(this.url)).data;
      return response.status;
    } catch (err) {
      return `down`;
    }
  }
}

module.exports = Status;


