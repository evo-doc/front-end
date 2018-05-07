"use strict";

const Page = require("page.class");

class Index extends Page {
	constructor(config, args) {
		super(config, args);
		this._template = require("./index.ejs");
		this._style = require("./index.scss");
	}

	__render() {
		this._getRoot().innerHTML = this._template();
	}
}

module.exports = function(config = {}) {
	return {
		config: config,
		page: Index
	};
};
