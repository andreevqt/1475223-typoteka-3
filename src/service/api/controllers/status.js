'use strict';

const {http} = require(`../../constants`);
const config = require(`../../../../config`);

module.exports = (_services) => ({
  status: async (req, res) => {
    res.status(http.OK).json({status: config.server.enabled ? `up` : `down`});
    return;
  }
});
