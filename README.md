Vue Static webapp
=================

[![Maintenance](https://img.shields.io/badge/maintained%3F-yes-green.svg)](https://github.com/npulidom/vue-webapp/graphs/commit-activity)

Simple scaffolding project for building static SPA's with VueJs 2.

## Features

- ES6+ Modules (browserify + babelify transforms)
- Hot Module Reload (browserify-hmr, same as webpack)
- JS Linter: [eslint](http://eslint.org/)
- BrowserSync: [site](https://www.browsersync.io/)
- CSS Autoprefixer (postcss)
- Sourcemaps

## Dependencies

- NodeJs >= 6.x
- Npm >= 3.x

## Usage

Watch task
```
gulp watch
```

Build task
```
gulp build
```

Use `--env` option to set custom environment.  
This option will set `process.env.NODE_ENV` value.  
Default values: **development** (watch), **production** (build). Example:
```
gulp watch --env staging
```

## Vendors

### Javascript

- Html5shiv: [github](https://github.com/aFarkas/html5shiv)
- Lodash: [docs](https://lodash.com/docs)
- FastClick: [github](https://github.com/ftlabs/fastclick)
- jQuery 3: [site](https://jquery.com/)
- Vue 2: [site](https://vuejs.org/)
- Vue Router 2: [site](http://router.vuejs.org/)
- Vuex 2: [github](https://github.com/vuejs/vuex)

### Sass

- Family: [site](https://lukyvj.github.io/family.scss/)
- Breakpoints: [site](https://github.com/at-import/breakpoint)
- Material Design Colors: [github](https://github.com/themekit/sass-md-colors)
- Normalize: [site](https://necolas.github.io/normalize.css/)

### HTML

- Handlebars: [site](http://handlebarsjs.com/)
- Panini: [github](https://github.com/zurb/panini)
