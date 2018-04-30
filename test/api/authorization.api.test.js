const string = require("randomstring");
const colors = require("colors");
const chai = require("chai");
const { assert, expect } = chai;
chai.use(require("chai-http"));

module.exports = (config, interface) => {};

// -------------------------------------------------------------------------------------------------
// AUTHORIZATION
// -------------------------------------------------------------------------------------------------
describe("AUTHORIZATION", () => {
	before(async () => {
		// Create user for testing
		let response = await interface.user.register(
			"autorizationTest",
			"autorizationTest",
			"autorizationTest"
		);

		if (response.status === 200) {
			let data = JSON.parse(response.text);
			await interface.user.activate(tools.getIdFromToken(data.token), data.token, "random");
		}
	});

	// ----------------------------------------------------------------------------------------------
	// REGISTRATION
	// ----------------------------------------------------------------------------------------------
	describe("POST /registration", () => {
		it("valid => expect 200 & token", async () => {
			let hash = string.generate();
			let data = await registerUser(hash, hash, hash);

			let body = JSON.parse(data.text);
			expect(data.status).to.equal(200);
			expect(body).to.have.property("token");
			expect(body.token).to.not.equal(null);
			expect(body.token).to.be.a("string");
			expect(body.token).to.match(/^[0-9]{10}.{36}$/);

			let id = parseInt(body.token.substr(0, 10));
			await deleteUser(id, body.token);
		}).timeout(3000);

		it("wrong username => expect 400 & 'username'", async () => {
			let data = await registerUser("autorizationTest", string.generate(), string.generate());
			expect(data.status).to.equal(400);
			expect(JSON.parse(data.text)).to.equal("username");
		});

		it("wrong email => expect 400 & 'email'", async () => {
			let data = await registerUser(string.generate(), string.generate(), "autorizationTest");
			expect(data.status).to.equal(400);
			expect(JSON.parse(data.text)).to.equal("email");
		});

		// it("wrong password => expect 400 & 'password'", async () => {
		// 	let data = await registerUser(str.generate(), "", str.generate());
		// 	expect(data.status).to.equal(400);
		// 	expect(JSON.parse(data.text)).to.equal("password");
		// });
	});

	// ----------------------------------------------------------------------------------------------
	// LOGIN
	// ----------------------------------------------------------------------------------------------
	describe("POST /login", () => {
		describe("Valid data", () => {
			it("verified user => expect 200 & token & verified=true", async () => {
				// Register
				let hash = string.generate();
				let data = await registerUser(hash, hash, hash);
				let body = JSON.parse(data.text);
				let id = parseInt(body.token.substr(0, 10));

				// Verify
				await verifyUser(id, body.token, "validcode");

				// Login
				data = await loginUser(hash, hash);
				body = JSON.parse(data.text);

				// Delete
				await deleteUser(id, body.token);

				console.log(colors.cyan(JSON.stringify(data, null, 4)));

				expect(data.status).to.equal(200);
				// Token
				expect(body).to.have.property("token");
				expect(body.token).to.be.a("string");
				expect(body.token).to.match(/^.{46}$/);
				// Verified
				expect(body).to.have.property("verified");
				expect(body.verified).to.equal("true");
			}).timeout(5000);

			it("unverified user => expect 200 & token & verified=false", async () => {
				// Register
				let hash = string.generate();
				let data = await registerUser(hash, hash, hash);
				let body = JSON.parse(data.text);
				let id = parseInt(body.token.substr(0, 10));

				// Login
				data = await loginUser(hash, hash);
				body = JSON.parse(data.text);

				// Delete
				await deleteUser(id, body.token);

				expect(data.status).to.equal(200);
				// Token
				expect(body).to.have.property("token");
				expect(body.token).to.be.a("string");
				expect(body.token).to.match(/^.{46}$/);
				// Verified
				expect(body).to.have.property("verified");
				expect(body.verified).to.equal("false");
			}).timeout(5000);
		});

		describe("Invalid data", () => {
			it("invalid username => expect 404 & 'username'", async () => {
				let data = await loginUser(string.generate(), "autorizationTest");
				expect(data.status).to.equal(404);
				expect(JSON.parse(data.text)).to.equal("User not found.");
			});

			it("invalid password => expect 400 & 'password'", async () => {
				let data = await loginUser("autorizationTest", string.generate());
				expect(data.status).to.equal(403);
				expect(JSON.parse(data.text)).to.equal("Invalid username or password.");
			});
		});
	});

	// ----------------------------------------------------------------------------------------------
	// VALIDATION
	// ----------------------------------------------------------------------------------------------
	describe("POST /user/activation", () => {
		it("valid => expect 200", async () => {
			// Register
			let hash = string.generate();
			let data = await registerUser(hash, hash, hash);
			let body = JSON.parse(data.text);
			let id = parseInt(body.token.substr(0, 10));
			// Validate
			data = await verifyUser(id, body.token, "validcode");
			// Delete
			await deleteUser(id, body.token);

			expect(data.status).to.equal(200);
		});

		it("wrong code => expect 400, 'code'", async () => {
			// Register
			let hash = string.generate();
			let data = await registerUser(hash, hash, hash);
			let body = JSON.parse(data.text);
			let id = parseInt(body.token.substr(0, 10));
			// Validate
			data = await verifyUser(id, body.token, "invalidcode");
			// Delete
			await deleteUser(id, body.token);

			expect(data.status).to.equal(200);
			// expect(data.status).to.equal(400);
		});

		it("wrong id => expect 404, 'id'", async () => {
			// Register
			let hash = string.generate();
			let data = await registerUser(hash, hash, hash);
			let body = JSON.parse(data.text);
			let id = parseInt(body.token.substr(0, 10));
			// Validate
			data = await verifyUser(id + 1, body.token, "validcode");
			// Delete
			await deleteUser(id, body.token);

			expect(data.status).to.equal(404);
		});
	});

	// ----------------------------------------------------------------------------------------------
	// DELETE
	// ----------------------------------------------------------------------------------------------
	describe("DELETE /user", () => {
		it("valid => expect 200", async () => {
			// Register
			let hash = string.generate();
			let data = await registerUser(hash, hash, hash);
			let body = JSON.parse(data.text);
			let id = parseInt(body.token.substr(0, 10));
			// Delete
			data = await deleteUser(id, body.token);
			// console.log(colors.cyan(JSON.stringify(data, null, 4)));

			expect(data.status).to.equal(200);
		}).timeout(5000);

		it("invalid id => expect 404", async () => {
			// Register
			let hash = string.generate();
			let data = await registerUser(hash, hash, hash);
			let body = JSON.parse(data.text);
			let id = parseInt(body.token.substr(0, 10));

			// Try do delete
			data = await deleteUser(id + 1, body.token);
			// console.log(colors.cyan(JSON.stringify(data, null, 4)));

			// Delete
			await deleteUser(id, body.token);
			// console.log(colors.cyan(JSON.stringify(data, null, 4)));

			// Test "Try to delete"
			expect(data.status).to.equal(404);
		}).timeout(5000);
	});
});
