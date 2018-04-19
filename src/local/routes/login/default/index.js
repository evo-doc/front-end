("use strict");

const Page = require("page.class");

class Index extends Page {
	constructor(config, args) {
		super(config, args);
		this._template = require("./index.ejs");
		// this._style = require("./index.scss");
	}

	_render(renderDone, renderFail) {
		this._getRoot().innerHTML = this._template();
		fetch("http://localhost:3000/api", { cache: "no-store" })
			.then(response => {
				// console.log(response);
				return response.text();
			})
			.then(text => {
				this._getRoot().innerHTML += text;
			})
			.then(() => {
				renderDone();
			})
			.catch(err => {
				// console.log(err);
				renderFail(400);
			});
	}
}

module.exports = function(config = {}) {
	return {
		config: config,
		page: Index
	};
};
