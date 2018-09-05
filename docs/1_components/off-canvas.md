---
title: offcanvas
---

## Introduction

[WIP]

## Markup

Add the class `offcanvas-left` if you want that the offcanvas appears from the left.
Add the class `offcanvas-right` if you want that the offcanvas appears from the right.

```html
<!-- Button trigger offcanvas -->
<button class="btn btn-primary" data-toggle="offcanvas" data-target="#exampleOffCanvas">Launch demo offcanvas</button>

<!-- offcanvas, left direction -->
<div class="offcanvas offcanvas-left" id="exampleOffCanvas" role="navigation" aria-hidden="true" aria-labelledby="exampleOffCanvasTitle">
  <div class="offcanvas-inner">
    <div class="offcanvas-content">
      <div class="offcanvas-header">
        <h1 class="offcanvas-title">Title</h1>
        <button type="button" class="close" data-dismiss="offcanvas" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="offcanvas-body">
        <p>Content</p>
      </div>
      <div class="offcanvas-footer">
        <p>Footer</p>
      </div>
    </div>
  </div>
</div>
```

## JavaScript

Note that you can add the class `offcanvas-aside` in the body element so that the correct view in CSS is already ready before the JavaScript API adds it.

```js
const offcanvas = phonon.offcanvas({
  element: '#exampleOffCanvas',
});

// jQuery support
const offcanvas = $('#exampleOffCanvas').offcanvas();
```

### Options

- aside

### Methods

#### show()

Any off canvas can be shown with JavaScript. For this, we call the `show()` method:

```js
offcanvas.show();
```


#### hide()

Any off canvas can be hidden with JavaScript, not only by clicking on its buttons. For this, we call the `hide()` method:

```js
offcanvas.hide();
```


### Events

It may be useful to use the events that affect your off-canvas.
For this, you can use object and DOM events.


|     Event Type     |     Description      |
|--------------------|----------------------|
|  show    |   This event fires immediately when the `show` instance method is called.   |
|  shown   |  This event is fired when the off-canvas is completely visible to the user (will wait for CSS transitions to complete).    |
|  hide    |    This event is fired immediately when the `hide` instance method is called.   |
|  hidden  |   This event is fired when the off-canvas is completely hidden (will wait for CSS transitions to complete).    |



#### Object Events

```js
phonon.offcanvas({
  element: '#exampleOffCanvas',
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

#### DOM Events

```js
document.querySelector('.offcanvas').addEventListener('show.ph.offcanvas', () => {
  console.log('It works!')
})

document.querySelector('.offcanvas').addEventListener('shown.ph.offcanvas', () => {
  console.log('It works!')
})

document.querySelector('.offcanvas').addEventListener('hide.ph.offcanvas', () => {
  console.log('It works!')
})

document.querySelector('.offcanvas').addEventListener('hidden.ph.offcanvas', () => {
  console.log('It works!')
})
```
