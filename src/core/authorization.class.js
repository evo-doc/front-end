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

	saveToken(token) {
		this._storage.setData("token", token);
	}

	removeToken() {
		this._storage.setData("token", "empty");
	}

	async sendAuthorization(username, password) {
		this.removeToken();
		let res = await connect.postJSON("/login", {
			username: username,
			password: password
		});

		let status = res.status;
		let response = {};
		await res.json().then(json => {
			response = json;
		});

		if (res.status === 200) {
			log.trace(`[SIGN IN] [200]: "${username}", "${password}"`);
			this.saveToken(response.token);
			APP.getRequest().redirect("/");
			return 200;
		}

		if (res.status === 403) {
			log.warn(`[SIGN IN] [403]: "${username}", "${password}" -> invalid password`);
			return 400;
		}

		// FIXME: Server should return 403 if username is wrong (backend bug)
		if (res.status === 404) {
			log.warn(`[SIGN IN] [404]: "${username}", "${password}" -> invalid username`);
			return 400;
		}

		// Unexpected status
		log.error(`[SIGN IN] Unexpected behaviour - ${res.status}`);
		return false;
	}

	async sendRegistration(username, password, email) {
		let res = await connect.postJSON("/registration", {
			username: username,
			password: password,
			email: email
		});

		if (res.status === 200) {
			await res.json().then(data => {
				this.saveToken(data.token);
			});

			return APP.getRequest().redirect("/");
		}

		return;
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
		this.removeToken();
		APP._request.redirect("/");
	}

	async isAuthorized() {
		let token = this._getToken();
		log.info(`isAuthorised ${token}, ${this._parseIDfromToken(token)}`);
		let res = await connect.postJSON("/user/authorised", {
			user_id: this._parseIDfromToken(token),
			token: token
		});

		if (res.status === 403) {
			APP.getRequest().redirect("/authorization/sign-in");
			return false;
		}

		return true;
	}
}

module.exports = Authorization;
