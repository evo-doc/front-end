"use strict";

const Route = require("route.class");

class Index extends Route {
	constructor(options, params) {
		super();
		this._name = "Default.Error.404";
	}

	render() {
		this._getRoot().innerHTML = "404";
	}
}

module.exports = function(options = {}) {
	// Defautl options
	return {
		options: options,
		page: Index
	};
};
