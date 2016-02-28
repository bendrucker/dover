'use strict'

var test = require('tape')
var Observ = require('observ')
var document = require('global/document')
var dispatchEvent = require('dispatch-event')
var Delegator = require('dom-delegator')
var Store = require('ev-store')
var clickEvent = require('value-event/click')
var State = require('./')

test('no channels', function (t) {
  var state = State({})
  t.notOk(state.channels)
  t.end()
})

test(function (t) {
  t.plan(4)

  // create a delegator
  Delegator()
  var state = State({
    clicked: Observ(false),
    channels: {
      click: function (_state_, data) {
        t.equal(_state_, state)
        t.ok(data.clicked)
        state.clicked.set(true)
      }
    }
  })

  t.equal(state().channels.click.type, 'dom-delegator-handle')

  // create an element
  var element = document.createElement('div')
  document.body.appendChild(element)

  // store our channel event on the element
  var store = Store(element)
  store.click = clickEvent(state().channels.click, {
    clicked: true
  })

  dispatchEvent(element, 'click')

  // state should be updated
  t.equal(state().clicked, true)
})

test('no overwrites via outer set', function (t) {
  var state = State({
    channels: {
      foo: function () {}
    }
  })

  var channels = state.channels()
  state.set({channels: {}})
  t.equal(state.channels(), channels, 'channels not overwritten by struct.set')

  t.end()
})

test('toJSON', function (t) {
  var state = State({
    foo: Observ('bar'),
    channels: {}
  })
  t.deepEqual(json(state()), {
    foo: 'bar'
  })
  t.end()
})

function json (data) {
  return JSON.parse(JSON.stringify(data))
}
