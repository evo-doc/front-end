"use strict";

const Page = require("page.class");

class Index extends Page {
	constructor(config, args) {
		super(config, args);
		this._template = require("./index.ejs");
		// this._style = require("./index.scss");
	}

	__render() {
		this._getRoot().innerHTML = this._template();
	}

	__handlers() {
		document.getElementById("verification__submit").addEventListener("click", () => {
			this._sendVerificationForm();
		});
	}

	async _sendVerificationForm() {
		let key = document.getElementById("verification__key").value;

		try {
			await APP.getAPI()
				.getAuthorization()
				.verify(key);
		} catch (e) {
			if (e instanceof error.RequestError) return;
		}
	}
}

module.exports = function(config = {}) {
	return {
		config: config,
		page: Index
	};
};
