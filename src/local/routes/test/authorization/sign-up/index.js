"use strict";

// TODO: Form validation
// TODO: User friendly response
// TODO: Double password form

const Page = require("page.class");

class Index extends Page {
	constructor(config, args) {
		super(config, args);
		this._template = require("./index.ejs");
		this._style = require("./index.scss");
	}

	_handlers() {
		document.getElementById("sign-up").addEventListener("click", () => {
			this._sendRegistrationForm();
		});
	}

	_render(renderDone, renderFail) {
		this._getRoot().innerHTML = this._template();
		this._handlers();
		renderDone();
	}

	async _sendRegistrationForm() {
		let email = document.getElementById("email").value;
		let username = document.getElementById("username").value;
		let password = document.getElementById("password").value;

		try {
			await APP._authorization.sendRegistration(username, password, email);
		} catch (e) {
			if (e instanceof error.RegistrationWarning) {
				if (e.message === "email") {
					document.getElementById("feedback").innerHTML = e.message;
				}
				if (e.message === "username") {
					document.getElementById("feedback").innerHTML = e.message;
				}
				return;
			}

			if (e instanceof error.UnexpectedBehaviour) return APP._request.redirect("/error/500");
		}
	}
}

module.exports = function(config = {}) {
	return {
		config: config,
		page: Index
	};
};
