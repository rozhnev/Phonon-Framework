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

- toggle: toggles immediately once the collapse is initialized when called in JavaScript.

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
