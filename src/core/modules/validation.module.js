"use strict";
/**
 * @summary Provides an interface for validation
 * @module Validation
 * @example <caption> How to include validation module </caption>
 * const validation = require("validation.module")
 */

/**
 * @description Determine whether email is valid.
 * @param {string} email - Users email
 * @return {boolean} - Email is valid
 */
module.exports.email = email => {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email.toLowerCase());
};

/**
 * @description Determine whether password is valid.
 * @param {string} pass - Users password
 * @return {boolean} - Password is valid
 */
module.exports.pass = pass => {
	var re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
	return re.test(pass.toLowerCase());
};

/**
 * @description Determine whether username is valid.
 * @param {string} username - Users username
 * @return {boolean} - Username is valid
 */
module.exports.username = username => {
	var re = /^[a-zA-Z0-9\-\_]+$/;
	return re.test(username.toLowerCase());
};

/**
 * @description Check if github URL is valid.
 * @param {string} githubURL - Github URL
 * @return {boolean} - URL is valid
 */
module.exports.githubURL = githubURL => {
	var re = /^(?:https?:\/\/)?(?:www\.)?github\.com(\/[a-z0-9A-Z_.-]+){2}\/?$/;
	return re.test(url.toLowerCase());
};
