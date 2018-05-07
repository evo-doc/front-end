"use strict";

const Page = require("page.class");

class Index extends Page {
	constructor(config, args) {
		super(config, args);
	}

	__render() {
		this._getRoot().innerHTML = this._getComponent().errors({
			_data: {
				title: APP.getLocalization().getPhrase("error", "404_title"),
				message: APP.getLocalization().getPhrase("error", "404_message")
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
