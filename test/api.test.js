var colors = require("colors");
const config = require("../src/config/app.config");
const chai = require("chai");
const http = require("chai-http");

const { assert, expect } = chai;
chai.use(http);

// console.log(colors.cyan(JSON.stringify(res, null, 3)));

describe("Server is online", () => {
	it("should return 200", done => {
		chai
			.request(config.ajax.host)
			.get("/")
			.end((err, res) => {
				expect(res.status).to.equal(200);
				done();
			});
	});
});

describe("POST /login", () => {
	describe("Valid data", () => {});

	describe("Invalid data", () => {
		it("invalid login", done => {
			chai
				.request(config.ajax.host)
				.post("/login")
				.send({
					username: "!@#1",
					password: "user1"
				})
				.end((err, res) => {
					expect(res.status).to.equal(404);
					done();
				});
		});
	});
});
