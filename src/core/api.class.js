"use strict";

class API {
	/**
	 * @summary API container
	 * @class
	 *
	 * @returns {API} API instance
	 *
	 * @example <caption>Singleton instance in APP</caption>
	 * APP.getAPI();
	 *
	 * @example <caption>Get a specific API interface and send a request</caption>
	 * let interface = APP.getAPI().getAuthorization();
	 * let response = APP.getAPI().getAuthorization().signIn(username, password);
	 */
	constructor() {
		this._authorization = null;
	}

	init() {
		this.getAuthorization().init();
	}

	/**
	 * @summary Get singleton instance of Authorization interface class
	 * @return {object} Authorization instance
	 */
	getAuthorization() {
		const Authorization = require("./api/authorization.class");
		if (this._authorization === null) this._authorization = new Authorization();
		return this._authorization;
	}
}

module.exports = API;
