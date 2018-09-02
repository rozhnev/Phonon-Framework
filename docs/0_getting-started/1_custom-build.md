---
title: Custom builds
---

Import the required files for your project.

## SCSS

Please, see the source code of [phonon.scss](https://github.com/quark-dev/Phonon-Framework/blob/master/src/scss/phonon.scss).

```scss
// instead of importing Phonon package
@import 'phonon/src/scss/phonon';

// import required components for your project
@import 'phonon/src/scss/phonon/notification';
@import 'phonon/src/scss/phonon/off-canvas';
@import 'phonon/src/scss/phonon/dropdown';
```

## JavaScript

```js
// instead of importing Phonon package
import 'phonon/dist/js/phonon'

// import required components for your project
const Dropdown = require('phonon/dist/js/components/dropdown');
```
