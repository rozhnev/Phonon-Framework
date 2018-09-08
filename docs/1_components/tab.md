---
title: Tab
---

## Introduction

[WIP]


## Markup

```html
<ul class="nav nav-tabs" id="myTab" role="tablist">
  <li class="nav-item">
    <a class="nav-link active" id="news-tab" data-toggle="tab" href="#news" role="tab" aria-controls="news" aria-selected="true">News</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" id="settings-tab" data-toggle="tab" href="#settings" role="tab" aria-controls="settings" aria-selected="false">Settings</a>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active" id="news" role="tabpanel" aria-labelledby="news-tab">News</div>
  <div class="tab-pane fade" id="settings" role="tabpanel" aria-labelledby="settings-tab">Settings</div>
</div>
```

<!-- fix for links -->
<script>document.querySelector('.page .nav-tabs').addEventListener('click', function (event) { event.preventDefault()});</script>


## JavaScript

```js
const tab = phonon.tab({
  element: '#settings-tab',
});

// jQuery support
const tab = $('#settings-tab').tab();
```

### Methods

#### show()

* returns: `<Promise<Boolean>>`

Any tab can be shown with JavaScript. For this, we call the `show()` method:

```js
tab.show();
```

#### hide()

* returns: `<Promise<Boolean>>`

Any tab can be hidden with JavaScript. For this, we call the `hide()` method:

```js
tab.hide();
```


## Events

@todo

