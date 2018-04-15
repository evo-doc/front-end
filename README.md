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


### Components
Within pages may exist elements (components) that are used more than once,
but with different texts etc., e.g. buttons, tiles, even whole templates (e.g. error pages).
They are defined in `./src/local/components/**` and auto-loaded into all page classes.

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

Or as an argument of their main template:
```
TODO: Example
```


### Localization

The application supports multilanguage insterfaces.

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

```
<a href="#/route/page">  # good - parsed by Request class
<a href="#route/page">   # bad - redirects to nowhere
<a href="/route/page">   # bad - redirects to nowhere
<a href="route/page">    # bad - redirects to nowhere
```

### Global CSS
TODO: Documentation

### Testing
TODO: Documentation

## Core Modules
TODO: Documentation

### Logger

A logger is coded as a module based on `winston` package (`./src/core/modules/logger.module.js`). Logs have 5 levels, you can enable/disable them at `./src/config/app.config.js`.

```
log.error("Message");   // Critical errors
log.warn("Message");    // Warnings
log.info("Message");    // Information
log.debug("Message");   // Debug
log.trace("Message");   // Detailed
```


## Require modules
TODO: Documentation

## How to create .app/.exe/...
TODO: Documentation
