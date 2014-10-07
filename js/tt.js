var tt = (function() {
	"use strict";

	/*function genStyles(lang) {
		return enter.genCSS(lang);
	}

	function parseAction(options) {
		var tmp = options.split(' '),
			selector = tmp[0],
			event = tmp[1],
			over = tmp[2],
			duration = tmp[3];

		// might use map to translate this
		if (event === 'hover') {
			event = 'mouseover';
		} else if (event === 'leave') {
			event = 'mouseleave';
		}

		return {
			event: event,
			selector: selector
		};
	}*/

	return {
		/*parseAction: parseAction,
		genStyles: genStyles,*/
		parseOn: function(on) {
			if (on === 'enter') {
				on = 'mouseenter';
			} else if (on === 'leave') {
				on = 'mouseleave';
			}
			return on;
		}
	};

})();