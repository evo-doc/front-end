"use strict";

/**
 * @file Auto-loader of all available components.
 * More info: README.md -> Components
 */

var components = {};

// EJS - ./**/index.ejs
let importEJS = files => {
	files.keys().forEach(file => {
		let keyName = file.split("/")[1];
		components[keyName] = files(file);
	});
};

importEJS(require.context("./", true, /index\.ejs$/));

// SCSS - ./**/index.scss
let importSCSS = files => {
	files.keys().forEach(file => {
		files(file);
	});
};

importSCSS(require.context("./", true, /index\.scss$/));

module.exports = components;
