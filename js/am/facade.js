am.start = (function(maestro, viewport, undefined) {
	"use strict";

	var ATTR = 'data-am',
		DEFAULT = 'default',
		sequencers = [],
		enterLeave;

	function enterLeaveFn() {
		if (enterLeave) {
			clearTimeout(enterLeave);
		}

		enterLeave = setTimeout(function() {
			enterLeave = null;

			(function () {
				sequencers.forEach(function(s) {
					if (s.states.enter || s.states.leave) {
						if (viewport.isInside(s.element)) {
							s.changeState('enter');
						} else {
							s.changeState('leave');
						}
					}
				});
			})();

		}, 10);	
	}

	events.on(window, 'scroll', enterLeaveFn);
	events.on(window, 'resize', enterLeaveFn);

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

			sequencers.push(
				Object.create(am.maestro).init({
					element: element,
					states: states,
					triggers: triggers
			}));
		});
	};

})(am.maestro, am.viewport);