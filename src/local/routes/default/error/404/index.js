"use strict";

const Page = require("page.class");

class Index extends Page {
	constructor(config, args) {
		super(config, args);
		this._template = require("./index.ejs");
	}

	_render(renderDone, renderFail) {
		this._getRoot().innerHTML = this._template();
		renderDone();
	}
}

module.exports = function(config = {}) {
	return {
		config: config,
		page: Index
	};
};
