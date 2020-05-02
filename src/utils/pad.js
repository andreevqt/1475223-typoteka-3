'use strict';

module.exports = (num, size) => (`000000000` + num).substr(-size);
