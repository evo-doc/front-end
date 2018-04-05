"use strict";

// TODO: Documentation

class Router {
	constructor() {
		this._routes = [];
	}

	init() {
		// FIXME: Routes must be required - require("routes");

		// Obsahuje string rout a instanci stranky
		this.pages = require("routes.js");

		console.log(this.pages);
		// Obsahuje REGEX a instance
		this._routes = [];

		// Pro kazdou definovanou stranku
		for (let route in this.pages) {
			// Do pravych routu pridam regex a
			this._routes.push({
				// Regex
				pattern: new RegExp("^" + route.replace(/:\w+/, "(\\w+)") + "$"),
				// WTF?
				pageClass: this.pages[route]
			});
		}
	}

	addRoute(route) {}

	route(path) {
		console.log(`Routing to ${path}`);

		// Vsechny routes
		let i = this._routes.length;

		// Hledam v nich ten, ktery mi bude sedet s patternem
		while (i--) {
			// Pokud dotaz odpovida nejakemu z patternu
			let args = path.match(this._routes[i].pattern);
			console.log(args);
			if (args) {
				// this._routes[i].callback.apply(this, args.slice(1));
				// let a = new this._routes[i].pageClass();
				// a.render();
				console.log(this._routes[i]);
				this._routes[i].pageClass.render();
				break;
			}
		}

		console.log(`${i} is i`);
		if (i === -1) {
			APP.getRequest().redirect("/error/404");
		}
	}
}

module.exports = Router;
