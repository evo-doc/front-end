"use strict";

// TODO: Form validation
// TODO: User friendly response
// TODO: Double password form

const Page = require("page.class");
const validation = require("validation.module");

class Index extends Page {
	constructor(config, args) {
		super(config, args);
		this._template = require("./index.ejs");
		this._style = require("./index.scss");
	}

	// ----------------------------------------------------------------------------------------------
	// Private auto running fuctions
	// ----------------------------------------------------------------------------------------------

	async __render() {
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

	// ----------------------------------------------------------------------------------------------
	// Private fuctions
	// ----------------------------------------------------------------------------------------------

	async _sendAuthorizationForm() {
		let usermail = document.getElementById("sign-in__usermail").value;
		let password = document.getElementById("sign-in__password").value;
		let feedback = document.getElementById("auth__feedback");

		/*
		if (!(validation.email(usermail) && validation.username(usermail))) {
			feedback.innerHTML = "Invalid Username or Email";
			return;
		}
		*/
		/*
		if (validation.pass(password)) {
			feedback.innerHTML = "Invalid password";
			return;
		}
		*/

		try {
			await APP.getAPI()
				.getAuthorization()
				.signIn(usermail, password);
		} catch (e) {
			// Global error
			if (e instanceof error.RequestError) return;

			// Local error
			if (e instanceof error.AuthorizationError) {
				feedback.innerHTML = "Invalid username or password";
				return;
			}
		}
	}

	async _sendRegistrationForm() {
		let email = document.getElementById("sign-up__email").value;
		let username = document.getElementById("sign-up__username").value;
		let password = document.getElementById("sign-up__password").value;
		let feedback = document.getElementById("auth__feedback");

		try {
			await APP.getAPI()
				.getAuthorization()
				.signUp(username, password, email);
		} catch (e) {
			// Global error
			if (e instanceof error.RequestError) return;

			// Local error
			if (e instanceof error.AuthorizationError) {
				if (e.message === "email") {
					feedback.innerHTML = "Invalid email";
				}
				if (e.message === "username") {
					feedback.innerHTML = "Invalid username";
				}
				return;
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
