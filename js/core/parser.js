am.parser = (function() {
	"use strict";

	return function(on) {
		if (on === 'enter') {
			on = 'mouseenter';
		} else if (on === 'leave') {
			on = 'mouseleave';
		}
		return on;
	};
})();