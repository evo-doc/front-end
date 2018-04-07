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

	render() {
		this._getRoot().innerHTML = "<h1>Default Render Method</h1>";
		this._getRoot().innerHTML += "<p>You forgot to overload render();</p>";

		this._getRoot().innerHTML += `<p>Requested URL:</p>`;
		this._getRoot().innerHTML += `<pre>${JSON.stringify(this._getRouteUrl(), null, "  ")}</pre>`;

		this._getRoot().innerHTML += `<p>Arguments:</p>`;
		this._getRoot().innerHTML += `<pre>${JSON.stringify(this._getArgs(), null, "  ")}</pre>`;

		this._getRoot().innerHTML += `<p>Localization file:</p>`;
		this._getRoot().innerHTML += `<pre>${JSON.stringify(
			this._getLocalization(),
			null,
			"  "
		)}</pre>`;
	}
}

module.exports = Page;
