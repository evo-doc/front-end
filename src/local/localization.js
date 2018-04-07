"use strict";

/**
 * @file Localization auto-loader
 * More info: README.md -> Localization
 */

var localization = {};

let imporLocalization = files => {
	files.keys().forEach(file => {
		let keyName = file.split("/")[1].split(".")[0];
		localization[keyName] = files(file);
	});
};

imporLocalization(require.context("./localization", true, /\.json$/));

module.exports = localization;
