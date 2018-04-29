"use strict";

const Application = require("application.class");
const sass = require("./local/styles/main.scss");
const fontawesome = require("./local/resources/libraries/fontawesome");

// Initialisation, APP is a global variable
global.APP = new Application();
APP.init();

// Show loader just for sure
loader.show();

// Try to reload last page
APP.getRequest().reload();
