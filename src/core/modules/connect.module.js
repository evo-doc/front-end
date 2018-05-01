"use strict";

/**
 * connect - globally required modul via webpack. Reserves `connect` as a global variable. Provides an interface for ajax requests.
 * @module Connect
 */

const config = require("app.config");

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
 * @description Prepare and send GET request to the server
 *
 * @param {string} url - Requested URL without GET params
 * @param {Object} data - Objects of pairs {key: value} which represents GET params
 * @param {Object} [optionsUser={}] - User defined fetch options
 *
 * @return {Promise}
 */
module.exports.getJSON = (url, data, optionsUser = {}) => {
	// Prepare URL get request
	var euc = encodeURIComponent;
	var getURL = Object.keys(data)
		.map(key => `${euc(key)}=${euc(data[key])}`)
		.join("&");

	// Prepare & merge fetch options
	const optionsDefault = {
		method: "GET",
		cache: config.ajax.cache
	};
	let options = Object.assign(optionsDefault, optionsUser);
	let requestedURL = `${config.ajax.host}${url}?${getURL}`;

	log.trace(`GET REQUEST: ${requestedURL}`);
	return fetch(requestedURL, options);
};

/**
 * @summary POST request
 * @description Prepare and send POST request to the server
 *
 * @param {string} url - Requested URL without GET params
 * @param {Object} data - Objects of pairs {key: value} which presents GET params
 * @param {Object} [optionsUser={}] - User defined fetch options
 *
 * @return {Promise}
 */
module.exports.postJSON = (url, data, optionsUser = {}) => {
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

	log.trace(`Server POST request: ${requestedURL} ${options.body}`);
	return fetch(requestedURL, options);
};
