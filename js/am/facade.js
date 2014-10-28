am.start = (function(maestro, undefined) {
	"use strict";

	var ATTR = 'data-am',
		DEFAULT = 'default';

	return function() {
		[].forEach.call(document.querySelectorAll('[' + ATTR + ']'), function(element) {

			var states = {},
				triggers = {};

			[].forEach.call(element.attributes, function(attribute) {
				if (attribute.name.indexOf(ATTR) !== -1) {

					var state = attribute.name.replace(ATTR + '-', ''),
						input = attribute.value;

					if (state === ATTR) {
						state = DEFAULT;
					}

					states = parser.getStates(states, state, input)
					triggers = parser.getTriggers(triggers, state, input);
				}
			});

			Object.create(am.maestro).init({
			 	element: element,
			 	states: states,
			 	triggers: triggers
			});
		});
	}

})(am.maestro);