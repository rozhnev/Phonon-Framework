---
title: Dialog
---

## Introduction

[WIP]


## Dynamically Created Dialogs

By not using the `element` property, it will create a dialog's HTMLElement dynamically.
This is particularly useful if you want to set up a dialog without worrying about its HTML code.

### Simple dialog

```js
// es6
const Dialog = require('phonon/dist/js/components/dialog');

const dialog = new Dialog({
  title: 'Dialog title',
  message: 'Dialog body text goes here.',
});

// es5
const dialog = phonon.dialog({
  title: 'Dialog title',
  message: 'Dialog body text goes here.',
});

// jQuery support
const dialog = $().dialog({
  title: 'Dialog title',
  message: 'Dialog body text goes here.',
});
```

### Prompt dialog

```js
const prompt = phonon.prompt({
  title: 'Prompt title',
  message: 'Prompt body text goes here.',
})

prompt.show()

prompt.setInputValue() // only available with prompts
prompt.getInputValue() // only available with prompts
```

### Confirm dialog

```js
const confirm = phonon.confirm({
  title: 'Confirm title',
  message: 'Confirm body text goes here.',
})

confirm.show()
```

### Loader dialog

```js
const dialogLoader = phonon.dialogLoader({
  title: 'Loader title',
  message: 'Loader body text goes here.',
})

dialogLoader.show()
```

### Dialog with custom buttons

Each dialog type (normal, prompt, confirm and prompt) supports custom buttons.
Note that the event of the button **must be unique**.
The click event of a button will fire the associated callback automatically.

```js
const dialog = phonon.dialog({
  title: 'Dialog title',
  message: 'Dialog body text goes here.',
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
const dialog = phonon.dialog({
  title: 'Dialog title',
  message: 'Dialog body text goes here.',
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


## Custom Dialogs

Conversely, you can create your own dialog by specifying the `element` property.

```html
<!-- Button trigger dialog -->
<button class="btn btn-primary" data-toggle="dialog" data-target="#exampleDialog">Launch demo dialog</button>

<!-- Dialog -->
<div class="dialog" id="exampleDialog" tabindex="-1" role="dialog">
  <div class="dialog-inner" role="document">
    <div class="dialog-content">
      <div class="dialog-header">
        <h5 class="dialog-title">Dialog title</h5>
      </div>
      <div class="dialog-body">
        <p>Dialog body text goes here.</p>
      </div>
      <div class="dialog-footer">
        <div class="btn-group float-right" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-primary" data-dismiss="dialog">Close</button>
        </div>
      </div>
    </div>
  </div>
</div>
```

Then, you can work with it by using the correct `element` property.

```js
const dialog = phonon.dialog({
  element: '#exampleDialog'
});

dialog.show()

// jQuery support
const dialog = $('#exampleDialog').dialog();

dialog.show()
```

## Options

- title
- message
- cancelable
- cancelableKeyCodes [array] (by default, Enter and Escape are shortcuts to hide the dialog)

## Methods

### show()

Any dialog can be shown with JavaScript. For this, we call the `show()` method:

```js
dialog.show()
```


### hide()

Any dialog can be hidden with JavaScript, not only by clicking on its buttons. For this, we call the `hide()` method:

```js
dialog.hide()
```

### getInputValue()

It is possible to retrieve the text field value of any prompt type.

### setInputValue()

It is possible to set the text field value of any prompt type.

## Events

It may be useful to use the events that affect your dialog.
To do this, you can use object and DOM events.


|     Event Type     |     Description      |
|--------------------|----------------------|
|  show    |   This event fires immediately when the <code>show</code> instance method is called. If caused by a click, the clicked element is available as the <code>relatedTarget</code> property of the event.   |
|  shown   |  This event is fired when the dialog has been made visible to the user (will wait for CSS transitions to complete). If caused by a click, the clicked element is available as the <code>relatedTarget</code> property of the event.    |
|  hide    |    This event is fired immediately when the <code>hide</code> instance method has been called.   |
|  hidden  |   This event is fired when the dialog has finished being hidden from the user (will wait for CSS transitions to complete).    |


### Object Events

```js
phonon.dialog({
  title: 'Dialog title',
  message: 'Dialog body text goes here.',
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
document.querySelector('.dialog').addEventListener('show.ph.dialog', () => {
  console.log('It works!')
})

document.querySelector('.dialog').addEventListener('shown.ph.dialog', () => {
  console.log('It works!')
})

document.querySelector('.dialog').addEventListener('hide.ph.dialog', () => {
  console.log('It works!')
})

document.querySelector('.dialog').addEventListener('hidden.ph.dialog', () => {
  console.log('It works!')
})
```
