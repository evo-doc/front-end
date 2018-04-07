"use strict";

// TODO: Documentation

class Router {
	constructor() {
		this._pages = null;
		this._routes = [];
		this._current = null;
	}

	init() {
		// Load all page generators
		this._pages = require("pages");

		// Create routes
		for (let page in this._pages) {
			this._routes.push({
				pattern: new RegExp("^" + page.replace(/:\w+/, "(\\w+)") + "$"),
				generator: this._pages[page]
			});
		}
	}

	/**
	 * @summary Search requested path and load suitable page (or 404)
	 * @description Gets requested path and checks all route patterns via regex.
	 *
	 * @param {string} path
	 */
	route(path) {
		let i = this._routes.length;
		while (i--) {
			// Get array of args from the URL (according to page pattern)
			let args = path.match(this._routes[i].pattern);

			if (args) {
				log.trace(`Routing to ${path}`);

				// Create page instance with its config & args
				this._current = new this._routes[i].generator.page(
					this._routes[i].generator.config,
					args
				);

				// Run renderer process
				this._current.render();
				break;
			}
		}

		// Error 404
		if (i === -1) APP.getRequest().redirect("/error/404");
	}
}

module.exports = Router;
