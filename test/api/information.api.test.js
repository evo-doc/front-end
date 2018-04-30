const string = require("randomstring");
const colors = require("colors");
const chai = require("chai");
const { assert, expect } = chai;
chai.use(require("chai-http"));

module.exports = (config, interface, tools) => {
	describe("INFORMATION", () => {
		before(async () => {
			await tools.createUserForTests();
		});

		describe("Statistics", () => {
			it("quantity of packages, users, projects, modules", async () => {
				let response = await interface.user.login("userTest", "userTest");
				let token = JSON.parse(response.text).token;
				response = await interface.statistics.getStats(token);
				expect(response.status).to.equal(200);
				let body = JSON.parse(response.text);
				expect(body)
					.to.have.property("package_count")
					.that.is.a("number");
				expect(body)
					.to.have.property("module_count")
					.that.is.a("number");
				expect(body)
					.to.have.property("project_count")
					.that.is.a("number");
				expect(body)
					.to.have.property("user_count")
					.that.is.a("number");
			});
		});

		describe("User data", () => {
			describe("One user", () => {
				it("valid request", async () => {
					let response = await interface.user.login("userTest", "userTest");
					let token = JSON.parse(response.text).token;
					let id = tools.getIdFromToken(token);
					response = await interface.statistics.getUser(id, token);
					expect(response.status).to.equal(200);
					let body = JSON.parse(response.text);
					expect(body)
						.to.have.property("id")
						.that.is.a("number");
					expect(body)
						.to.have.property("name")
						.that.is.a("string");
					expect(body)
						.to.have.property("email")
						.that.is.a("string");
				});

				it("reject request with invalid id", async () => {
					let response = await interface.user.login("userTest", "userTest");
					let token = JSON.parse(response.text).token;
					response = await interface.statistics.getUser(-1, token);
					expect(response.status).to.equal(404);
				});
			});

			describe("All users", () => {
				it("valid request", async () => {
					let response = await interface.user.login("userTest", "userTest");
					let token = JSON.parse(response.text).token;
					response = await interface.statistics.getUsersAll(token);
					expect(response.status).to.equal(200);
					let body = JSON.parse(response.text);
					expect(body).is.a("array");
				});

				it("reject request with invalid token", async () => {
					let response = await interface.user.login("userTest", "userTest");
					let token = JSON.parse(response.text).token;
					response = await interface.statistics.getUsersAll(
						token
							.split("")
							.reverse()
							.join("")
					);
					expect(response.status).to.equal(403);
				});
			});
		});
	});
};
