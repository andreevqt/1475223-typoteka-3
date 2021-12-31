'use strict';
const Base = require(`src/express/api-services/base`);
const axios = require(`axios`);
const {Http} = require(`../../service/constants`);

class Users extends Base {
  async login(email, password) {
    let result;
    let errors;

    try {
      result = (await axios.post(`${this.url}/login`, {email, password})).data;
    } catch (err) {
      if (!(err.response && err.response.status === Http.FO)) {
        throw err;
      }
      errors = {email: `Неправильный email или пароль`};
    }

    return {
      result,
      errors
    };
  }

  async register(attrs) {
    return (await axios.post(`${this.url}`, attrs)).data;
  }

  async refresh(token) {
    return (await axios.post(`${this.url}/refresh`, {token})).data;
  }

  async logout(token) {
    return (await axios.delete(`${this.url}/logout`, {data: {token}})).data;
  }

  async resetPassword(oldPassword, newPassword) {
    let result;
    let errors;

    try {
      result = (await axios.post(`${this.url}/reset-password`, {oldPassword, newPassword})).data;
    } catch (err) {
      if (!(err.response && err.response.status === 400)) {
        throw err;
      }
      errors = err.response.data;
    }

    return {
      result,
      errors
    };
  }
}

module.exports = Users;
