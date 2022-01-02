'use strict';

const {Http} = require(`../../constants`);
const config = require(`../../../../config`);

const status = (_services) => ({
  status: async (req, res) => {
    res.status(Http.OK).json({status: config.server.enabled ? `up` : `down`});
    return;
  }
});

module.exports = status;
