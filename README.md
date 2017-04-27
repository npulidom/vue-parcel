Vue Static webapp
=================

[![GitHub version](https://badge.fury.io/gh/npulidom%2Fvue-webapp.svg)](https://badge.fury.io/gh/npulidom%2Fvue-webapp)

Simple scaffolding project for building static SPA's with Vue Js.

## Javascript

- Html5shiv: [github](https://github.com/aFarkas/html5shiv)
- Lodash: [docs](https://lodash.com/docs)
- Bluebird (promises): [github](https://github.com/petkaantonov/bluebird)
- FastClick: [github](https://github.com/ftlabs/fastclick)
- jQuery 3: [site](https://jquery.com/)
- Js Cookie: [github](https://github.com/js-cookie/js-cookie)
- Vue 2: [site](https://vuejs.org/)
- Vue Router 2: [site](http://router.vuejs.org/)
- Vuex 2: [github](https://github.com/vuejs/vuex)
- Velocity Animation Engine: [site](https://julian.com/)

## Sass

- Bourbon: [docs](http://bourbon.io/docs/)
- Family: [site](https://lukyvj.github.io/family.scss/)
- Breakpoints: [site](https://github.com/at-import/breakpoint)
- Material Design Colors: [github](https://github.com/themekit/sass-md-colors)
- Basscss: [site](http://www.basscss.com/)
- Normalize: [site](https://necolas.github.io/normalize.css/)
- Font Awesome: [site](http://fontawesome.io/)

## HTML Template

- Handlebars: [site](http://handlebarsjs.com/)
- Panini: [github](https://github.com/zurb/panini)

## Features

- ES6 Support (babelify)
- JS Modules (browserify)
- Hot Module Reload (browserify-hmr)
- JS Linter: [eslint](http://eslint.org/)
- BrowserSync: [site](https://www.browsersync.io/)
- Sourcemaps

## Dependencies

- NodeJs >= 4.
- Npm >= 3.
- Npm global packages: **gulp**, **npm-check**.

## Usage

Initial setup, installs global & local npm dependencies (first time only).
```
npm run setup
```

Check for npm dependencies updates.
```
npm run update
```

Watch **scss**, **js** or **hbs** files (gulp watch)
```
npm run watch
```

Build app for distribution (gulp build)
```
npm run build
```

Clean distribution folder
```
npm run clean
```
