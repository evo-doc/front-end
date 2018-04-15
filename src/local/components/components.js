"use strict";

/**
 * @file Auto-loader of all available components.
 * More info: README.md -> Components
 */

var components = {};

// EJS - ./**/componentId/index.ejs
let importEJS = files => {
	files.keys().forEach(file => {
		let pathSplit = file.split("/");
		let keyName = pathSplit[pathSplit.length - 2];
		if (Object.keys(components).indexOf(keyName) != -1) {
			log.error(`Component collision: ${keyName} already exists!`);
		} else {
			components[keyName] = files(file);
		}
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
