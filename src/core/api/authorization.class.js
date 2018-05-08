"use strict";

const Storage = require("storage.module");

class Authorization {
	/**
	 * @summary Authorization container
	 * @description Provides (almost) independent interface for authorization.
	 * @class
	 *
	 * @returns {Authorization} Authorization instance
	 */
	constructor() {
		this._storage;
	}

	init() {
		// Init storage
		this._storage = new Storage("authorization", {
			token: "empty"
		});
	}

	/**
	 * @summary Send sign-in request to the server
	 * @description Send sign-in request and save user session within application. In the case of error give some feedback to user.
	 *
	 * @param {string} username - Username
	 * @param {string} password - Password
	 * @returns {null|boolean} Return null (invalid response), true (success) or throw an error (negative response).
	 */
	async signIn(username, password) {
		this._removeToken();

		// Backdoor
		if (username === "test" && password === "test") {
			log.debug(`[000] OFFLINE TESTING ACTIVE`);
			this._saveToken("test");
			APP.getRequest().redirect("/");
			return true;
		}

		// Regular login
		let result;
		try {
			result = await connect.postJSON("/login", {
				username: username,
				password: password
			});
		} catch (e) {
			throw e;
		}

		if (result.status === 200) {
			log.info(`[200] User "${username}" was signed in!`);
			this._saveToken(result.body.token);
			APP.getRequest().redirect("/");
			return;
		}

		// Throw local errors
		if (result.status === 400 && result.body === "userpass")
			throw new error.AuthorizationError(result.status, "SIGN IN", result.body);

		// We have unexpected behaviour
		let e = new error.RequestError(
			"ERROR",
			result.status,
			result.hash,
			"Unexpected behaviour!",
			"Sign In"
		);
		APP.getRequest().redirect("/error/000");
		throw e;
	}

	/**
	 * @summary Send sign-up request to the server
	 * @description Send sign-up request and save user session within application. In the case of error give some feedback to user.
	 *
	 * @param {string} username - Username
	 * @param {string} password - Password
	 * @param {string} email - E-mail
	 * @returns {null|boolean} Return null (invalid response), true (success) or throw an error (negative response).
	 */
	async signUp(username, password, email) {
		let result;
		try {
			result = await connect.postJSON("/registration", {
				username: username,
				password: password,
				email: email
			});
		} catch (e) {
			throw e;
		}

		if (result.status === 200) {
			log.info(`[200] User "${username}" was successfully registered!`);
			this._saveToken(result.body.token);
			APP.getRequest().redirect("/authorization/verification");
			return;
		}

		if (result.status === 400)
			throw new error.AuthorizationError(result.status, "REGISTRATION", result.body);

		// We have unexpected behaviour
		let e = new error.RequestError(
			"ERROR",
			result.status,
			result.hash,
			"Unexpected behaviour!",
			"Sign Up"
		);
		APP.getRequest().redirect("/error/000");
		throw e;
	}

	/**
	 * @summary Send verification request to the server
	 * @description Send verification request to activate the user.
	 *
	 * @param {string} code - Validation code
	 * @returns {any} Nobody cares what does it returns.
	 */
	async verify(key = "") {
		let result;
		try {
			result = await connect.postJSON("/user/activation", {
				token: this._getToken(),
				key: key
			});
		} catch (e) {
			throw e;
		}

		if (result.status === 200) {
			log.trace(`[200] User was successfully verified.`);
			return;
		}

		// We have unexpected behaviour
		let e = new error.RequestError(
			"ERROR",
			result.status,
			result.hash,
			"Unexpected behaviour!",
			"User verification"
		);
		APP.getRequest().redirect("/error/000");
		throw e;
	}

	/**
	 * @summary Sign out
	 * @description Standard user called sign out request.
	 */
	async signOut() {
		this._removeToken();
		APP.getRequest().redirect("/");
	}

	/**
	 * @summary Send authorization request to the server
	 * @description Check if user token is valid. In other case higher power throws invalid token and sign out the user.
	 *
	 * @returns {any} Nobody cares what does it returns :(
	 */
	async isAuthorized() {
		// Backdoor
		if (this._getToken() === "test") return true;

		// Regular
		let result;
		try {
			result = await connect.postJSON("/user/authorised", {
				token: this._getToken()
			});
		} catch (e) {
			throw e;
		}

		if (result.status === 200) {
			log.trace(`[200] [IS AUTHORIZED]: Current user is authorized.`);
			return;
		}

		// We have unexpected behaviour
		let e = new error.RequestError(
			"ERROR",
			result.status,
			result.hash,
			"Unexpected behaviour!",
			"is authorized check"
		);
		APP.getRequest().redirect("/error/000");
		throw e;
	}

	/**
	 * @summary Get user ID from his token
	 * @param {string} token - User token
	 * @returns {number} Parsed user ID
	 */
	_getUserId() {
		return +this._getToken().substr(0, 10) || -1;
	}

	/**
	 * @summary Get user token from the storage
	 * @returns {string} User token
	 */
	_getToken() {
		return this._storage.getData("token");
	}

	/**
	 * @summary Save user token to the storage
	 * @param {string} token - User token
	 */
	_saveToken(token) {
		this._storage.setData("token", token);
		return true;
	}

	/**
	 * @summary Remove user token from the storage
	 */
	_removeToken() {
		this._storage.setData("token", "");
		return true;
	}
}

module.exports = Authorization;
