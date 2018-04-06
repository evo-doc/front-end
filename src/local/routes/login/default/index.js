"use strict";

const Route = require("route.class");

class Index extends Route {
	constructor(options, params) {
		super();
		this._template = require("./index.ejs");
		this._style = require("./index.scss");
	}

	// render(){
	// 	const data = {
	// 		_route: this._url,
	// 		_lang: APP.getLocalization().getLocalization(),
	// 		_data: this._data
	// 	};
	// 	document.getElementById(element).innerHTML = this._template(data);
	// }

	// render(element = "root") {
	// document.getElementById(element).innerHTML = this._template();
	// }
}

module.exports = function(options = {}) {
	// Defautl options
	return {
		options: options,
		page: Index
	};
};
