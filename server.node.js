var http = require("http");
var url = require("url");

var server = http
	.createServer((req, res) => {
		console.log(request.url);
		var pathname = url.parse(req.url).pathname;
		switch (pathname) {
			case "/subpage":
				res.statusCode(200);
				res.end("subpage");
				break;
			default:
				res.end("default");
				break;
		}

		console.log(`Server is listening.`);
	})
	.listen(7000);
