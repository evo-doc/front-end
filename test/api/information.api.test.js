const string = require("randomstring");
const colors = require("colors");
const chai = require("chai");
const { assert, expect } = chai;
chai.use(require("chai-http"));

module.exports = (config, interface, tools) => {
	describe("INFORMATION", () => {
		let userTestToken;
		before(async () => {
			userTestToken = await tools.createUserForTests();
		});

		describe("Statistics", () => {
			it("quantity of packages, users, projects, modules", async () => {
				response = await interface.statistics.getStats(userTestToken);
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
					let id = tools.getIdFromToken(userTestToken);
					response = await interface.statistics.getUser(id, userTestToken);
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
					let response = await interface.statistics.getUser(-1, userTestToken);
					expect(response.status).to.equal(404);
				});
			});

			describe("All users", () => {
				it("valid request", async () => {
					let response = await interface.statistics.getUsersAll(userTestToken);
					expect(response.status).to.equal(200);
					let body = JSON.parse(response.text);
					expect(body).is.a("array");
				});

				it("reject request with invalid token", async () => {
					let response = await interface.statistics.getUsersAll(userTestToken + "a");
					expect(response.status).to.equal(403);
				});
			});
		});
	});
};
