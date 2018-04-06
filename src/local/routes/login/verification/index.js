"use strict";

const Route = require("route.class");

class Index extends Route {
	constructor(options, params) {
		super();
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

	render(element = "root") {
		document.getElementById(element).innerHTML = this._template();

		connect
			.getJSON()
			.then(data => {
				console.log("YEAH");
				console.log(data);
			})
			.catch(data => {
				console.log("NOPE");
				console.log(data);
			});
	}
}

module.exports = function(options = {}) {
	// Defautl options
	return {
		options: options,
		page: Index
	};
};
