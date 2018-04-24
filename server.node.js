const http = require("http");
const port = 3001;

const server = http.createServer((request, response) => {
	console.log(request.url);
	console.log(request);
	// response.writeHead(404);
	let a = {
		data: "Hi"
	};
	// response.end("Hello Node.js Server!");
	response.end(JSON.stringify(a));
});

server.listen(port, err => {
	if (err) {
		return console.log("something bad happened", err);
	}

	console.log(`server is listening on ${port}`);
});
