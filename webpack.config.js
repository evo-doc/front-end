"use strict";

//----------------------------------------------------------------------------------------------------------------------
// Constants
//----------------------------------------------------------------------------------------------------------------------
const plugin = {
			path    : require("path"),
			webpack : require("webpack"),
			html    : require("html-webpack-plugin"),
			clean   : require("clean-webpack-plugin")
		},
		paths  = {
			dest      : plugin.path.join(__dirname, "/app"),
			bootstrap : plugin.path.join(__dirname, "/src/bootstrap.js"),
			electron  : plugin.path.join(__dirname, "/electron.config.js")
		};


//----------------------------------------------------------------------------------------------------------------------
// Application Configuration
//----------------------------------------------------------------------------------------------------------------------
let application = {
	mode    : process.env.MODE,
	target  : "electron-main",
	entry   : {
		"bundle" : paths.bootstrap
	},
	module  : {
		rules : [
			// SCSS Styles
			{
				test : /\.scss$/,
				use  : [
					"style-loader",
					{
						loader  : "css-loader",
						options : {
							minimize  : {
								discardComments : {
									removeAll : process.env.MODE === "development"
								}
							},
							sourceMap : process.env.MODE === "development"
						}
					},
					"sass-loader",
					"import-glob-loader"
				]
			},

			// EJS Templates
			{
				test   : /\.ejs$/,
				loader : "ejs-loader"
			},

			// Images
			{
				test : /\.(png|svg|jpg|gif)$/,
				use  : [
					{
						loader  : "file-loader",
						options : {
							outputPath : "images"
						}
					}
				]
			}
		]
	},
	watch   : true,
	node    : {
		// Enable __dirname and __filename passing
		__dirname  : false,
		__filename : false
	},
	output  : {
		filename : "[name].[hash].js",
		path     : paths.dest
	},
	plugins : [
		// Remove directory
		new plugin.clean(["app"]),

		// Globally defined dependencies
		new plugin.webpack.ProvidePlugin({
			_ : "lodash"
		}),

		// Main page
		new plugin.html({
			title    : "EvoDoc",
			template : "./src/local/routes/default.ejs"
		})
	]
};

if (process.env.MODE === "development") {
	application.plugins.push(
		// JS Sourcemaps
		new plugin.webpack.SourceMapDevToolPlugin({
			filename : "[name].[hash].js.map"
		})
	);
}


//----------------------------------------------------------------------------------------------------------------------
// ElectronJS Configuration
//----------------------------------------------------------------------------------------------------------------------
let electron = {
	mode   : process.env.MODE,
	target : "electron-main",
	entry  : paths.electron,
	node   : {
		__dirname  : false,
		__filename : false
	},
	output : {
		filename : "app.js",
		path     : paths.dest
	}
};


//----------------------------------------------------------------------------------------------------------------------
// Export
//----------------------------------------------------------------------------------------------------------------------
module.exports = [electron, application];
