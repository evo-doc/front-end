const http = require("http");
const port = 3000;

const server = http.createServer((request, response) => {
	console.log(request.url);
	console.log(request);
	response.writeHead(404);
	response.end("Hello Node.js Server!");
});

server.listen(port, err => {
	if (err) {
		return console.log("something bad happened", err);
	}

	console.log(`server is listening on ${port}`);
});
