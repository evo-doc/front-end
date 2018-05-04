"use strict";

// TODO: Form validation
// TODO: User friendly response

const Page = require("page.class");
const validation = require("validation.module");

class Index extends Page {
	constructor(config, args) {
		super(config, args);
		this._template = require("./index.ejs");
		this._style = require("./index.scss");
	}

	_handlers() {
		document.getElementById("sign-in").addEventListener("click", () => {
			this._sendAuthorizationForm();
		});
	}

	_render(renderDone, renderFail) {
		this._getRoot().innerHTML = this._template();
		this._handlers();
		renderDone();
	}

	async _sendAuthorizationForm() {
		let usernameOrEmail = document.getElementById("username").value;
		let password = document.getElementById("password").value;
		let feedback = document.getElementById("feedback");

		if (!(validation.email(usernameOrEmail) && validation.username(usernameOrEmail))) {
			feedback.innerHTML = "Invalid Username or Email";
			return;
		}

		if (validation.pass(password)) {
			feedback.innerHTML = "Invalid password";
			return;
		}

		try {
			await APP.getAuthorization().sendAuthorization(username, password);
		} catch (e) {
			if (e instanceof error.AuthorizationWarning) {
				return (feedback.innerHTML = e.message);
			}

			if (e instanceof error.UnexpectedBehaviour) {
				return APP.getRequest().redirect("/error/500");
			}
		}
	}
}

module.exports = function(config = {}) {
	return {
		config: config,
		page: Index
	};
};
