"use strict";

/**
 * @summary Logger - globally required module via webpack. Reserves `log` as a global variable.
 * @module Logger
 *
 * @example <caption>If you need to require this module explicitely</caption>
 * const log = require("logger.module");
 *
 * @example <caption>Create log messages</caption>
 * log.error("Message");
 * log.warn("Message");
 * log.info("Message");
 * log.debug("Message");
 * log.trace("Message");
 */

//--------------------------------------------------------------------------------------------------
// Dependencies
//--------------------------------------------------------------------------------------------------
const moment = require("moment");
const winston = require("winston");
const config = require("app.config");

const { combine, timestamp, printf } = winston.format;

//--------------------------------------------------------------------------------------------------
// Winston init
//--------------------------------------------------------------------------------------------------
const getUserFriendlyFormat = printf(info => {
   let level = `[${info.level}]`.padEnd(7).toUpperCase();
   let time = moment().format("YYYY-MM-DD HH:mm:ss");
   return `${time} ${level} ${info.message}`;
});

const logger = winston.createLogger({
   levels: {
      error: 0,
      warn: 1,
      info: 2,
      debug: 4,
      trace: 5
   },
   format: timestamp(),
   transports: [
      // NodeJS Console
      // new winston.transports.Console({
      // 	level: "trace",
      // 	colorize: true,
      // 	format: getUserFriendlyFormat
      // }),

      // JSON logs
      new winston.transports.File({
         filename: config.logger.paths.json.warn,
         format: winston.format.json(),
         level: "warn",
         json: true,
         timestamp: true
      }),
      new winston.transports.File({
         filename: config.logger.paths.json.trace,
         format: winston.format.json(),
         level: "trace",
         json: true,
         timestamp: true
      }),

      // User friendly logs
      new winston.transports.File({
         filename: config.logger.paths.txt.warn,
         format: getUserFriendlyFormat,
         level: "warn"
      }),
      new winston.transports.File({
         filename: config.logger.paths.txt.trace,
         format: getUserFriendlyFormat,
         level: "trace"
      })
   ]
});

//--------------------------------------------------------------------------------------------------
// Export interface
//--------------------------------------------------------------------------------------------------
/**
 * Create error message.
 * Log it as JSON, user friendly text (see app configuration) and write as console.error; into the app.
 * @param {string} message
 * @example
 * log.error("Error description");
 */
module.exports.error = message => {
   if (config.logger.levels.global && config.logger.levels.error) {
      logger.error(message);
      console.error(message);
   }
};

/**
 * Create warn message.
 * Log it as JSON, user friendly text (see app configuration) and write as console.warn; into the app.
 * @param {string} message
 * @example
 * log.warn("Warning description");
 */
module.exports.warn = message => {
   if (config.logger.levels.global && config.logger.levels.warn) {
      logger.warn(message);
      console.warn(message);
   }
};

/**
 * Create info message.
 * Log it as JSON, user friendly text (see app configuration) and write as console.info; into the app.
 * @param {string} message
 * @example
 * log.info("Information");
 */
module.exports.info = message => {
   if (config.logger.levels.global && config.logger.levels.info) {
      logger.info(message);
      console.info(message);
   }
};

/**
 * Create info message.
 * Log it as JSON, user friendly text (see app configuration) and write as console.debug; into the app.
 * @param {string} message
 * @example
 * log.debug("Debug information");
 */
module.exports.debug = message => {
   if (config.logger.levels.global && config.logger.levels.debug) {
      logger.debug(message);
   }
};

/**
 * Create trace message.
 * Log it as JSON, user friendly text (see app configuration) and write as console.log; into the app.
 * @param {string} message
 * @example
 * log.log("Debug information");
 */
module.exports.trace = message => {
   if (config.logger.levels.global && config.logger.levels.trace) {
      logger.trace(message);
      console.log(message);
   }
};
