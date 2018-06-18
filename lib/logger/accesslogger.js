var log4js = require("log4js");
var logger = require("./logger.js");

module.exports = function (options) {
  options = options || { level: "auto" };
  return log4js.connectLogger(logger.access, options);
};