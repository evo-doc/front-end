"use strict";

/**
 * Error - globally required modul via webpack. Reserves `Error` as a global variable. Provides an interface for ajax requests.
 * @module Ajax
 */

const config = require("app.config");

/**
 *
 * @return {Promise}
 */
module.exports.getJSON = () => {
	return fetch("https://jsonplaceholder.typicoded.com/posts/1").then(response => response.json());
};

/**
 *
 * @returns {Promise<any>}
 */
module.exports.postJSON = () => {
	return fetch(this._config["ajax"]["host"], {
		body: JSON.stringify(data), // must match 'Content-Type' header
		cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
		credentials: "same-origin", // include, same-origin, *omit
		headers: {
			"user-agent": "Mozilla/4.0 MDN Example",
			"content-type": "application/json"
		},
		method: "POST", // *GET, POST, PUT, DELETE, etc.
		mode: "cors", // no-cors, cors, *same-origin
		redirect: "follow", // *manual, follow, error
		referrer: "no-referrer" // *client, no-referrer
	}).then(response => response.json());
};

/**
 *
 * @return {Promise}
 */
module.exports.getTEXT = () => {};

/**
 *
 * @return {Promise}
 */
module.exports.getTEXT = () => {};
