var log4js = require("log4js");
var levels = require("log4js/lib/levels.js")();
var system, application, access, getMiddleware;

// Initialize log4js configuration.
log4js.configure("./config/log4js.config.json");

// Get logger.
system = log4js.getLogger("system");
application = log4js.getLogger("application");
access = log4js.getLogger("access");

// Modify applicaiton logger's log output methods.
for (let level of levels.levels) {
  level = level.toLowerCase();

  /**
   * @param {string}  id      function id.
   * @param {string}  message error message.
   */
  application[level] = function (id, message) {
    if (!message) {
      message = id;
      id = "application";
    }
    application.addContext("functionId", id);
    var proto = Object.getPrototypeOf(application);
    proto[level].call(application, message);
  };
}

// Exports module.
module.exports = {
  log4js,
  system,
  application,
  access
};