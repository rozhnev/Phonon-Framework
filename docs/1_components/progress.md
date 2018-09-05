---
title: Progress
---

## Introduction

[WIP]

## Markup

```html
<div class="progress" id="myProgress">
  <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
</div>
```

You can specify the height of the progress in HTML if you don't want to use JavaScript:

```html
<div class="progress" id="myProgress" style="height: 8px">
  <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
</div>
```

## JavaScript

```js
const progress = phonon.progress({
  element: '#myProgress',
  height: 5,
  min: 0,
  max: 100,
  label: false,
  striped: false,
  background: null,
});

// jQuery support
$('#myProgress').progress({
  height: 5,
  min: 0,
  max: 100,
  label: false,
  striped: false,
  background: null,
});
```

## Options

- height
- min
- max
- label
- striped
- background

## Methods

### set(value: int)

* returns: `<undefined>`

Updates the current value of the progress bar.

### animate(startAnimation: boolean)

* returns: `<undefined>`

Animates the striped progress. The `striped` option must be true otherwise it won't work.

### show()

* returns: `<Promise<Boolean>>`

Any progress can be shown with JavaScript. For this, we call the `show()` method:

```js
progress.show()
```

### hide()

* returns: `<Promise<Boolean>>`

Any progress can be hidden with JavaScript. For this, we call the `hide()` method:

```js
progress.hide()
```

## Events

It may be useful to use the events that affect your progress.
For this, you can use object and DOM events.


|     Event Type     |     Description      |
|--------------------|----------------------|
|  show    |   This event fires immediately when the `show` instance method is called.   |
|  shown   |  This event is fired when the progress is completely visible to the user (will wait for CSS transitions to complete).    |
|  hide    |    This event is fired immediately when the `hide` instance method is called.   |
|  hidden  |   This event is fired when the progress is completely hidden (will wait for CSS transitions to complete).    |


### Object Events

```js
phonon.progress({
  element: '#exampleProgress',
  show: () => { // or onShow
    console.log('It works!')
  },
  shown: () => { // or onShown
    console.log('It works!')
  },
  hide: () => { // or onHide
    console.log('It works!')
  },
  hidden: () => { // or onHidden
    console.log('It works!')
  }
})
```

### DOM Events

```js
document.querySelector('.progress').addEventListener('show.ph.progress', () => {
  console.log('It works!')
})

document.querySelector('.progress').addEventListener('shown.ph.progress', () => {
  console.log('It works!')
})

document.querySelector('.progress').addEventListener('hide.ph.progress', () => {
  console.log('It works!')
})

document.querySelector('.progress').addEventListener('hidden.ph.progress', () => {
  console.log('It works!')
})
```
