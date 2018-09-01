---
title: Collapse
---

## Introduction

[WIP]

## Markup

```html
<p>
  <a class="btn btn-primary" data-toggle="collapse" href="#exampleCollapse" aria-expanded="false" aria-controls="exampleCollapse">
    Link with href
  </a>
  <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#exampleCollapse" aria-expanded="false" aria-controls="exampleCollapse">
    Button with data-target
  </button>
</p>

<div class="collapse" id="exampleCollapse">
  Collapse content.
</div>
```

## JavaScript

```js
const collapse = phonon.collapse({
  element: '#exampleCollapse',
});

// jQuery support
const collapse = $('#exampleCollapse').collapse();
```

### Options

The options can be passed in the constructor of this plugin.

|     Option     |     Description      |     Available as a data attribute      |
|----------------|----------------------|-------------------------|
|    toggle      |  toggles immediately once the collapse is initialized. | yes `data-toggle`


### Methods

#### show()

```js
collapse.show();
```

#### hide()

```js
collapse.hide();
```

#### toggle()

```js
collapse.toggle();
```

### Events

#### Object Events

```js
phonon.collapse({
  element: '#exampleCollapse',
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
document.querySelector('.collapse').addEventListener('show.ph.collapse', () => {
  console.log('It works!')
})

document.querySelector('.collapse').addEventListener('shown.ph.collapse', () => {
  console.log('It works!')
})

document.querySelector('.collapse').addEventListener('hide.ph.collapse', () => {
  console.log('It works!')
})

document.querySelector('.collapse').addEventListener('hidden.ph.collapse', () => {
  console.log('It works!')
})
```

