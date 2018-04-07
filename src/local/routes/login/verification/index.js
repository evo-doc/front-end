"use strict";

const Page = require("page.class");

class Index extends Page {
	constructor(config, params) {
		super(config);
		this._template = require("./index.ejs");
		this._style = null;
	}

	// render(){
	// 	const data = {
	// 		_route: this._url,
	// 		_lang: APP.getLocalization().getLocalization(),
	// 		_data: this._data
	// 	};
	// 	document.getElementById(element).innerHTML = this._template(data);
	// }

	render() {
		this._getRoot().innerHTML = this._template();
	}
}

module.exports = function(config = {}) {
	return {
		config: config,
		page: Index
	};
};
