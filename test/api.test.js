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
		register: async (username, password, email) => {
			return await chai
				.request(config.ajax.host)
				.post("/registration")
				.send({
					username: username,
					password: password,
					email: `${email}@example.com`
				});
		},

		login: async (username, password) => {
			return await chai
				.request(config.ajax.host)
				.post("/login")
				.send({
					username: username,
					password: password
				});
		},

		verify: async (id, token, code) => {
			return await chai
				.request(config.ajax.host)
				.post(`/user/activation`)
				.send({
					user_id: id,
					token: token,
					whatever: code
				});
		},

		delete: async (id, token) => {
			return await chai
				.request(config.ajax.host)
				.del(`/user`)
				.send({
					user_id: id,
					token: token
				});
		}
	},

	statistics: {
		getStats: async token => {
			return await chai
				.request(config.ajax.host)
				.get(`/stats`)
				.query({ token: token });
		},

		getUsersAll: async token => {
			return await chai
				.request(config.ajax.host)
				.get(`/user/all`)
				.query({ token: token });
		},

		getUser: async (id, token) => {
			return await chai
				.request(config.ajax.host)
				.get(`/user`)
				.query({ token: token, user_id: id });
		}
	}
};

const tools = {
	getIdFromToken: token => {
		return +token.substr(0, 10);
	},

	createUserForTests: async () => {
		// Create user for testing
		let response = await interface.user.register("userTest", "userTest", "userTest");
		let data = JSON.parse(response.text);

		if (response.status === 200) {
			await interface.user.verify(tools.getIdFromToken(data.token), data.token, "random");
		} else {
			response = await interface.user.login("userTest", "userTest");
			data = JSON.parse(response.text);
		}

		return data.token;
	}
};

// -------------------------------------------------------------------------------------------------
// TESTS
// -------------------------------------------------------------------------------------------------
// require("./api/connection.api.test")(config, interface, tools);
// require("./api/common.api.test")(config, interface, tools);
// require("./api/information.api.test")(config, interface, tools);
// require("./api/authorization.api.test")(config, interface, tools);
