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

		for (let page in this._pages) {
			// Add route
			this._routes.push({
				// Pattern regex
				pattern: new RegExp("^" + page.replace(/:\w+/, "(\\w+)") + "$"),
				// Page generator (options, page class)
				generator: this._pages[page]
			});
		}
	}

	/**
	 * @summary Search requested path and load suitable page (or 404)
	 * @description Gets requested path and checks all route patterns via regex.
	 *
	 * @param {any} path
	 */
	route(path) {
		// console.log(`Routing to ${path}`);

		let i = this._routes.length;
		while (i--) {
			// Pokud dotaz odpovida nejakemu z patternu
			let args = path.match(this._routes[i].pattern);

			if (args) {
				// this._routes[i].callback.apply(this, args.slice(1));
				// let a = new this._routes[i].pageClass();
				// a.render();
				console.log(this._routes[i]);

				this._current = new this._routes[i].generator.page(
					// Send options
					this._routes[i].options,
					// Send params
					args
				);
				this._current.render();
				break;
			}
		}

		// Error 404
		if (i === -1) APP.getRequest().redirect("/error/404");
	}
}

module.exports = Router;
