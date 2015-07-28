# dover [![Build Status](https://travis-ci.org/bendrucker/dover.svg?branch=master)](https://travis-ci.org/bendrucker/dover)

> Immutable state objects with event channels, inspired by [Mercury](https://github.com/raynos/mercury)

## Install

```
$ npm install --save dover
```

## Usage

Dover uses [observ-struct](https://github.com/raynos/observ-struct) to manage data, adding a special case for `channels`. Channels are event-handling functions that are bound to the immutable created by observ-struct. All state mutations that flow from UI events can *only* flow through channels.

```js
var State = require('dover')
var Observ = require('observ')
var h = require('virtual-dom/h')

function Component (data) {
  data = data || {}
  return State({
    title: Observ(data.title || 'My Great Post'),
    selected: Observ(data.selected || false),
    channels: {
      toggle: toggle
    }  
  })
}

function toggle (state) {
  state.selected.set(!state.selected())
}

Component.render = function (state) {
  var text = state.title
  if (state.selected) text += ' (Selected)'
  return h('h1', {onclick: state.channels.toggle}, text)
}

var component = Component()
// re-render any time data changes
component(Component.render)
// perform our initial render
Component.render(component())
```

In the above example, we bind the click event to `toggle`, but can never directly call it from `Component.render`. Dover binds `toggle` to the immutable state internally and ensures that `state.channels.toggle` is no longer a function, but a reference to the internal function inside the [DOM event delegation system](https://github.com/raynos/dom-delegator).

If we try to call `toggle` directly from within `Component.render`, we'll see an error because `state.selected` is a plain value, not an observable with a `set` method as it is inside our `Component` constructor.

## API

#### `State(state)` -> `function`

##### state

*Required*  
Type: `object`

The state object to be converted into an observable struct. This state object is identical to the one provided to [observ-struct](https://github.com/raynos/observ-struct), but performs delegation/state binding as described in **Usage** on the optional `channels` property.

## License

MIT © [Ben Drucker](http://bendrucker.me)
