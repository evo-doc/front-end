"use strict";

// TODO: Documentation

const configuration = require("app.config");

/**
 * @summary Abstract class for routes
 * @description Defines a basic interface for rendering, etc. for each route.
 * @class
 *
 * @param {object} params - Parameters
 */

class Page {
	constructor(config, args) {
		this._config = config;
		this._name = "";
		this._template = null;
		this._components = null;
		this._args = args;
		this._templateDefault = require("routes/default/default/index.ejs");

		// Initialization
		this.init();
	}

	init() {
		this._components = require("components/components.js");
	}

	_getRoot() {
		let id = this._config.root || configuration.pages.root;
		return document.getElementById(id);
	}

	_getComponent() {
		return this._components;
	}

	_getLocalization() {
		return APP.getLocalization().getPhrases();
	}

	_getArgs() {
		return this._args;
	}

	_getRouteUrl() {
		return this._args[0];
	}

	renderPromise() {
		return new Promise((resolve, reject) => {
			this._render(resolve, reject);
		});
	}

	_render(renderDone, renderFail) {
		new Promise((resolve, reject) => {
			this._getRoot().innerHTML = this._templateDefault({
				_data: {
					requestedUrl: JSON.stringify(this._getRouteUrl(), null, "  "),
					args: JSON.stringify(this._getArgs(), null, "  "),
					localization: JSON.stringify(this._getLocalization(), null, "  ")
				}
			});
			resolve();
		}).then(() => {
			renderDone();
		});
	}

	renderContent() {}
}

module.exports = Page;
