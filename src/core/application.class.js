"use strict";

// TODO: @Sergey Documentation

class Application {
	constructor() {
		this._router = null;
		this._localization = null;
		this._loader = null;
		this._request = null;
	}

	init() {
		log.info("Application Initializer");

		// REFACTOR: What is better - init in place or init later?
		// Create first instance
		this.getLocalization().init();
		this.getRequest().init();
		this.getRouter().init();
	}

	getLocalization() {
		const Localization = require("./localization.class");
		if (this._localization === null) this._localization = new Localization();

		return this._localization;
	}

	getRequest() {
		const Request = require("./request.class");
		if (this._request === null) this._request = new Request();

		return this._request;
	}

	getRouter() {
		const Router = require("./router.class");
		if (this._router === null) this._router = new Router();

		return this._router;
	}
}

module.exports = Application;
