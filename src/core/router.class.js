"use strict";

// TODO: Documentation

const configRouter = require("router.config.js");

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
			return APP.getRequest().redirect("/error/404"); // Page does not exist
		}

		// If the page is not auth free -> check auth
		if (!this._isAuthFreePage(path)) {
			try {
				if (!(await APP.getAuthorization().isAuthorized())) return;
			} catch (e) {
				if (e instanceof error.UnexpectedBehaviour) {
					return APP.getRequest().redirect("/error/500");
				}
			}
		}

		// Run load process
		log.trace(`[PENDING] Routing to ${path}`);
		loader.show();

		// Create page instance with its config & args
		this._current = new this._routes[page.i].generator.page(
			this._routes[page.i].generator.config,
			page.args
		);

		// Async rendering
		this._current
			.renderPromise()
			.then(() => {
				log.trace(`[SUCCESS] Routing to ${path}`);
				loader.hide();
			})
			.catch((status = 400) => {
				log.trace(`[FAILURE] Routing to ${path}`);
				loader.hide();
				// Catch all possible statuses from the server
				if (status === 400) APP.getRequest().redirect("/error/400");
				if (status === 500) APP.getRequest().redirect("/error/500");
			});
	}

	_findRoute(path) {
		let args;
		let i = this._routes.length;
		while (i--) {
			args = path.match(this._routes[i].pattern);
			if (args) return { i: i, args: args };
		}
		throw new error.RouteError(404, path);
	}

	_isAuthFreePage(path) {
		let isFree = false;
		configRouter.authFreePages.forEach(pattern => {
			if (path.match(pattern)) isFree = true;
		});
		return isFree;
	}
}

module.exports = Router;
