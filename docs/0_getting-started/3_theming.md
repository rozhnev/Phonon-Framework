---
title: Theming
---

Phonon uses the heart of Bootstrap SCSS. We really like the notation.
As with Bootstrap 4, you can edit SCSS variables.

Example:

```scss
$blue:    #3271d1;
```

For this, create a file `custom.scss` and import it before the Phonon SCSS file.

```scss
@import 'path/to/custom.scss'; // my custom SCSS
@import 'phonon/src/scss/phonon.scss';
```

When you run the build command `node ./build/css.js`, the CSS output will take into account your new values.
