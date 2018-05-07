"use strict";

class Application {
	/**
	 * @summary Application container
	 * @class
	 *
	 * @returns {Application} Application instance
	 *
	 * @example <caption>New Application instance</caption>
	 * const App = new Application();
	 * App.init();
	 */
	constructor() {
		this._router = null;
		this._localization = null;
		this._request = null;
		this._api = null;
	}

	init() {
		log.info("Application Initializer");

		this.getLocalization().init();
		this.getAPI().init();
		this.getRequest().init();
		this.getRouter().init();
	}

	/**
	 * @summary Get singleton instance of Localization class
	 * @return {object} Localization instance
	 */
	getLocalization() {
		const Localization = require("./localization.class");
		if (this._localization === null) this._localization = new Localization();
		return this._localization;
	}

	/**
	 * @summary Get singleton instance of Request class
	 * @return {object} Request instance
	 */
	getRequest() {
		const Request = require("./request.class");
		if (this._request === null) this._request = new Request();
		return this._request;
	}

	/**
	 * @summary Get singleton instance of Router class
	 * @return {object} Router instance
	 */
	getRouter() {
		const Router = require("./router.class");
		if (this._router === null) this._router = new Router();
		return this._router;
	}

	/**
	 * @summary Get singleton instance of API class
	 * @return {object} API instance
	 */
	getAPI() {
		const API = require("./api.class");
		if (this._api === null) this._api = new API();
		return this._api;
	}
}

module.exports = Application;
