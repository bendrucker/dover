'use strict'

var extend = require('xtend')
var Struct = require('observ-struct')
var Observ = require('observ')
var Delegator = require('dom-delegator')
var mapValues = require('map-values')

module.exports = function State (state) {
  var copy = extend(state)
  var $channels = copy.channels

  if ($channels) {
    copy.channels = Observ(null)
  }

  var observable = Struct(copy)

  if ($channels) {
    observable.channels.set(channels($channels, observable))
  }

  return observable
}

function channels (fns, context) {
  fns = mapValues(fns, function createHandle (fn) {
    return Delegator.allocateHandle(fn.bind(null, context))
  })

  Object.defineProperty(fns, 'toJSON', {
    value: noop,
    writable: true,
    configurable: true,
    enumerable: false
  })

  return fns
}

function noop () {}
