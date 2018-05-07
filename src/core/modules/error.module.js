"use strict";

/**
 * Error - module.exportsly required modul via webpack. Reserves `error` as a module.exports variable. Contains all types of errors (exceptions) that extends Error class.
 * @module Error
 *
 * @example <caption>Create new instances of Errors</caption>
 * new error.LanguageError("Message", 404);
 * new error.PhraseError("Message");
 */

//--------------------------------------------------------------------------------------------------
// Localization
//--------------------------------------------------------------------------------------------------

/**
 * @summary Language error
 * @description Throw this exception if the requested language file is not found.
 * @param {string} localization - Localization abbr
 */
module.exports.LocalizationError = class LocalizationError extends Error {
	constructor(localization) {
		super();
		this.name = this.constructor.name;
		this.status = 404;
		Error.captureStackTrace(this, this.constructor);
		log.error(`LocalizationError: missing [${localization}]§`);
	}
};

/**
 * @summary Phrase error
 * @description Throw this exception if the requested phrase does not exist.
 * @param {string} localization - Localization abbr
 * @param {string} namespace - Requested namespace
 * @param {string} key - Requested key
 */
module.exports.PhraseError = class PhraseError extends Error {
	constructor(localization, namespace, key) {
		super();
		this.name = this.constructor.name;
		this.status = status || 500;
		Error.captureStackTrace(this, this.constructor);

		log.error(`PhraseError: missing [${localization}] ${namespace}.${key}`);
	}
};

// -------------------------------------------------------------------------------------------------
// Storage
// -------------------------------------------------------------------------------------------------

/**
 * @summary Storage error
 * @description Throw this exception if a storage does not have requested key.
 * @param {string} storage - Storage name
 * @param {string} key - Requested key
 */
module.exports.StorageError = class StorageError extends Error {
	constructor(storage, key) {
		super();
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);

		log.warn(`StorageError: file '${storage}' missing '${key}'`);
	}
};

// -------------------------------------------------------------------------------------------------
// Server responses
// -------------------------------------------------------------------------------------------------

/**
 * @summary Request error
 * @description Throw this exception if some ajax request failed.
 * @param {string} type - "ERROR" or "WARN"
 * @param {number} status - Response status
 * @param {string} hash - Unique request hash
 * @param {string} message - Message
 * @param {string} note - User note
 */
module.exports.RequestError = class RequestError extends Error {
	constructor(type, status, hash, message, note = "") {
		super();
		this.name = this.constructor.name;
		this.status = status;
		Error.captureStackTrace(this, this.constructor);
		if (type === "ERROR") {
			log.error(`[${status}] "${hash}": ${message} (${note})`);
		} else {
			log.warn(`[${status}] "${hash}": ${message} (${note})`);
		}
	}
};

/**
 * @summary Authorization data warning
 * @description Throw this exception if server refused auth/reg request because of some data error.
 * @param {number} [status=400] - Response status
 * @param {string} action - Sign in/sign up etc.
 * @param {string} message - Error message
 */
module.exports.AuthorizationError = class AuthorizationError extends Error {
	constructor(status = 400, action, message) {
		super();
		this.name = this.constructor.name;
		this.status = status;
		this.message = message;
		Error.captureStackTrace(this, this.constructor);
		log.debug(`[${status}] [${action}]: ${message}`);
	}
};

// -------------------------------------------------------------------------------------------------
// Routing
// -------------------------------------------------------------------------------------------------
/**
 * @summary Route not found
 * @description Throw this exception if the requested route is not found.
 * @param {string} path - Requested path
 * @param {number} [status=404] - Error status number
 */
module.exports.RouteNotFound = class RouteNotFound extends Error {
	constructor(path, status = 404) {
		super();
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
		log.error(`[${status}] [ROUTE]: page "${path}" does not exist`);
	}
};

/**
 * @summary Page load process error
 * @description Throw this exception if page loading cannot be done. Is catched in router process.
 * @param {string} path - Page path
 * @param {number} status - Response status
 * @param {string} message - Response message
 * @param {string} [note=""] - User note
 */
module.exports.PageLoadError = class PageLoadError extends Error {
	constructor(path, status, hash, note) {
		super();
		this.name = this.constructor.name;
		this.path = path;
		this.status = status;
		this.hash = hash;
		this.note = note;
		Error.captureStackTrace(this, this.constructor);
		log.error(`[PAGE] [${status}] (${hash}): "${path}": "${note}"`);
	}
};

/**
 * @summary Page render process error
 * @description Throw this exception if page rendering cannot be done (ajax exceptions etc.).
 * @param {number} status - Response status
 * @param {string} message - Response message
 * @param {string} [note=""] - User note
 */
module.exports.PageRenderError = class PageRenderError extends Error {
	constructor(status, hash, note) {
		super();
		this.name = this.constructor.name;
		this.status = status;
		this.hash = hash;
		this.note = note;
		Error.captureStackTrace(this, this.constructor);
	}
};
