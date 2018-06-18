var log4js = require("log4js");
var logger = require("./logger.js");
var system = logger.system;

module.exports = function (options) {
  return function (err, req, res, next) {
    system.error(err.message);
    next();
  };
};
