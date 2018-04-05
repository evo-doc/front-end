"use strict";

const Application = require("application.class");
const sass = require("./local/styles/main.scss");

// Initialisation, APP is a global variable
global.APP = new Application();
APP.init();

// Initialization page
// FIXME: It's just a placeholder
setTimeout(() => {
	APP.getRequest().redirect("/login/default");
}, 500);
