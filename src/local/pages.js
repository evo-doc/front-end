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

	// Docs
	"/docs": require("routes/docs/default")(),
	"/docs/about": require("routes/docs/about")(),

	// Registry
	"/registry": require("routes/registry/default")(),
	"/registry/package/add": require("routes/registry/package/add")(),
	"/registry/package/show/:pkgId": require("routes/registry/package/show")(),

	// Profile
	"/profile": require("routes/profile/default")(),
	"/profile/settings": require("routes/profile/settings")(),

	// Dashboard
	"/dashboard": require("routes/dashboard/default")(),
	// Dashboard project
	"/dashboard/project/:pId": require("routes/dashboard/project/default")(),
	"/dashboard/project/:pId/settings": require("routes/dashboard/project/settings")(),
	// Dashboard project -> pacakge add
	"/dashboard/project/:pId/package/add": require("routes/dashboard/project/package/add")(),
	// Dashboard project -> module
	"/dashboard/project/:pId/module/add": require("routes/dashboard/project/module/add")(),
	"/dashboard/project/:pId/module/edit/:mId": require("routes/dashboard/project/module/edit")()
};
