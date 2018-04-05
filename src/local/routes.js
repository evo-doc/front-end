"use strict";

// TODO: Documentation

/**
 * "/group/page/:param/path/:param"
 */

module.exports = {
	"/login/default": require("routes/login/default")({}),
	"/login/verification": require("routes/login/verification")({}),
	"/error/404": require("routes/default/error/404")({})
};
