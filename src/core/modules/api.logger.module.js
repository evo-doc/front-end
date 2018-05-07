"use strict";

/**
 * @summary Logger (API) - globally module. Reserves `logapi` as a global variable.
 * @module LoggerAPI
 *
 * @example <caption>If you need to require this module explicitely</caption>
 * const log = require("api.logger.module");
 *
 * @example <caption>Create log messages</caption>
 * logapi("HASH", "Message");
 */

const moment = require("moment");
const winston = require("winston");
const config = require("app.config");
const { combine, timestamp, printf } = winston.format;

const logger = winston.createLogger({
	levels: {
		info: 0
	},
	format: timestamp(),
	transports: [
		// User friendly logs
		new winston.transports.File({
			filename: "log/api.txt.log",
			format: printf(info => {
				let time = moment().format("YYYY-MM-DD HH:mm:ss");
				return `${time} ${info.message}`;
			}),
			level: "info"
		})
	]
});

module.exports = (
	hash,
	// Request
	req_method,
	req_url,
	req_body,
	// Response
	res_status,
	res_statusText,
	res_body
) => {
	let msg = `[DEBUG] ${hash}\n`;
	msg += `REQUEST\n`;
	msg += `\tMethod: [${req_method}] ${req_url}\n`;
	msg += `\tBody:\n${JSON.stringify(req_body, null, "\t")}\n\n`;
	msg += `RESPONSE\n`;
	msg += `\tStatus: ${res_status} (${res_statusText})\n`;
	msg += `\tBody:\n${JSON.stringify(res_body, null, "\t")}\n\n`;
	logger.info(msg);
};
