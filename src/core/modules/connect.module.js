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
 * @param {Object} body - Objects of pairs {key: value} which represents GET params
 * @param {Object} [optionsUser={}] - User defined fetch options
 *
 * @return {Promise}
 */
module.exports.getJSON = async (url, body, optionsUser = {}) => {
	// Unique ID
	let hash = randomstring.generate(32);

	// Prepare URL get request
	var euc = encodeURIComponent;
	var getURL = Object.keys(body)
		.map(key => `${euc(key)}=${euc(body[key])}`)
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
	let response;
	try {
		response = await fetch(requestedURL, options);
	} catch (e) {
		if (e instanceof TypeError && e.message === "Failed to fetch") {
			APP.getRequest().redirect("/error/001");
			throw e;
		}
	}

	let status = response.status;
	let statusText = response.statusText;
	let json = await response
		.json()
		.then(_ => _)
		.catch(_ => "HTML");

	logapi(
		hash,
		// Requset
		options.method,
		requestedURL,
		"see URL",
		// Response
		status,
		statusText,
		json
	);

	// Check global errors
	let isGlobalErrorResult = _isGlobalError(status, json, options.method, hash);
	if (isGlobalErrorResult !== false) throw isGlobalErrorResult;

	// Success
	return { status: status, body: json, hash: hash };
};

/**
 * @summary POST request
 * @description Prepare and send POST request to the server. Responce should be JSON.
 *
 * @param {string} url - Requested URL without GET params
 * @param {Object} body - Objects of pairs {key: value} which represents POST params
 * @param {Object} [optionsUser={}] - User defined fetch options
 *
 * @return {(object|error)}
 */
module.exports.postJSON = async (url, body, optionsUser = {}) => {
	// Unique ID
	let hash = randomstring.generate(32);

	// Prepare & merge fetch options
	const optionsDefault = {
		method: "POST",
		cache: config.ajax.cache,
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json"
		}
	};
	let options = Object.assign(optionsDefault, optionsUser);
	let requestedURL = `${config.ajax.host}${url}`;

	// Send request
	let response;
	try {
		response = await fetch(requestedURL, options);
	} catch (e) {
		if (e instanceof TypeError && e.message === "Failed to fetch") {
			APP.getRequest().redirect("/error/001");
			throw e;
		}
	}

	let status = response.status;
	let statusText = response.statusText;
	let json = await response
		.json()
		.then(_ => _)
		.catch(_ => "HTML");

	logapi(
		hash,
		// Requset
		options.method,
		requestedURL,
		body,
		// Response
		status,
		statusText,
		json
	);

	// Check global errors
	let isGlobalErrorResult = _isGlobalError(status, json, options.method, hash);
	if (isGlobalErrorResult !== false) throw isGlobalErrorResult;

	// Success
	return { status: status, body: json, hash: hash };
};

/**
 * @summary Global errors detection
 * @description Check global erros e.g. invalid token, data consistency etc.
 * @param {string} status - Response status
 * @param {string} body - Bosy of the response
 * @param {string} method - POST/GET/DELETE
 * @param {string} hash - A hash of the transaction.
 */
function _isGlobalError(status, body, method, hash) {
	// Server unavailable
	if (status >= 500) {
		let e = new error.RequestError("ERROR", status, hash, "Server unavailable!", "Global");
		APP.getRequest().redirect("/error/500");
		return e;
	}

	// HTML body
	if (body === "HTML") {
		let e = new error.RequestError("ERROR", status, hash, "Cannot parse JSON!", "Global");
		APP.getRequest().redirect("/error/500");
		return e;
	}

	// Global errors
	if (status === 400 && body === "data") {
		let e = new error.RequestError("ERROR", status, hash, "Invalid data!", "Global");
		APP.getRequest().redirect("/error/400");
		return e;
	}
	if (status === 403) {
		let e = new error.RequestError("WARN", status, hash, "Invalid token!", "Global");
		APP.getRequest().redirect("/authorization/default");
		return e;
	}

	// New possible token
	if (body.hasOwnProperty("token")) {
		APP.getAPI()
			.getAuthorization()
			._saveToken(body["token"]);
	}

	// Is needed verification
	if (status === 200 && body.hasOwnProperty("verified") && body["verified"] === "false") {
		let e = new error.RequestError("WARN", status, hash, "User is not verified!", "Global");

		console.log(APP.getRouter()._current);

		if (
			APP.getRouter()._current === null ||
			APP.getRouter()._current._args[0] !== "/authorization/verification"
		)
			APP.getRequest().redirect("/authorization/verification");
		return e;
	}

	return false;
}
