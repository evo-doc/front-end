"use strict";

/**
 * Error - globally required modul via webpack. Reserves `error` as a global variable. Contains all types of errors (exceptions) that extends Error class.
 * @module Error
 *
 * @example <caption>Create new instances of Errors</caption>
 * new LanguageError("Message", 404);
 * new PhraseError("Message");
 */

//--------------------------------------------------------------------------------------------------
// Localization
//--------------------------------------------------------------------------------------------------

/**
 * @summary Language error
 * @description Throw this exception if the requested language file is not found.
 * @param {string} localization - Localization abbr
 */
global.LocalizationError = class LocalizationError extends Error {
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
global.PhraseError = class PhraseError extends Error {
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
global.StorageError = class StorageError extends Error {
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
 * @summary Authorization data warning
 * @description Throw this exception if server refused auth/reg request because of some data error.
 * @param {number} [status=400] - Response status
 * @param {string} action - Sign in/sign up etc.
 * @param {string} message - Error message
 */
global.AuthorizationError = class AuthorizationError extends Error {
	constructor(status = 400, action, message) {
		super();
		this.name = this.constructor.name;
		this.status = status;
		this.message = message;
		Error.captureStackTrace(this, this.constructor);
		log.debug(`[${status}] [${action}]: ${message}`);
	}
};

/**
 * @summary Unexpected behaviour
 * @description Throw this exception if we receive something stange from the server.
 * @param {number} [status=500] - Response status
 * @param {string} action - User action
 * @param {string} message - Error message
 */
global.UnexpectedBehaviourError = class UnexpectedBehaviourError extends Error {
	constructor(status = 500, action, message) {
		super();
		this.name = this.constructor.name;
		this.status = status;
		this.message = message;
		Error.captureStackTrace(this, this.constructor);
		log.error(`[${status}] [${action}]: unexpected behavaiour - ${JSON.stringify(message)}`);
	}
};

/**
 * @summary Invalid token
 * @description Throw this exception if we receive 403 from the server.
 * @param {number} [status=403] - Response status
 * @param {string} action - User action
 * @param {string} hash - Request hash
 */
global.InvalidTokenError = class InvalidTokenError extends Error {
	constructor(status = 403, action, hash) {
		super();
		this.name = this.constructor.name;
		this.status = status;
		this.message = "Invalid token";
		Error.captureStackTrace(this, this.constructor);
		log.warn(`[${status}] [${action}] (${hash}): ${this.message}`);
	}
};

/**
 * @summary Data consistency error
 * @description Throw this exception if server return that it needs something more.
 * @param {number} [status=403] - Response status
 * @param {string} action - User action
 * @param {string} hash - Request hash
 */
global.DataConsistencyError = class DataConsistencyError extends Error {
	constructor(status = 403, action, hash) {
		super();
		this.name = this.constructor.name;
		this.status = status;
		Error.captureStackTrace(this, this.constructor);
		log.error(`[${status}] [${action}] (${hash}): Data consistency`);
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
global.RouteNotFound = class RouteNotFound extends Error {
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
global.PageLoadError = class PageLoadError extends Error {
	constructor(path, status, message, note = "") {
		super();
		this.name = this.constructor.name;
		this.path = path;
		this.status = status;
		this.message = message;
		this.note = note;
		Error.captureStackTrace(this, this.constructor);
		log.error(`[PAGE] [${status}] (${path}): "${message}": "${note}"`);
	}
};

/**
 * @summary Page render process error
 * @description Throw this exception if page rendering cannot be done (ajax exceptions etc.).
 * @param {number} status - Response status
 * @param {string} message - Response message
 * @param {string} [note=""] - User note
 */
global.PageRenderError = class PageRenderError extends Error {
	constructor(status, message, note = "") {
		super();
		this.name = this.constructor.name;
		this.status = status;
		this.message = message;
		this.note = note;
		Error.captureStackTrace(this, this.constructor);
	}
};
