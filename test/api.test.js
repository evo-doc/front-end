const colors = require("colors");
const chai = require("chai");
const { assert, expect } = chai;
chai.use(require("chai-http"));
const config = require("../src/config/app.config");

// -------------------------------------------------------------------------------------------------
// API INTERFACE
// -------------------------------------------------------------------------------------------------
const interface = {
	user: {
		register: (username, password, email) => {
			return chai
				.request(config.ajax.host)
				.post("/registration")
				.send({
					username: username,
					password: password,
					email: `${email}@example.com`
				});
		},

		login: (username, password) => {
			return chai
				.request(config.ajax.host)
				.post("/login")
				.send({
					username: username,
					password: password
				});
		},

		activate: (id, token, code) => {
			return chai
				.request(config.ajax.host)
				.post(`/user/activation`)
				.send({
					user_id: id,
					token: token,
					whatever: code
				});
		},

		delete: (id, token) => {
			return chai
				.request(config.ajax.host)
				.del(`/user`)
				.send({
					user_id: id,
					token: token
				});
		}
	},

	statistics: {
		getStats: token => {
			return chai
				.request(config.ajax.host)
				.get(`/stats`)
				.query({ token: token });
		},

		getUsersAll: token => {
			return chai
				.request(config.ajax.host)
				.get(`/user/all`)
				.query({ token: token });
		},

		getUser: (id, token) => {
			return chai
				.request(config.ajax.host)
				.get(`/user`)
				.query({ token: token, user_id: id });
		}
	}
};

const tools = {
	getIdFromToken: token => {
		return +token.substr(0, 10);
	}
};

// -------------------------------------------------------------------------------------------------
// TESTS
// -------------------------------------------------------------------------------------------------
require("./api/connection.api.test")(config, interface, tools);
require("./api/common.api.test")(config, interface, tools);
require("./api/information.api.test")(config, interface, tools);
