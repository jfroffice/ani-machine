am.init = (function(maestro, undefined) {

	return function(options) {
		[].forEach.call(document.querySelectorAll(options.selector), function(element) {
			Object.create(maestro).init({
			 	element: element,
			 	states: options.states,
			 	triggers: options.triggers
			});
		});
	}

})(am.maestro);