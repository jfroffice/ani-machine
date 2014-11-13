am.start = (function(sequencer, viewport, undefined) {
	"use strict";

	var ATTR = 'data-am',
		ATTR_ENTER = 'data-am-enter',
		DEFAULT = 'default',
		ENTER = 'enter',
		sequencers = [],
		enterLeave;

	function enterLeaveFn() {
		if (enterLeave) {
			clearTimeout(enterLeave);
		}

		enterLeave = setTimeout(function() {
			enterLeave = null;

			// check if element need to change state to enter or leave
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
				Object.create(sequencer).init({
					state: DEFAULT,
					element: element,
					states: states,
					triggers: triggers
			}));
		});

		// below to start attribut with only data-am-enter and no data-am
		[].forEach.call(document.querySelectorAll('[' + ATTR_ENTER + ']'), function(element) {

			// TODO: remove duplicate code !!
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

			if (!states.default) {
				//console.log(triggers);

				sequencers.push(
					Object.create(sequencer).init({
						state: ENTER,
						element: element,
						states: states,
						triggers: triggers
				}));
			}
		});
	};

})(am.sequencer, am.viewport);
