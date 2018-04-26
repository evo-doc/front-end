"use strict";

const Page = require("page.class");

class Index extends Page {
	constructor(config, args) {
		super(config, args);
	}

	_render(renderDone, renderFail) {
		this._getRoot().innerHTML = this._getComponent().errors({
			_data: {
				title: APP.getLocalization().getPhrase("error", "400_title"),
				message: APP.getLocalization().getPhrase("error", "400_message")
			}
		});

		renderDone();
	}
}

module.exports = function(config = {}) {
	return {
		config: config,
		page: Index
	};
};
