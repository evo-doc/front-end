"use strict";

const Page = require("page.class");

class Index extends Page {
	constructor(config, args) {
		super(config, args);
		this._template = require("./index.ejs");
		this._style = require("./index.scss");
	}

	events() {
		let button = document.getElementById("sign-in");
		button.addEventListener("click", () => {
			this.sendAuthorization();
		});
	}

	async sendAuthorization() {
		let username = document.getElementById("username").value;
		let password = document.getElementById("password").value;

		let response = await APP._authorization.sendAuthorization(username, password);
	}

	_render(renderDone, renderFail) {
		this._getRoot().innerHTML = this._template();

		this.events();
		renderDone();
	}
}

module.exports = function(config = {}) {
	return {
		config: config,
		page: Index
	};
};
