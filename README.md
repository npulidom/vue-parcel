Static WebApp project
=======================

Simple scaffolding project for building static webapps with gulp.

## Javascript

- Html5shiv:  [github](https://github.com/aFarkas/html5shiv)
- Lodash:  [docs](https://lodash.com/docs)
- Bluebird (promises):  [github](https://github.com/petkaantonov/bluebird)
- FastClick:  [github](https://github.com/ftlabs/fastclick)
- jQuery:  [site](https://jquery.com/)
- Js Cookie:  [github](https://github.com/js-cookie/js-cookie)
- Vue:  [site](https://vuejs.org/)
- Velocity + UI (animations):  [site](https://julian.com/)

## Sass

- Bourbon:  [docs](http://bourbon.io/docs/)
- Family:  [site](https://lukyvj.github.io/family.scss/)
- Foundation:  [docs](http://foundation.zurb.com/sites/docs/)
- Motion-UI:  [docs](http://foundation.zurb.com/sites/docs/motion-ui.html)
- Hover CSS:  [github](http://ianlunn.github.io/Hover/)
- Font Awesome:  [site](http://fontawesome.io/)

## HTML Template

- Handlebars: [site](http://handlebarsjs.com/)
- Panini: [github](https://github.com/zurb/panini)

## Features

- JS Modules (browserify)
- ES6 Support (babelify)
- JS Linter: [eslint](http://eslint.org/)
- BrowserSync: [site](https://www.browsersync.io/)
- Sourcemaps
- Simple bash CLI `app.bash`

## Dependencies

- NodeJs 4 or greater.
- Npm 3 or greater.
- Npm global packages: **gulp**, **npm-check**.
- Ubuntu or OSX.

## Usage

Run bash app.bash to see commands (consider an alias)
```
bash app.bash
```

Install global dependencies
```
bash app.bash npm-global
```

Install/update project dependencies
```
bash app.bash npm
```

Library updater with `npm-check`
```
bash app.bash npm -u
```

Watch **scss**, **js** or **hbs** files (gulp watch)
```
bash app.bash watch
```

Build app for distribution (gulp build)
```
bash app.bash build
```
