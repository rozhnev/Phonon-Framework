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

## JavaScript

```js
const tab = phonon.tab({
  element: '#settings-tab',
});

// jQuery support
const tab = $('#settings-tab').tab();
```

## Methods

### show

```js
tab.show();
```

### hide

```js
tab.hide();
```

## Events
