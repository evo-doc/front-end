"use strict";

// TODO: Documentation

/**
 * @file Defines all available pages (roots), their paths and options, which ale used for their initialization (e.g. where to render, etc.).
 *
 *
 * "/group/page/:param/path/:param"
 *
 * @example <caption>Define one page</caption>
 * "/login/default": require("routes/login/default")({
 * 	root: "root"
 * }),
 */

module.exports = {
	// Authorization
	"/login/default": require("routes/login/default")(),

	"/login/verification": require("routes/login/verification")(),

	// Registry
	"/registry/package/:packageName": require("routes/default/error/404")(),

	// Error Pages
	"/error/400": require("routes/default/error/400")(),
	"/error/404": require("routes/default/error/404")(),
	"/error/500": require("routes/default/error/500")(),

	// Examples
	"/default/example/empty/:size/:color": require("routes/default/example/empty")(),
	"/default/example/render/:behaviour/": require("routes/default/example/renderer")()
};
