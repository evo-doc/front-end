"use strict";

const Storage = require("storage.module");

class Authorization {
	constructor() {
		this._storage;
		this._key;
	}

	inti() {
		this._storage = new Storage("localization", {
			key: "NEW_KEY"
		});
	}

	saveKey(key) {
		this._key = key;
		this._storage.setData("key", this._key);
	}

	getKey() {
		return this._key;
	}

	sendAuthorization(login, pass) {}
	sendRegistration() {}
	sendVerification() {}

	verifyAuthorization() {
		return new Promise((verified, unverified) => {});
	}
}
