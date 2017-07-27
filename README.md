Vue Static webapp
=================

[![GitHub version](https://badge.fury.io/gh/npulidom%2Fvue-webapp.svg)](https://badge.fury.io/gh/npulidom%2Fvue-webapp)

Scaffolding project for building static SPA's with VueJs 2.

## Features

- ES6 Modules (browserify + babelify)
- Hot Module Reload (browserify-hmr)
- JS Linter: [eslint](http://eslint.org/)
- BrowserSync: [site](https://www.browsersync.io/)
- CSS Autoprefixer (postcss)
- Sourcemaps

## Dependencies

- NodeJs >= 4.x
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
- Bluebird (promises): [github](https://github.com/petkaantonov/bluebird)
- FastClick: [github](https://github.com/ftlabs/fastclick)
- jQuery 3: [site](https://jquery.com/)
- Js Cookie: [github](https://github.com/js-cookie/js-cookie)
- Vue 2: [site](https://vuejs.org/)
- Vue Router 2: [site](http://router.vuejs.org/)
- Vuex 2: [github](https://github.com/vuejs/vuex)
- Velocity Animation Engine: [site](https://julian.com/)

### Sass

- Bourbon: [docs](http://bourbon.io/docs/)
- Family: [site](https://lukyvj.github.io/family.scss/)
- Breakpoints: [site](https://github.com/at-import/breakpoint)
- Material Design Colors: [github](https://github.com/themekit/sass-md-colors)
- Basscss: [site](http://www.basscss.com/)
- Normalize: [site](https://necolas.github.io/normalize.css/)
- Font Awesome: [site](http://fontawesome.io/)

### HTML

- Handlebars: [site](http://handlebarsjs.com/)
- Panini: [github](https://github.com/zurb/panini)
