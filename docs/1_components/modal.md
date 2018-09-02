---
title: Modal
---

## Introduction

[WIP]


## Dynamically created modals

By not using the `element` property, it will create a modal's HTMLElement dynamically.
This is particularly useful if you want to set up a modal without worrying about its HTML code.

### Simple modal

```js
// es6
const Modal = require('phonon/dist/js/components/modal');

const modal = new Modal({
  title: 'Modal title',
  message: 'Modal body text goes here.',
});

// es5
const modal = phonon.modal({
  title: 'Modal title',
  message: 'Modal body text goes here.',
});

// jQuery support
const modal = $().modal({
  title: 'Modal title',
  message: 'Modal body text goes here.',
});
```

### Prompt modal

```js
const prompt = phonon.prompt({
  title: 'Prompt title',
  message: 'Prompt body text goes here.',
})

prompt.show()

prompt.setInputValue() // only available with prompts
prompt.getInputValue() // only available with prompts
```

### Confirm modal

```js
const confirm = phonon.confirm({
  title: 'Confirm title',
  message: 'Confirm body text goes here.',
})

confirm.show()
```

### Loader modal

```js
const modalLoader = phonon.modalLoader({
  title: 'Loader title',
  message: 'Loader body text goes here.',
})

modalLoader.show()
```

### Modal with custom buttons

Each modal type (normal, prompt, confirm and prompt) supports custom buttons.
Note that the event of the button **must be unique**.
The click event of a button will fire the associated callback automatically.

```js
const modal = phonon.modal({
  title: 'Modal title',
  message: 'Modal body text goes here.',
  buttons: [
    {
      event: 'cancel',
      text: 'Cancel',
      dismiss: true,
      class: 'btn btn-secondary',
    },
    {
      event: 'confirm',
      text: 'Ok',
      dismiss: true,
      class: 'btn btn-primary',
    },
  ],
  onCancel: () => { // or cancel
    console.log('Cancel')
  },
  onConfirm: () => { // or confirm
    console.log('Confirm')
  }
})
```

You can also define your own event names.
In the following example, we trigger the event called `neutralAnswer` when we click on the button.

```js
const modal = phonon.modal({
  title: 'Modal title',
  message: 'Modal body text goes here.',
  buttons: [
    {
      event: 'neutralAnswer',
      text: 'Custom button',
      dismiss: true,
      class: 'btn btn-primary',
    }
  ],
  neutralAnswer: () => { // or onNeutralAnswer
    console.log('Well we close it!')
  }
})
```


## Custom modals

Conversely, you can create your own modal by specifying the `element` property.

```html
<!-- Button trigger modal -->
<button class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Launch demo modal</button>

<!-- Modal -->
<div class="modal" id="exampleModal" tabindex="-1" role="modal">
  <div class="modal-inner" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal title</h5>
      </div>
      <div class="modal-body">
        <p>Modal body text goes here.</p>
      </div>
      <div class="modal-footer">
        <div class="btn-group float-right" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

Then, you can work with it by using the correct `element` property.

```js
const modal = phonon.modal({
  element: '#exampleModal'
});

modal.show()

// jQuery support
const modal = $('#exampleModal').modal();

modal.show()
```

## Options

- title
- message
- cancelable
- cancelableKeyCodes [array] (by default, Enter and Escape are shortcuts to hide the modal)

## Methods

### show()

Any modal can be shown with JavaScript. For this, we call the `show()` method:

```js
modal.show()
```


### hide()

Any modal can be hidden with JavaScript, not only by clicking on its buttons. For this, we call the `hide()` method:

```js
modal.hide()
```

### getInputValue()

It is possible to retrieve the text field value of any prompt type.

### setInputValue()

It is possible to set the text field value of any prompt type.

## Events

It may be useful to use the events that affect your modal.
To do this, you can use object and DOM events.


|     Event Type     |     Description      |
|--------------------|----------------------|
|  show    |   This event fires immediately when the <code>show</code> instance method is called. If caused by a click, the clicked element is available as the <code>relatedTarget</code> property of the event.   |
|  shown   |  This event is fired when the modal has been made visible to the user (will wait for CSS transitions to complete). If caused by a click, the clicked element is available as the <code>relatedTarget</code> property of the event.    |
|  hide    |    This event is fired immediately when the <code>hide</code> instance method has been called.   |
|  hidden  |   This event is fired when the modal has finished being hidden from the user (will wait for CSS transitions to complete).    |


### Object Events

```js
phonon.modal({
  title: 'Modal title',
  message: 'Modal body text goes here.',
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
document.querySelector('.modal').addEventListener('show.ph.modal', () => {
  console.log('It works!')
})

document.querySelector('.modal').addEventListener('shown.ph.modal', () => {
  console.log('It works!')
})

document.querySelector('.modal').addEventListener('hide.ph.modal', () => {
  console.log('It works!')
})

document.querySelector('.modal').addEventListener('hidden.ph.modal', () => {
  console.log('It works!')
})
```