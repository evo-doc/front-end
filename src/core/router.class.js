"use strict";

const configRouter = require("router.config.js");

class Router {
	/**
	 * @summary Client side routing
	 * @description Receive URL from ***Request*** module, check if the requested URL is suitable for some available URL, parse *paths* and *params* and run init() of the page
	 * @class
	 *
	 * @returns {Request} Request instance
	 */
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
				pattern: new RegExp("^" + page.replace(/:\w+/g, "(\\w+)") + "$"),
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
	async route(path) {
		// Try fo find route
		let page;
		try {
			page = this._findRoute(path); // Has page index in roures and args from URL
		} catch (e) {
			return; // Page does not exist
		}

		// If the page is not auth free -> check auth
		if (!this._isAuthFreePage(path)) {
			log.trace(`Page "${path}" requires an authorisation.`);
			try {
				await APP.getAPI()
					.getAuthorization()
					.isAuthorized();
			} catch (e) {
				return; // Stop routing, error from isAuthorized called new redirect
			}
		}

		// Create page instance with its config & args
		this._current = new this._routes[page.i].generator.page(
			this._routes[page.i].generator.config,
			page.args
		);

		// Load page
		try {
			await this._current.load();
		} catch (e) {
			return; // Stop routing, error from load called new redirect
		}
	}

	/**
	 * @summary Find route
	 * @description Try to find requested route and return it's index in routes + parsed arguments from the URL.
	 * @private
	 *
	 * @param {string} path - Requested page path
	 * @returns {object} - Object with page index and arguments from the URL
	 */
	_findRoute(path) {
		let args;
		let i = this._routes.length;
		while (i--) {
			args = path.match(this._routes[i].pattern);
			if (args) return { i: i, args: args };
		}
		let e = new error.RouteNotFound(path);
		APP.getRequest().redirect("/error/404");
		throw e;
	}

	/**
	 * @summary Is page authFree?
	 * @description Check if the requested page requires authentificated used.
	 * @private
	 *
	 * @param {string} path - Requested page path
	 * @returns {boolean}
	 */
	_isAuthFreePage(path) {
		let isFree = false;
		configRouter.authFreePages.forEach(pattern => {
			if (path.match(pattern)) isFree = true;
		});
		return isFree;
	}
}

module.exports = Router;
