# EvoDoc / Front End

[![Build Status](https://travis-ci.org/evo-doc/front-end.svg?branch=master)](https://travis-ci.org/evo-doc/front-end)
[![GitHub issues](https://img.shields.io/github/issues/evo-doc/front-end.svg)](https://github.com/evo-doc/front-end/issues)

## Getting started

```
# Try the app immediately (install dependencies, bundle, run)
yarn && yarn prod && yarn app

# Сommands
yarn        # install yarn dependencies
yarn app    # run application
yarn dev    # bundle development version and watch files
yarn prod   # bundle production version
yarn tests  # run tests
yarn docs   # generate a documentation from js files
```

## Code style

### JavaScript
Project is optimised for [ECMAScript 6](http://es6-features.org/).
Don't use old versions of ajax requests (XMLHttpRequest), prototype declarations etc.

```
xxx.class.js    # module exports one class
xxx.module.js   # module exports some kind of interface
```

## Documentation

```
yarn docs
```

JavaScript files are documented according to [JSDoc](http://usejsdoc.org/).
The destination folder is `./docs/`. A configuration file is `./jsdoc.config.json`.

How to write [annotations](http://usejsdoc.org/tags-type.html).

## Structure
```
.
├── app                     # bundled source codes (yarn dev/prod)
├── docs                    # generated documentation (yarn docs)
├── log                     # log files
│   ├── *.json.log          # log files in JSON
│   ├── *.txt.log           # readable log files for developers
├── src                     # electron renderer process sources (see electron docs)
│   ├── config              # all app config files
│   ├── core                # app core (contains logic, requires data from ./local/)
│   │   ├── modules               # javascript modules (may be required as global via webpack)
│   │   ├── application.class.js  # main app core file
│   │   └── *.class.js            # secondary app core files
│   ├── local               # app data files (templates, styles, etc.)
│   │   ├── components      # components (see README.md -> Components)
│   │   ├── localization    # localization json files (see README.md -> Localization)
│   │   ├── resources       # global images, fonts etc.
│   │   ├── routes          # routes (see README.md -> Routes)
│   │   ├── styles          # global styles  (see README.md -> Global CSS)
│   │   ├── localization.js # loads all localization json files (see README.md -> Localization)
│   │   └── pages.js        # loads all pages & defines route patterns
│   └── bootstrap.js        # inits the whole app
├── test                    # tests directory (see README.md -> Testing)
├── tmp                     # temporary files (created by the app or a user)
├── .editorconfig           # code style (see editorconfig.org)
├── .gitignore
├── .prettierignore         # code style
├── .travis.yml
├── LICENSE.md
├── README.md
├── electron.config.js      # electron main process config (see electron docs)
├── jsdoc.config.json
├── package.json
├── webpack.config.js
└── yarn.lock
```

### How to create a new page

When creating a new page, we add a folder with corresponding name to `./src/local/routes/**`. We then add the `index.js` file ,the page controller, to the page folder. Page controller may require some additional files, such as `index.ejs` file - template of the page,  `index.scss` - stylesheets of the page and also various folders, such as `images` folder containing images used in the page, `ejs` folder containing additional templates and `scss` folder containing additional stylesheets that are required in `index.scss`.

### CSS Structure
Project uses [Sass](https://sass-lang.com/guide) preprocessor, which adds special features such as variables, nested rules, inline imports and mixins into CSS.

Global styles used within the whole project are placed in styles folder and divided into several sections: mixins, parts and ui elements.
Global styles also include `_variables.scss` with global variables,`_palette.scss` with color variables and `main.scss` file, which collects all global style sheets: global UI elements, parts, variables, palette, mixins and libraries.

Styles which relate only to a certain page or component are placed in the same folder with them and connected via `index.js` for pages and `components.js` for components.

For naming classes we use the [BEM](http://getbem.com/naming/) (Block, Element, Modifier) naming convention.
Each block is placed into its own folder and imported by a corresponding file.
Each blocks folder contains files with its elements and may also contain folders with new blocks.

### Components
Within pages may exist elements (components) that are used more than once, but with different texts etc., e.g. buttons, tiles, even whole templates (e.g. error pages). They are defined in `./src/local/components/**` and auto-loaded into all page classes.

`components.js` assumes the existence of `index.ejs` file(s), the name of their parent folder will be used as a unique id of the component and as a part of the exported interaface.

All index.scss files are required recursively.

Example of `tileNewsletter` component:
 ```
 .
 └── tileNewsletter       # unique id
     ├── images           # optional images, required in scss files
     ├── scss             # optional styles, required in index.scss
     ├── index.ejs        # compulsory template file, is required by components.js
     └── index.scss       # optional scss file, is required by components.js

```

Pages may use this component in their renderer process as:
```
this._getRoot().innerHTML += this.getComponent().tileNewsletter({
	_lang: this._getLocalization(),
	_data: {
		optionalVariable : "value"
	}
});
```

Or as an argument of their main template, see [webpack ejs-loader](https://github.com/okonet/ejs-loader).


### Localization

The application supports multilanguage interfaces.

```
./src/config/app.config.json      # constains settings (default language etc)
./src/core/localization.class.js  # main localization class
./src/local/localization/??.json  # all language data files
./src/local/localization.js       # requires language data files
```

Each language should have its own .json file and be explicitly required in the localization module (`localization.js`). Each phrase has a `namespace` and a `key`. This pairs should be unique per language file.

### Routes
All routes (pages) are accepted by patterns, which are formed with paths and params. Paths are static, params are variable and not empty. E.g. a pattern `/package/:id` could accept routes `/package/e564wi` or `/package/3245rtfde454e`, but not `/package/`.

A pattern may look like `/path/path/:param/path/:param/path`. It means if we request `/path/path/2/path/4/path`, the router finds our pattern, gets all parameters `[2, 4]` and sends them to the page renderer process.

Links:

```html
<a href="#/route/page">  # good - parsed by Request class
<a href="#route/page">   # bad - redirects to nowhere
<a href="/route/page">   # bad - redirects to nowhere
<a href="route/page">    # bad - redirects to nowhere
```

### Modules
Modules (`./src/core/modules`) are classes or interfaces that could be required manually via
```js
const module = require("name.module");
```
or automatically via `webpack.config.js` file (may cause conflict of global variables).

#### Logger
A logger is coded as a module based on `winston` package (`./src/core/modules/app.logger.module.js`). Logs have 5 levels, you can enable/disable them at `./src/config/app.config.js`.

```js
log.error("Message");   // Critical errors
log.warn("Message");    // Warnings
log.info("Message");    // Information
log.debug("Message");   // Debug
log.trace("Message");   // Detailed
```

### Testing
```shell
yarn test     # run all tests
yarn test:app # run only app tests
yarn test:api # run only API tests
```
[Mocha](https://mochajs.org) is used as an environment and [chai](http://www.chaijs.com) as an assertion library. Tests have their own folder (`./test`). First level tests `./test/*.test.js` are run automatically. They could run other test modules in subfolders.

## How to create .app/.exe/...
See [electron-packager](https://github.com/electron-userland/electron-packager) and [electron-builder](https://github.com/electron-userland/electron-builder).


