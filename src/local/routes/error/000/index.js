"use strict";

const Page = require("page.class");

class Index extends Page {
	constructor(config, args) {
		super(config, args);
	}

	__render() {
		// Unexpected behaviour
		this._getRoot().innerHTML = this._getComponent().errors({
			_data: {
				title: APP.getLocalization().getPhrase("error", "000_title"),
				message: APP.getLocalization().getPhrase("error", "000_message")
			}
		});
	}
}

module.exports = function(config = {}) {
	return {
		config: config,
		page: Index
	};
};
