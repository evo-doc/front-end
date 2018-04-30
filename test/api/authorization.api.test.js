const string = require("randomstring");
const colors = require("colors");
const chai = require("chai");
const { assert, expect } = chai;
chai.use(require("chai-http"));

module.exports = (config, interface, tools) => {
	describe("AUTHORIZATION", () => {
		before(async () => {
			await tools.createUserForTests();
		});

		describe("Registration", () => {
			it("valid registration", async () => {
				let hash = string.generate();
				let data = await interface.user.register(hash, hash, hash);

				let body = JSON.parse(data.text);
				expect(data.status).to.equal(200);
				expect(body)
					.to.have.property("token")
					.that.is.a("string")
					.that.match(/^[0-9]{10}.{36}$/);

				let id = tools.getIdFromToken(body.token);
				await interface.user.delete(id, body.token);
			}).timeout(3000);

			it("reject non-unique username", async () => {
				let data = await interface.user.register(
					"userTest",
					string.generate(),
					string.generate()
				);
				expect(data.status).to.equal(400);
				expect(JSON.parse(data.text)).to.equal("username");
			});

			it("reject non-unique email", async () => {
				let data = await interface.user.register(
					string.generate(),
					string.generate(),
					"userTest"
				);
				expect(data.status).to.equal(400);
				expect(JSON.parse(data.text)).to.equal("email");
			});
		});

		describe("Sign In", () => {
			it("valid verified user", async () => {
				let hash = string.generate();
				let data = await interface.user.register(hash, hash, hash);
				let body = JSON.parse(data.text);
				let id = tools.getIdFromToken(body.token);

				await interface.user.verify(id, body.token, "validcode");

				data = await interface.user.login(hash, hash);
				body = JSON.parse(data.text);

				await interface.user.delete(id, body.token);

				expect(data.status).to.equal(200);
				expect(body)
					.to.have.property("token")
					.that.is.a("string")
					.that.match(/^.{46}$/);
				expect(body)
					.to.have.property("verified")
					.that.is.equal("true");
			}).timeout(5000);

			it("valid unverified user", async () => {
				let hash = string.generate();
				let data = await interface.user.register(hash, hash, hash);
				let body = JSON.parse(data.text);
				let id = tools.getIdFromToken(body.token);

				data = await interface.user.login(hash, hash);
				body = JSON.parse(data.text);

				await interface.user.delete(id, body.token);

				expect(data.status).to.equal(200);
				expect(body)
					.to.have.property("token")
					.that.is.a("string")
					.that.match(/^.{46}$/);
				expect(body)
					.to.have.property("verified")
					.that.is.equal("false");
			}).timeout(5000);

			it("reject invalid username", async () => {
				let data = await interface.user.login(string.generate(), "userTest");
				expect(data.status).to.equal(404);
				expect(JSON.parse(data.text)).to.equal("User not found.");
			});

			it("reject invalid password", async () => {
				let data = await interface.user.login("userTest", string.generate());
				expect(data.status).to.equal(403);
				expect(JSON.parse(data.text)).to.equal("Invalid username or password.");
			});
		});

		describe("Verification", () => {
			it("valid code", async () => {
				let hash = string.generate();
				let data = await interface.user.register(hash, hash, hash);
				let body = JSON.parse(data.text);
				let id = tools.getIdFromToken(body.token);
				data = await interface.user.verify(id, body.token, "validcode");
				await interface.user.delete(id, body.token);
				expect(data.status).to.equal(200);
			});

			/*
			it("invalid code", async () => {
				let hash = string.generate();
				let data = await interface.user.register(hash, hash, hash);
				let body = JSON.parse(data.text);
				let id = tools.getIdFromToken(body.token);
				data = await interface.user.verify(id, body.token, "invalidcode");
				await interface.user.delete(id, body.token);
				expect(data.status).to.equal(400);
				expect(JSON.parse(data.text)).to.equal("Invalid verification code.");
			});
			*/

			it("invalid id", async () => {
				let hash = string.generate();
				let data = await interface.user.register(hash, hash, hash);
				let body = JSON.parse(data.text);
				let id = tools.getIdFromToken(body.token);
				data = await interface.user.verify(id + 1, body.token, "validcode");
				await interface.user.delete(id, body.token);
				expect(data.status).to.equal(404);
			});
		});

		describe("Delete", () => {
			it("valid delete", async () => {
				let hash = string.generate();
				let data = await interface.user.register(hash, hash, hash);
				let body = JSON.parse(data.text);
				let id = tools.getIdFromToken(body.token);
				data = await interface.user.delete(id, body.token);
				expect(data.status).to.equal(200);
			});

			it("invalid id", async () => {
				let hash = string.generate();
				let data = await interface.user.register(hash, hash, hash);
				let body = JSON.parse(data.text);
				let id = tools.getIdFromToken(body.token);
				// Try do delete
				data = await interface.user.delete(id + 1, body.token);
				// Delete
				await interface.user.delete(id, body.token);
				expect(data.status).to.equal(404);
			});

			it("invalid token", async () => {
				let hash = string.generate();
				let data = await interface.user.register(hash, hash, hash);
				let body = JSON.parse(data.text);
				let id = tools.getIdFromToken(body.token);
				// Try do delete
				data = await interface.user.delete(id, body.token + "a");
				// Delete
				await interface.user.delete(id, body.token);
				expect(data.status).to.equal(403);
			});
		});
	});
};
