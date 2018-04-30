const chai = require("chai");
const { assert, expect } = chai;
chai.use(require("chai-http"));

module.exports = (config, interface, tools) => {
	describe("CONNECTION", () => {
		it("user is online", async () => {
			let res = await chai.request("https://google.com/").get("/");
			expect(res.status).to.equal(200);
		});

		it("server is online", async () => {
			let res = await chai.request(config.ajax.host).get("/");
			expect(res.status).to.equal(200);
		});
	});
};
