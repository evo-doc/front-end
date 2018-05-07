"use strict";

const Page = require("page.class");

class Index extends Page {
	constructor(config, args) {
		super(config, args);
	}
}

module.exports = function(config = {}) {
	return {
		config: config,
		page: Index
	};
};
