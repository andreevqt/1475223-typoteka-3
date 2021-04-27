'use strict';

const _ = require(`lodash`);

const mountRoutes = (app) => {
  _.forIn(app.routes, (route) => {
    const [controller, method] = route.handler.split(`.`);    
    const targetController = _.get(app.controllers, controller);
    if (!targetController) {
      return;
    }

    const cb = targetController[method];
    app.router[route.method.toLowerCase()](route.path, cb);
  });
};

module.exports = mountRoutes;
