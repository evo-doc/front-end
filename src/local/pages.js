"use strict";

// TODO: Documentation

/**
 * @file Defines all available pages (roots), their paths and options, which are used for their initialization (e.g. where to render, etc.).
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
	// Authorization (access without token)
	"/authorization/sign-in": require("routes/test/authorization/sign-in")(),
	"/authorization/sign-up": require("routes/test/authorization/sign-up")(),
	"/authorization/password": require("routes/test/authorization/password")(),

	// Error Pages (access without token)
	"/error/400": require("routes/default/error/400")(),
	"/error/404": require("routes/default/error/404")(),
	"/error/500": require("routes/default/error/500")(),

	// Authorization
	"/verification": require("routes/login/verification")(),

	// Pages
	"/": require("routes/homepage")(),
	"/packages": require("routes/packages")(),
	"/projects": require("routes/projects")(),
	"/settings": require("routes/settings")(),
	"/upload": require("routes/upload")(),
	"/docs": require("routes/docs")(),

	// Registry
	"/registry/package/:packageName": require("routes/default/error/404")(),

	// Examples
	"/default/example/empty/:size/:color": require("routes/default/example/empty")(),
	"/default/example/render/:behaviour/": require("routes/default/example/renderer")()
};
