[].forEach.call(document.querySelectorAll('[data-am]'), function(element) {
	//var data = el.getAttribute('data-am');

	var data = {
		'states': { 
			'default': [
				{ 'on': 'active', 'do': ':enter left move 500px', 'goto': 'next'
			}],
			'next': [
				{ 'on': 'active', 'do': ':animate pulse' },
				{ 'on': 'enter',  'do': ':animate tada'  },	
				{ 'on': 'leave',  'do': ':animate flash' }
			]
		},
		'triggers': {
			'next': '.btn--next click'
		}
	};

	var states = data.states,
		triggers = data.triggers || [];

	Object.create(am.maestro).init({
	 	triggers: triggers,
	 	states: states,
	 	element: element
	});
});

