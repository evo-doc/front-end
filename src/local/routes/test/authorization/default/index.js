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

	__render() {
		this._getRoot().innerHTML = this._template();
	}

	__handlers() {
		document.getElementById("sign-in__submit").addEventListener("click", () => {
			this._sendAuthorizationForm();
		});
		document.getElementById("sign-up__submit").addEventListener("click", () => {
			this._sendRegistrationForm();
		});
	}

	async _sendAuthorizationForm() {
		let username = document.getElementById("sign-in__usermail").value;
		let password = document.getElementById("sign-in__password").value;

		try {
			await APP.getAuthorization().sendAuthorization(username, password);
		} catch (e) {
			if (e instanceof AuthorizationError) {
				return (document.getElementById("auth__feedback").innerHTML = e.message);
			}

			if (e instanceof error.UnexpectedBehaviourError) {
				return APP.getRequest().redirect("/error/500");
			}
		}
	}

	async _sendRegistrationForm() {
		let email = document.getElementById("sign-up__email").value;
		let username = document.getElementById("sign-up__username").value;
		let password = document.getElementById("sign-up__password").value;

		try {
			await APP.getAuthorization().sendRegistration(username, password, email);
		} catch (e) {
			if (e instanceof AuthorizationError) {
				if (e.message === "email") {
					document.getElementById("auth__feedback").innerHTML = e.message;
				}
				if (e.message === "username") {
					document.getElementById("auth__feedback").innerHTML = e.message;
				}
				return;
			}

			if (e instanceof error.UnexpectedBehaviourError) {
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
