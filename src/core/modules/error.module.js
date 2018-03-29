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


//----------------------------------------------------------------------------------------------------------------------
// Export interface
//----------------------------------------------------------------------------------------------------------------------
/**
 * Language Error.
 * Throw this exception if the requested language file is not found.
 * @param {string} message - Error message
 * @param {number} [status=404] - Error status number
 */
module.exports.LanguageError = class LanguageError extends Error {
	constructor(message, status) {
		super();
		this.name   = this.constructor.name;
		this.status = status || 404;
		Error.captureStackTrace(this, this.constructor);
	}
};


/**
 * Phrase Error.
 * Throw this exception if the requested phrase does not exist.
 * @param {string} message - Error message
 * @param {number} [status=500] - Error status number
 */
module.exports.PhraseError = class PhraseError extends Error {
	constructor(message, status) {
		super();
		this.name   = this.constructor.name;
		this.status = status || 500;
		Error.captureStackTrace(this, this.constructor);
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
		this.name   = this.constructor.name;
		this.status = status || 404;
		Error.captureStackTrace(this, this.constructor);
	}
};
