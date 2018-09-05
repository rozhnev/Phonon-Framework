---
title: Loader
---

## Introduction

A loader is typically used to show an animation while loading.

## Markup

```html
<div class="loader">
  <div class="loader-spinner"></div>
</div>

<div class="loader">
  <div class="loader-spinner color-primary"></div>
</div>

<div class="loader">
  <div class="loader-spinner color-secondary"></div>
</div>

<div class="loader">
  <div class="loader-spinner color-success"></div>
</div>

<div class="loader">
  <div class="loader-spinner color-danger"></div>
</div>

<div class="loader">
  <div class="loader-spinner color-warning"></div>
</div>

<div class="loader">
  <div class="loader-spinner color-info"></div>
</div>

<div class="loader">
  <div class="loader-spinner color-light"></div>
</div>

<div class="loader">
  <div class="loader-spinner color-dark"></div>
</div>
```

it may be useful not to show the loader, but after a while. For this, we add the `hide` class.

```html
<div class="loader hide">
  <div class="loader-spinner"></div>
</div>
```

## JavaScript

```js
const loader = phonon.loader({
  element: '.loader',
  color: null,
  size: null,
});

// jQuery support
const loader = $('.loader').loader();
```

### Options

* `color` (String) - the color of the spinner.
* `size` (Number) - the size of the spinner in pixel.

## Methods

### animate(startAnimation)

* `startAnimation` (Boolean) - if `startAnimation` is set to true, it will start the animation directly. Otherwise, it won't start the animation. The default value is true.

This method will animate the loader.
In most cases, it is preferable to use this method to display and hide the loader. If the passed argument is true, it will display the loader and start the animation. Conversely, false will hide and finish the animation.

```js
loader.animate(); // show and start the animation
loader.animate(false); // hide and stop the animation
```

### show()

* returns: `<Promise<Boolean>>`

Any loader can be shown with JavaScript. For this, we call the `show()` method:

```js
loader.show();
```

### hide()

* returns: `<Promise<Boolean>>`

Any loader can be hidden with JavaScript. For this, we call the `hide()` method:

```js
loader.hide();
```

## Events

It may be useful to use the events that affect your loader.
For this, you can use object and DOM events.


|     Event Type     |     Description      |
|--------------------|----------------------|
|  show    |   This event fires immediately when the `show` instance method is called.   |
|  shown   |  This event is fired when the loader is completely visible to the user (will wait for CSS transitions to complete).    |
|  hide    |    This event is fired immediately when the `hide` instance method is called.   |
|  hidden  |   This event is fired when the loader is completely hidden (will wait for CSS transitions to complete).    |

