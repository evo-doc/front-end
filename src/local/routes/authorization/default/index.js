"use strict";

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
		let usermail = document.getElementById("sign-in__usermail");
		let password = document.getElementById("sign-in__password");
		let feedbackServer = document.getElementById("auth__feedback");
		let feedbackClientUsermail = document.getElementById("sign-in__usermail-feedback");
		let feedbackClientPassword = document.getElementById("sign-in__password-feedback");
		let invalid = false;

		// usermail.classList.remove("input-invalid");
		// password.classList.remove("input-invalid");
		// feedbackClientUsermail.innerHTML = "";
		// feedbackClientPassword.innerHTML = "";

		// if (!usermail.value) {
		// 	// if no value entered
		// 	usermail.classList.add("input-invalid"); // add class if entered value is invalid
		// 	feedbackClientUsermail.innerHTML = "Please enter a Username or E-mail.";
		// 	invalid = true;
		// } else if (!validation.email(usermail.value) && !validation.username(usermail.value)) {
		// 	usermail.classList.add("input-invalid");
		// 	feedbackClientUsermail.innerHTML = "Invalid Username or Email.";
		// 	invalid = true;
		// }

		// if (!password.value) {
		// 	password.classList.add("input-invalid");
		// 	feedbackClientPassword.innerHTML = "Please enter your Password.";
		// 	invalid = true;
		// } else if (!validation.pass(password.value)) {
		// 	password.classList.add("input-invalid");
		// 	feedbackClientPassword.innerHTML = "Invalid password.";
		// 	invalid = true;
		// }

		// if (invalid) {
		// 	return;
		// }

		try {
			await APP.getAPI()
				.getAuthorization()
				.signIn(usermail.value, password.value);
		} catch (e) {
			// Global error
			if (e instanceof error.RequestError) return;

			// Local error
			if (e instanceof error.AuthorizationError) {
				feedbackServer.innerHTML =
					"You have typed the wrong Email Address or Password. Please try again.";
				return;
			}
		}
	}

	async _sendRegistrationForm() {
		let username = document.getElementById("sign-up__username");
		let email = document.getElementById("sign-up__email");
		let password = document.getElementById("sign-up__password");
		let passwordRepeat = document.getElementById("sign-up__password-repeat");

		let feedbackServer = document.getElementById("auth__feedback-2");
		let feedbackClientUsername = document.getElementById("sign-up__username-feedback");
		let feedbackClientEmail = document.getElementById("sign-up__email-feedback");
		let feedbackClientPassword = document.getElementById("sign-up__password-feedback");
		let feedbackClientPasswordRepeat = document.getElementById("sign-up__password-repeat-feedback");

		let invalid = false;

		username.classList.remove("input-invalid");
		email.classList.remove("input-invalid");
		password.classList.remove("input-invalid");
		passwordRepeat.classList.remove("input-invalid");
		feedbackClientUsername.innerHTML = "";
		feedbackClientEmail.innerHTML = "";
		feedbackClientPassword.innerHTML = "";
		feedbackClientPasswordRepeat.innerHTML = "";

		if (!username.value) {
			username.classList.add("input-invalid");
			feedbackClientUsername.innerHTML = "Please enter a Username.";
			invalid = true;
		} else if (!validation.username(username.value)) {
			username.classList.add("input-invalid");
			feedbackClientUsername.innerHTML = "Please enter a valid Username.";
			invalid = true;
		}

		if (!email.value) {
			email.classList.add("input-invalid");
			feedbackClientEmail.innerHTML = "Please provide your E-mail.";
			invalid = true;
		} else if (!validation.email(email.value)) {
			email.classList.add("input-invalid");
			feedbackClientEmail.innerHTML = "Please enter a valid Email.";
			invalid = true;
		}

		if (!password.value) {
			password.classList.add("input-invalid");
			feedbackClientPassword.innerHTML = "Please enter a Password.";
			invalid = true;
		} else if (!validation.pass(password.value)) {
			password.classList.add("input-invalid");
			feedbackClientPassword.innerHTML = "Please enter a valid Password.";
			invalid = true;
		}

		if (!passwordRepeat.value) {
			passwordRepeat.classList.add("input-invalid");
			feedbackClientPasswordRepeat.innerHTML = "Please enter your Password again.";
			invalid = true;
		} else if (passwordRepeat.value != password.value) {
			passwordRepeat.classList.add("input-invalid");
			password.classList.add("input-invalid");
			feedbackClientPasswordRepeat.innerHTML = "Passwords do not match.";
			invalid = true;
		}

		if (invalid) {
			return;
		}

		try {
			await APP.getAPI()
				.getAuthorization()
				.signUp(username.value, password.value, email.value);
		} catch (e) {
			// Global error
			if (e instanceof error.RequestError) return;

			// Local error
			if (e instanceof error.AuthorizationError) {
				if (e.message === "email") {
					feedbackServer.innerHTML =
						"Account with this E-mail Adreess already exists. Please try again.";
				}
				if (e.message === "username") {
					feedbackServer.innerHTML = "This Username is already taken. Please try again.";
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
