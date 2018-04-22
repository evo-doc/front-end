"use strict";

// TODO: Documentation

class Request {
	constructor() {
		this._baseUrl = window.location.href.split("#")[0];
	}

	init() {
		this._startListening();
	}

	/**
	 * @summary Start listen user clicks on <a> tags
	 * @description Listens user click to let Router know that we need another page
	 * @private
	 */
	_startListening() {
		let self = this;
		// let root = document.getElementById("root");

		/*
			// Link Autofixer
			root.addEventListener("mousemove", function(e) {
				if (e.target.tagName === "A" && e.target.getAttribute("href").indexOf("#") !== 0)
					e.target.setAttribute("href", `#${e.target.getAttribute("href")}`);
			});
		*/

		document.addEventListener("click", function(e) {
			if (e.target.tagName === "A") {
				let href = e.target.getAttribute("href");
				let link = self._getLinkFromHref(href);
				self.load(link);
			} else {
				let closest = e.target.closest("a");
				if (closest) {
					let href = closest.getAttribute("href");
					self.load(self._getLinkFromHref(href));
				}
			}
		});
	}

	/**
	 * @summary Get current page link
	 * @description Parse window.location.href and get current route link
	 *
	 * @returns {string} Route link
	 */
	_getCurrentUrl() {
		return window.location.href.split("#")[1] || "/";
	}

	/**
	 * @summary Get route link from href
	 * @description Cuts "#" from href
	 * @private
	 *
	 * @param {string} href - Href from <a>
	 * @returns {string} Router link
	 */
	_getLinkFromHref(href) {
		return href.slice(1);
	}

	/**
	 * @summary Load requested page
	 * @description Load page after user click (windows.location.href is already changed).
	 *
	 * @param {string} link - Route link
	 *
	 * @example
	 * APP.getRequest().load("/registry/package/awesome");
	 */
	load(link) {
		APP.getRouter().route(link);
	}

	/**
	 * @summary Reload current page
	 * @description Get the current url and reload page.
	 *
	 * @example
	 * APP.getRequest().reload();
	 */
	reload() {
		this.load(this._getCurrentUrl());
	}

	/**
	 * @summary Redirect page to specific url
	 * @description Simulate user click on link, change window.location.href and load a route.
	 *
	 * @param {string} link - Route link
	 *
	 * @example
	 * APP.getRequest().redirect("/registry/package/awesome");
	 */
	redirect(link) {
		window.location.href = this._baseUrl + "#" + link;
		this.load(link);
	}
}

module.exports = Request;
