am.start = (function(maestro, undefined) {

	return function() {
		[].forEach.call(document.querySelectorAll('[data-am]'), function(element) {

			var states = {},
				triggers = {};

			[].forEach.call(element.attributes, function(attribute) {
				if (attribute.name.indexOf('data-am') !== -1) {

					var state = attribute.name.replace('data-am-', ''),
						input = attribute.value;

					if (state === 'data-am') {
						state = 'default';
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