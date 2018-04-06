"use strict";

// TODO: Documentation

/**
 * @summary Abstract class for routes
 * @description Defines a basic interface for rendering, etc. for each route.
 * @class
 *
 * @param {object} params - Parameters
 */

class Route {
	constructor(root = "root") {
		this._name = null;
		this._template = null;
		this._root = root;
	}

	init() {}

	_getRoot() {
		return document.getElementById(this._root);
	}

	_getLocalization() {
		return APP.getLocalization().getLocalization();
	}

	_getRouteName() {
		return this._name
			? this._name
			: "Ok, I know, that you are too lazy but still... At least name your route!";
	}

	render(element = "root") {
		let elem = document.getElementById(element);
		elem.innerHTML = "<p>You forgot to overload render();</p>";
		elem.innerHTML += `<p>${this._getRouteName()}</p>`;
		elem.innerHTML += "<pre>" + JSON.stringify(this._getLocalization(), null, "  ") + "</pre>";
	}
}

module.exports = Route;
