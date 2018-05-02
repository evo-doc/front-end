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
	 * @summary Get user ID from his token
	 * @param {string} token - User token
	 * @returns {number} Parsed user ID
	 */
	_parseIDfromToken(token) {
		return +token.substr(0, 10) || -1;
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
		this._storage.setData("token", "empty");
		return true;
	}

	/**
	 * @summary Send sign-in request to the server
	 * @description Send sign-in request and save user session within application. In the case of error give some feedback to user.
	 *
	 * @param {string} username - Username
	 * @param {string} password - Password
	 * @returns {null|boolean} Return null (invalid response), true (success) or throw an error (negative response).
	 */
	async sendAuthorization(username, password) {
		this._removeToken();

		// Backdoor
		if (username === "testOffline" && password === "testOffline") {
			log.debug(`[999] OFFLINE TESTING ACTIVE`);
			this._saveToken("testOffline");
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
			return;
		}

		if (result.status === 200) {
			log.info(`[200] [SIGN IN]: "${username}" was signed in!`);
			this._saveToken(result.data.token);
			APP.getRequest().redirect("/");
			return true;
		}

		if (result.status === 403) throw new error.AuthorizationWarning(400, "SIGN IN", "userpass");
		if (result.status === 404) throw new error.AuthorizationWarning(400, "SIGN IN", "userpass");
		throw new error.UnexpectedBehaviour(result.status, "SIGN IN", result.data);
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
	async sendRegistration(username, password, email) {
		let result;
		try {
			result = await connect.postJSON("/registration", {
				username: username,
				password: password,
				email: email
			});
		} catch (e) {
			return;
		}

		if (result.status === 200) {
			log.info(`[200] [REGISTRATION]: ${username} was registered!`);
			this._saveToken(result.data.token);
			APP.getRequest().redirect("/");
			return true;
		}

		if (result.status === 400)
			throw new error.AuthorizationWarning(result.status, "REGISTRATION", result.data);
		throw new error.UnexpectedBehaviour(result.status, "REGISTRATION", result.data);
	}

	/**
	 * @summary Send verification request to the server
	 * @description Send verification request to activate the user.
	 *
	 * @param {string} code - Validation code
	 * @returns {any} Nobody cares what does it returns.
	 */
	async sendVerification(code = "") {
		// TODO: Verification
		let token = this._getToken();
		return await connect.postJSON("/user/activation", {
			user_id: this._parseIDfromToken(token),
			token: token,
			code: code
		});
	}

	/**
	 * @summary User logout
	 * @description Standard user called logout request.
	 */
	async sendLogout() {
		this._removeToken();
		APP.getRequest().redirect("/authorization/sign-in");
	}

	/**
	 * @summary Send authorization request to the server
	 * @description Check if user token is valid. In other case higher power throws invalid token and sign out the user.
	 *
	 * @returns {any} Nobody cares what does it returns :(
	 */
	async isAuthorized() {
		// Backdoor
		if (this._getToken() === "testOffline") return true;

		// Regular
		let result;
		let token = this._getToken();
		try {
			result = await connect.postJSON("/user/authorised", {
				user_id: this._parseIDfromToken(token),
				token: token
			});
		} catch (e) {
			return false; // It was a global error
		}

		if (result.status === 200) {
			log.trace(`[200] [IS AUTHORIZED]: current user is authorized`);
			return true;
		}

		throw new error.UnexpectedBehaviour(result.status, "IS AUTHORIZED", result.data);
	}
}

module.exports = Authorization;
