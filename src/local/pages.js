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
	"/login/default": require("routes/login/default")({
		root: "root"
	}),

	"/login/verification": require("routes/login/verification")({
		root: "root"
	}),

	"/registry/package/:packageName": require("routes/default/error/404")({
		root: "root"
	}),

	"/error/404": require("routes/default/error/404")({
		root: "root"
	})
};
