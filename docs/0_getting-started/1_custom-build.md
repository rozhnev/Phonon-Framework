---
title: Custom builds
---

Import the required files for your project.

## Dist Structure

`phonon.js` is a bundle containing the entire framework as a whole (components and single-page apps modules).

In `components/`, you can import the required components that you want to use in ES6.

```
dist/js/phonon.js
dist/js/phonon.min.js
dist/js/components/accordion.js
dist/js/components/accordion.min.js
dist/js/components/alert.js
dist/js/components/alert.min.js
...

dist/css/phonon.css
dist/css/phonon.min.css
```

## SCSS

Please, see the source code of [phonon.scss](https://github.com/quark-dev/Phonon-Framework/blob/master/src/scss/phonon.scss).

```scss
// instead of importing Phonon package
@import 'phonon/src/scss/phonon';

// import required components for your project
@import 'phonon/src/scss/phonon/notification';
@import 'phonon/src/scss/phonon/off-canvas';
@import 'phonon/src/scss/phonon/selectbox';
```

## JavaScript

```js
// instead of importing Phonon package
import 'phonon/dist/js/phonon'

// import required components for your project
const Selectbox = require('phonon/dist/js/components/selectbox');
```
