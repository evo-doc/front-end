"use strict";

let loader = document.getElementById("loader");

module.exports.show = () => {
	loader.setAttribute("class", "loader_show");
};

module.exports.hide = () => {
	loader.setAttribute("class", "loader_hide");
};
