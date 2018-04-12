"use strict";

/**
 * Error - globally required modul via webpack. Reserves `Error` as a global variable. Contains all types of errors (exceptions) that extends Error class.
 * @module Error
 * @type {exports.LanguageError}
 *
 * @example <caption>Create new instances of Errors</caption>
 * new Error.LanguageError("Message", 404);
 * new Error.PhraseError("Message");
 */

//--------------------------------------------------------------------------------------------------
// Export interface
//--------------------------------------------------------------------------------------------------
/**
 * Language Error.
 * Throw this exception if the requested language file is not found.
 * @param {string} message - Error message
 * @param {number} [status=404] - Error status number
 */
module.exports.LocalizationError = class LocalizationError extends Error {
	constructor(localization) {
		super();
		this.name = this.constructor.name;
		this.status = 404;
		Error.captureStackTrace(this, this.constructor);

		log.error(`LocalizationError: missing [${localization}]`);
	}
};

/**
 * Phrase Error.
 * Throw this exception if the requested phrase does not exist.
 * @param {string} message - Error message
 */
module.exports.PhraseError = class PhraseError extends Error {
	constructor(language, namespace, key) {
		super();
		this.name = this.constructor.name;
		this.status = status || 500;
		Error.captureStackTrace(this, this.constructor);

		log.error(`PhraseError: missing [${language}] ${namespace}.${key}`);
	}
};

/**
 * Storage error.
 * Throw this exception if a storage does not have requested key.
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

/**
 * Route Error.
 * Throw this exception if the requested route is not found.
 * @param {string} message - Error message
 * @param {number} [status=404] - Error status number
 */
module.exports.RouteError = class RouteError extends Error {
	constructor(message, status) {
		super();
		this.name = this.constructor.name;
		this.status = status || 404;
		Error.captureStackTrace(this, this.constructor);
	}
};
