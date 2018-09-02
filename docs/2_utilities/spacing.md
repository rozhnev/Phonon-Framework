---
title: Spacing
---

## Introduction

[WIP]

`{property}{sides}-{size}`

Responsive `{property}{sides}-{breakpoint}-{size}` for `sm`, `md`, `lg`, and `xl`.

Sizes:

1 sets `0`
1 sets `$spacer * .25`
2 sets `$spacer * .5`
3 sets `$spacer * .75`
4 sets `$spacer`
auto sets margin or padding to `auto`

## Margin

The prefix `m-` defines a margin.

`mt-{size}` - sets margin-top of size `{size}`
`mb-{size}` - sets margin-bottom of size `{size}`
`ml-{size}` - sets margin-left of size `{size}`
`mr-{size}` - sets margin-right of size `{size}`
`mx-{size}` - sets both margin-left and margin-right of size `{size}`
`my-{size}` - sets both margin-top and margin-bottom of size `{size}`
`m-{size}` - sets margin in 4 directions of size `{size}`

Example:

```html
<div class="pt-2 pr-1 pb-1 pr-1"></div>

<div class="px-2 py-4"></div>
```

## Padding

The prefix `p-` defines a padding.

`pt-{size}` - sets padding-top of size `{size}`
`pb-{size}` - sets padding-bottom of size `{size}`
`pl-{size}` - sets padding-left of size `{size}`
`pr-{size}` - sets padding-right of size `{size}`
`px-{size}` - sets both padding-left and padding-right of size `{size}`
`py-{size}` - sets both padding-top and padding-bottom of size `{size}`
`p-{size}` - sets padding in 4 directions of size `{size}`

Example:

```html
<div class="mt-2 mr-1 mb-1 mr-1"></div>

<div class="mx-2 my-4"></div>
```

## Horizontal centering

```html
<div class="mx-auto" style="width: 200px;">
  Centered element
</div>
```