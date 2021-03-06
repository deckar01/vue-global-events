/**
 * vue-global-events v1.0.2
 * (c) 2018 Damian Dulisz <damian.dulisz@gmail.com>
 * @license MIT
 */

'use strict';

var modifiersRE = /^[~!&]*/;
var nonEventNameCharsRE = /\W+/;
var names = {
  '!': 'capture',
  '~': 'once',
  '&': 'passive'
};

function extractEventOptions (eventDescriptor) {
  var ref = eventDescriptor.match(modifiersRE);
  var modifiers = ref[0];
  return modifiers.split('').reduce(function (options, modifier) {
    options[names[modifier]] = true;
    return options
  }, {})
}

var index = {
  name: 'GlobalEvents',
  props: {
    filter: {
      type: Function,
      default: function (e) { return true; }
    }
  },

  render: function (h) { return h(); },

  mounted: function mounted () {
    var this$1 = this;

    this._listeners = Object.create(null);
    Object.keys(this.$listeners).forEach(function (event) {
      var listener = this$1.$listeners[event];
      var handler = function (e) {
        this$1.filter(e, listener, event) && listener(e);
      };
      document.addEventListener(
        event.replace(nonEventNameCharsRE, ''),
        handler,
        extractEventOptions(event)
      );
      this$1._listeners[event] = handler;
    });
  },

  beforeDestroy: function beforeDestroy () {
    var this$1 = this;

    for (var event in this$1._listeners) {
      document.removeEventListener(
        event.replace(nonEventNameCharsRE, ''),
        this$1._listeners[event]
      );
    }
  }
};

module.exports = index;
