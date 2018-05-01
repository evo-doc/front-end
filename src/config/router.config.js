module.exports = {
	authFreePages: [
		// Sign In, Sign Up, ...
		/^\/authorization\/.+/,
		// Error pages
		/^\/error\/\d{3}/
	]
};
