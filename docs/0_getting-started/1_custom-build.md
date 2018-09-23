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
const Alert = require('phonon/dist/components/alert');
const Modal = require('phonon/dist/components/modal');
const ModalPrompt = require('phonon/dist/components/modal/prompt');
const ModalConfirm = require('phonon/dist/components/modal/confirm');
const ModalLoader = require('phonon/dist/components/modal/loader');
const Notification = require('phonon/dist/components/notification');
const Collapse = require('phonon/dist/components/collapse');
const Accordion = require('phonon/dist/components/accordion');
const Tab = require('phonon/dist/components/tab');
const Progress = require('phonon/dist/components/progress');
const Loader = require('phonon/dist/components/loader');
const OffCanvas = require('phonon/dist/components/off-canvas');
const Selectbox = require('phonon/dist/components/selectbox');
const SelectboxSearch = require('phonon/dist/components/selectbox/search');
const Dropdown = require('phonon/dist/components/dropdown');
```
