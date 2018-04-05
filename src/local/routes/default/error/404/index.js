"use strict";

const Route = require("route.class");

class Index extends Route {
	constructor(options) {
		super();
		this._name = "Default.Error.404";
	}
}

module.exports = function(options = {}) {
	options.parent = options.parent || "root";
	return new Index(options);
};
