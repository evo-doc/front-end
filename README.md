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

### File naming

```
xxx.class.js    # module exports one class
xxx.module.js   # module exports some kind of interface
```

## Logger

A logger is coded as a module based on `winston` package (`./src/core/modules/logger.module.js`). Logs have 5 levels, you can enable/disable them at `./src/config/app.config.js`.

```
log.error("Message");   // Critical errors
log.warn("Message");    // Warnings
log.info("Message");    // Information
log.debug("Message");   // Debug
log.trace("Message");   // Detailed
```

## Routes

All routes (pages) are accepted by patterns, which are formed with paths and params. Paths are static, params are variable and not empty. E.g. a pattern `/package/:id` could accept routes `/package/e564wi` or `/package/3245rtfde454e`, but not `/package/`.

A pattern may look like `/path/path/:param/path/:param/path`. It means if we request `/path/path/2/path/4/path`, the router finds our pattern, gets all parameters (`2`, `4`) and sends them to the page renderer process.

Links:

```
<a href="#/route/page">  # good - parsed by Request class
<a href="#route/page">   # bad - redirects to nowhere
<a href="/route/page">   # bad - redirects to nowhere
<a href="route/page">    # bad - redirects to nowhere
```

## Documentation

```
yarn docs
```

JavaScript files are documented according to [JSDoc](http://usejsdoc.org/). The destination folder is `./docs/`. The whole configuration file is `./jsdoc.config.json`.

### How to write [annotations](http://usejsdoc.org/tags-type.html)

**Variable types**

*  Simple type: `{boolean}`, `{string}`, `{number}`, `{object}`, `{promise}`
*  More types: `{(string|number)}`
*  Class instances: `{MyClass}`
*  Arrays: `{MyClass[]}`
*  Object with string keys and number values: `{Object.<string, number>}`

**Parameters**

*  Variable params: `{...args}`
*  Optional params with default value: `{number} [name=default]`

#### Class

## Structure

## Languages

The application supports multilanguage insterfaces.

```
./src/config/app.config.json      # constains settings (default language etc)
./src/core/localization.class.js  # main localization class
./src/local/localization/??.json  # all language data files
./src/local/localization.js       # requires language data files
```

Each language should have its own .json file and be explicitly required in the localization module (`localization.js`). Each phrase has a `namespace` and a `key`. This pairs should be unique per language file.

## Require modules

## How to create .app/.exe/...
