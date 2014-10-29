// Event helper from jsCore v0.6.1 github.com/Octane/jsCore
var events = (function() {

    function off(eventDetails) {
       eventDetails.eventTypes.forEach(function (eventType) {
           eventDetails.element.removeEventListener(
               eventType,
               eventDetails.callback
               );
       });
    }

    function on(element, selector, eventTypes, callback) {
       var listener;
       if (arguments.length == 3) {
           callback = eventTypes;
           eventTypes = selector;
           selector = undefined;
       }
       if (selector) {
           selector += ',' + selector + ' *';
           listener = function (event) {
               var target = event.target;
               if (target.matches && target.matches(selector)) {
                   if (callback.handleEvent) {
                       callback.handleEvent(event);
                   } else {
                       callback.call(element, event);
                   }
               }
           };
       } else {
           listener = callback;
       }
       if ('string' == typeof eventTypes) {
           eventTypes = eventTypes.split(/[\s,]+/);
       }
       eventTypes.forEach(function (eventType) {
           element.addEventListener(eventType, listener);
       });
       return {
           element: element,
           eventTypes: eventTypes,
           callback: listener
       };
    }

    function one(element, selector, eventTypes, callback) {
       var details;
       function listener(event) {
           off(details);
           if (callback.handleEvent) {
               callback.handleEvent(event);
           } else {
               callback.call(element, event);
           }
       }
       if (arguments.length == 3) {
           callback = eventTypes;
           eventTypes = selector;
           selector = undefined;
       }
       details = on(element, selector, eventTypes, listener);
    }

    return {
        one: one,
        on: on,
        off: off
    };

})();