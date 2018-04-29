("use strict");

const Page = require("page.class");

class Index extends Page {
	constructor(config, args) {
		super(config, args);
		this._template = require("./index.ejs");
		this._style = require("./index.scss");
	}

	events() {
		let button = document.getElementById("sign-up");
		button.addEventListener("click", () => {
			this.sendRegistration();
		});
	}

	async sendRegistration() {
		let username = document.getElementById("username").value;
		let email = document.getElementById("email").value;
		let password = document.getElementById("password").value;

		let response = await APP._authorization.sendRegistration(username, password, email);
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
