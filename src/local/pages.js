"use strict";

/**
 * @file Defines all available pages (roots), their paths and options, which are used for their initialization (e.g. where to render, etc.).
 *
 * "/group/page/:param/path/:param"
 *
 * @example <caption>Declaration of a page</caption>
 * "/login/default": require("routes/login/default")({
 * 	root: "root"
 * }),
 */

module.exports = {
	// Authorization (access without token)
	"/authorization/default": require("routes/authorization/default")(),

	// Error Pages (access without token)
	"/error/000": require("routes/error/000")(), // Unexpected behaviour
	"/error/001": require("routes/error/001")(), // Internet connection
	"/error/400": require("routes/error/400")(), // Client error
	"/error/404": require("routes/error/404")(), // Route not found
	"/error/500": require("routes/error/500")(), // Server error

	// Verification
	"/authorization/verification": require("routes/authorization/verification")(),

	// Homepage
	"/": require("routes/homepage")(),

	// Registry
	"/registry": require("routes/registry/default")(),
	"/package/add": require("routes/registry/package/add")(),

	// Interface
	"/interface": require("routes/interface")()

	// Temporary
	// "/rework_example/renderer": require("routes/rework_example/renderer")(),

	// -------------------------

	// // Registry
	// "/registry/package/:packageName": require("routes/default/error/404")(),

	// // Examples
	// "/default/example/empty/:size/:color": require("routes/default/example/empty")(),
	// "/default/example/render/:behaviour/": require("routes/default/example/renderer")()
};
