const string = require("randomstring");
const colors = require("colors");
const chai = require("chai");
const { assert, expect } = chai;
chai.use(require("chai-http"));

module.exports = (config, interface, tools) => {
	describe("COMMON ERRORS", () => {
		describe("Inconsistent data", () => {
			it("registration (empty request)", async () => {
				let response = await chai
					.request(config.ajax.host)
					.post("/registration")
					.send({});
				expect(response.status).to.equal(400);
				expect(JSON.parse(response.text)).to.equal("data");
			});

			it("registration (missing username)", async () => {
				let response = await chai
					.request(config.ajax.host)
					.post("/registration")
					.send({
						password: string.generate(),
						email: string.generate()
					});
				expect(response.status).to.equal(400);
				expect(JSON.parse(response.text)).to.equal("data");
			});

			it("registration (missing password)", async () => {
				let response = await chai
					.request(config.ajax.host)
					.post("/registration")
					.send({
						username: string.generate(),
						email: string.generate()
					});
				expect(response.status).to.equal(400);
				expect(JSON.parse(response.text)).to.equal("data");
			});

			it("registration (missing email)", async () => {
				let response = await chai
					.request(config.ajax.host)
					.post("/registration")
					.send({
						username: string.generate(),
						password: string.generate()
					});
				expect(response.status).to.equal(400);
				expect(JSON.parse(response.text)).to.equal("data");
			});

			it("login (missing username)", async () => {
				let response = await chai
					.request(config.ajax.host)
					.post("/login")
					.send({
						password: string.generate()
					});
				expect(response.status).to.equal(400);
				expect(JSON.parse(response.text)).to.equal("data");
			});

			it("login (missing password)", async () => {
				let response = await chai
					.request(config.ajax.host)
					.post("/login")
					.send({
						username: string.generate()
					});
				expect(response.status).to.equal(400);
				expect(JSON.parse(response.text)).to.equal("data");
			});
		});

		describe("Invalid token", () => {
			it("reject to delete user with invalid token", async () => {
				// Register
				let hash = string.generate();
				let response = await interface.user.register(hash, hash, hash);
				let body = JSON.parse(response.text);
				let id = tools.getIdFromToken(body.token);
				let token = body.token;

				// Try Delete
				response = await interface.user.delete(id, `${token}${string.generate()}`);
				// Delete
				await interface.user.delete(id, token);

				expect(response.status).to.equal(403);
				expect(JSON.parse(response.text)).to.equal("Invalid token.");
			}).timeout(5000);
		});
	});
};
