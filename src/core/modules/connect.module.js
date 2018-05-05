"use strict";

/**
 * Connect - globally required modul via webpack. Reserves `connect` as a global variable. Provides an interface for ajax requests. Server address is set in `app.config.json`.
 * @module Connect
 *
 * @example <caption>Simple POST request to the server</caption>
 * // Because you usually want to wait for some result, it's better call it in async/await.
 * let result = await connect.postJSON("/login", {
 * 	username: "username",
 * 	password: "password"
 * });
 *
 * @example <caption>Simple GET request to the server</caption>
 * // Because you usually want to wait for some result, it's better call it in async/await.
 * let result = await connect.getJSON("/user", {
 * 	user_id: 5,
 * 	token: "token"
 * });
 *
 * @example <caption>Ultimate POST request</caption>
 * let result = await connect.postJSON(
 * 	"/some/url",
 * 	{
 * 		username: "username",
 * 		password: "password"
 * 	},
 * 	{
 * 		cache: "force-cache",
 * 		headers: {
 * 			"Content-Type": "application/json"
 * 		}
 * 	}
 * );
 */

const config = require("app.config");
var randomstring = require("randomstring");

/**
 * @summary Get all responses from requests
 * @description Wait for all fetch promises and parse their json responses
 * @param {Promise} [...arguments] - fetch promises
 *
 * @return {Array} An array of JSON responses (in the same order, as arguments)
 */
module.exports.waitAJAX = function() {
	return Promise.all([...arguments]).then(responses => {
		return Promise.all(responses.map(res => res.json()));
	});
};

/**
 * @summary GET request
 * @description Prepare and send GET request to the server. Responce should be JSON.
 *
 * @param {string} url - Requested URL without GET params
 * @param {Object} data - Objects of pairs {key: value} which represents GET params
 * @param {Object} [optionsUser={}] - User defined fetch options
 *
 * @return {Promise}
 */
module.exports.getJSON = async (url, data, optionsUser = {}) => {
	// Unique ID
	let hash = randomstring.generate(5);

	// Prepare URL get request
	var euc = encodeURIComponent;
	var getURL = Object.keys(data)
		.map(key => `${euc(key)}=${euc(data[key])}`)
		.join("&");

	// Prepare & merge fetch options
	const optionsDefault = {
		method: "GET",
		cache: config.ajax.cache,
		headers: {
			"Content-Type": "application/json"
		}
	};
	let options = Object.assign(optionsDefault, optionsUser);
	let requestedURL = `${config.ajax.host}${url}?${getURL}`;

	// Send request
	log.trace(`Server GET (${hash}): ${requestedURL}`);
	let response = await fetch(requestedURL, options);
	let status = response.status;
	let json = await response.json().then(_ => _);

	// Check global errors
	let isGlobalErrorResult = _isGlobalError(status, json, options.method, hash);
	if (isGlobalErrorResult !== false) throw isGlobalErrorResult;

	// Success
	return { status: status, data: json };
};

/**
 * @summary POST request
 * @description Prepare and send POST request to the server. Responce should be JSON.
 *
 * @param {string} url - Requested URL without GET params
 * @param {Object} data - Objects of pairs {key: value} which presents GET params
 * @param {Object} [optionsUser={}] - User defined fetch options
 *
 * @return {Promise}
 */
module.exports.postJSON = async (url, data, optionsUser = {}) => {
	// Unique ID
	let hash = randomstring.generate(5);

	// Prepare & merge fetch options
	const optionsDefault = {
		method: "POST",
		cache: config.ajax.cache,
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json"
		}
	};
	let options = Object.assign(optionsDefault, optionsUser);
	let requestedURL = `${config.ajax.host}${url}`;

	// Send request
	log.trace(`Server POST (${hash}): ${requestedURL} ${options.body}`);
	let response = await fetch(requestedURL, options);
	let status = response.status;
	let json = await response.json().then(_ => _);

	// Check global errors
	let isGlobalErrorResult = _isGlobalError(status, json, options.method, hash);
	if (isGlobalErrorResult !== false) throw isGlobalErrorResult;

	// Success
	return { status: status, data: json };
};

/**
 * @summary Global errors detection
 * @description Check global erros e.g. invalid token, data consistency etc.
 * @param {string} status - Response status
 * @param {string} data - Bosy of the response
 * @param {string} method - POST/GET/DELETE
 * @param {string} hash - A hash of the transaction.
 */
function _isGlobalError(status, data, method, hash) {
	// Global errors
	if (status === 400 && data === "data") {
		APP.getRequest().redirect("/error/400");
		return new DataConsistencyError(status, method, hash);
	}
	if (status === 403) {
		APP.getRequest().redirect("/authorization/default");
		return new InvalidTokenError(status, method, hash);
	}

	return false;
}
