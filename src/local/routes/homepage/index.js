"use strict";

const Page = require("page.class");

class Index extends Page {
	constructor(config, args) {
		super(config, args);
		this._template = require("./index.ejs");
		this._style = require("./index.scss");
	}

	_render(renderDone, renderFail) {
		let that = this;

		let token = "00000000037568b5d6-c59d-4dc7-92f8-5e1f571086d5";
		let allUsers = connect.getJSON(`/user/all`, {
			token: token,
			oo: "lol"
		});

		connect
			.waitAJAX(allUsers)

			.then(texts => {
				console.log(texts);

				texts.forEach(currentItem => {
					console.log(currentItem);

					this._getRoot().innerHTML += JSON.stringify(currentItem);
				});
				renderDone();
			});
	}
}

module.exports = function(config = {}) {
	return {
		config: config,
		page: Index
	};
};
