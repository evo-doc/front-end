"use strict";

//--------------------------------------------------------------------------------------------------
// Constants
//--------------------------------------------------------------------------------------------------
const plugin = {
		/**
		 * All required plugins for the webpack config.
		 */
		path: require("path"),
		webpack: require("webpack"),
		html: require("html-webpack-plugin"),
		clean: require("clean-webpack-plugin"),
		extract: require("extract-text-webpack-plugin")
	},
	modules = {
		/**
		 * Globally required modules & their variables.
		 * Instead of writing e.g.
		 * const log = require("logger.module");
		 * in each module.
		 */
		global: {
			_: "lodash",
			log: "logger.module",
			connect: "ajax.module",
			exception: "error.module"
		},
		/**
		 * All required modules via
		 * require("module");
		 * are searched in these directories (listed by a priority).
		 */
		search: ["node_modules", "src/config", "src/core/modules", "src/core", "src/local"]
	},
	paths = {
		dest: plugin.path.join(__dirname, "/app"),
		bootstrap: plugin.path.join(__dirname, "/src/bootstrap.js"),
		electron: plugin.path.join(__dirname, "/electron.config.js"),
		rootTpl: plugin.path.join(__dirname, "/src/local/routes/default/root.ejs"),
		clean: [plugin.path.join(__dirname, "/app")]
	};

//--------------------------------------------------------------------------------------------------
// Application Configuration
//--------------------------------------------------------------------------------------------------
let application = {
	mode: process.env.MODE,
	target: "electron-renderer",
	entry: {
		bundle: paths.bootstrap
	},
	/**
	 * Modules discribes what webpack should to do with non-javascript files.
	 */
	module: {
		rules: [
			// SCSS Styles
			{
				test: /\.scss$/,
				use: plugin.extract.extract({
					fallback: "style-loader",
					use: [
						{
							loader: "css-loader",
							options: {
								minimize: {
									discardComments: {
										removeAll: process.env.MODE === "development"
									}
								},
								sourceMap: process.env.MODE === "development"
							}
						},
						"sass-loader",
						"import-glob-loader"
					]
				})
			},

			// EJS Templates
			{
				test: /\.ejs$/,
				loader: "ejs-loader"
			},

			// Images
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					{
						loader: "file-loader",
						options: {
							outputPath: "images"
						}
					}
				]
			}
		]
	},
	node: {
		// Enable __dirname and __filename passing
		__dirname: false,
		__filename: false
	},
	output: {
		filename: "[name].[hash].js",
		path: paths.dest
	},
	resolve: {
		modules: modules.search
	},
	plugins:
		process.env.MODE === "development"
			? [
					// Remove app directory
					new plugin.clean(paths.clean),

					// Globally defined dependencies
					new plugin.webpack.ProvidePlugin(modules.global),

					// Extract CSS
					new plugin.extract({
						filename: "[name].[hash].css"
					}),

					// Main page
					new plugin.html({
						title: "EvoDoc",
						template: paths.rootTpl
					}),

					// JS Sourcemaps
					new plugin.webpack.SourceMapDevToolPlugin({
						filename: "[name].[hash].js.map"
					})
			  ]
			: [
					// Remove app directory
					new plugin.clean(paths.clean),

					// Extract CSS
					new plugin.extract({
						filename: "[name].[hash].css"
					}),

					// Globally defined dependencies
					new plugin.webpack.ProvidePlugin(modules.global),

					// Main page
					new plugin.html({
						title: "EvoDoc",
						template: paths.rootTpl
					})
			  ]
};

//--------------------------------------------------------------------------------------------------
// ElectronJS Configuration
//--------------------------------------------------------------------------------------------------
let electron = {
	mode: process.env.MODE,
	target: "electron-main",
	entry: paths.electron,
	node: {
		__dirname: false,
		__filename: false
	},
	output: {
		filename: "app.js",
		path: paths.dest
	}
};

//--------------------------------------------------------------------------------------------------
// Export
//--------------------------------------------------------------------------------------------------
module.exports = [electron, application];
