"use strict";

const Storage = require("storage.module");

class Authorization {
	constructor() {
		this._storage;
	}

	init() {
		// Init storage
		this._storage = new Storage("authorization", {
			token: "empty"
		});
	}

	_parseIDfromToken(token) {
		return +token.substr(0, 10) || -1;
	}

	_getToken() {
		return this._storage.getData("token");
	}

	_saveToken(token) {
		this._storage.setData("token", token);
		return true;
	}

	_removeToken() {
		this._storage.setData("token", "empty");
		return true;
	}

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

	async sendVerification(code = "") {
		let token = this._getToken();
		return await connect.postJSON("/user/activation", {
			user_id: this._parseIDfromToken(token),
			token: token,
			code: code
		});
	}

	async sendLogout() {
		this._removeToken();
		APP.getRequest().redirect("/authorization/sign-in");
	}

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
